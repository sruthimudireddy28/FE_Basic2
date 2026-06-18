using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.DTOs;
using PaymentService.Models;
using System.Text.Json;

namespace PaymentService.Services
{
    public class PaymentProcessingService : IPaymentProcessingService
    {
        private readonly PaymentDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public PaymentProcessingService(PaymentDbContext context, HttpClient httpClient, IConfiguration configuration)
        {
            _context = context;
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<ApiResponse<PaymentResponseDto>> InitiatePaymentAsync(CreatePaymentDto request, int userId)
        {
            // Check if booking already has a Completed payment
            var completedPayment = await _context.Payments
                .FirstOrDefaultAsync(p => p.BookingId == request.BookingId && p.Status == "Completed");

            if (completedPayment != null)
            {
                return ApiResponse<PaymentResponseDto>.FailResponse("Payment already completed for this booking");
            }

            // Check if booking already has a Pending payment in progress
            var pendingPayment = await _context.Payments
                .FirstOrDefaultAsync(p => p.BookingId == request.BookingId && p.Status == "Pending");

            if (pendingPayment != null)
            {
                return ApiResponse<PaymentResponseDto>.FailResponse($"A payment is already in progress for this booking. Payment ID: {pendingPayment.PaymentId}");
            }

           
            // If the user wants to redeem loyalty points, call LoyaltyService
            // to deduct the points and get back the discount amount
            decimal loyaltyDiscountAmount = 0;
            int pointsRedeemed = 0;

            if (request.PointsToRedeem > 0)
            {
                var redemptionResult = await RedeemLoyaltyPointsAsync(userId, request.BookingId, request.PointsToRedeem);

                if (redemptionResult == null)
                {
                    // Redemption failed  if not enough points
                    return ApiResponse<PaymentResponseDto>.FailResponse(
                        "Failed to redeem loyalty points. Please check your points balance and try again, or set PointsToRedeem to 0 to skip.");
                }

                loyaltyDiscountAmount = redemptionResult.DiscountAmount;
                pointsRedeemed = redemptionResult.PointsUsed;
            }

            // Final amount = original amount minus loyalty discount 
            var finalAmount = Math.Max(0, request.Amount - loyaltyDiscountAmount);

            var payment = new Payment
            {
                UserId = userId,
                BookingId = request.BookingId,
                Amount = request.Amount,
                LoyaltyDiscountAmount = loyaltyDiscountAmount,
                PointsRedeemed = pointsRedeemed,
                FinalAmount = finalAmount,
                Status = "Pending",
                PaymentMethod = request.PaymentMethod,
                TransactionId = GenerateTransactionId(),
                Currency = request.Currency,
                Description = request.Description,
                CardLastFourDigits = !string.IsNullOrEmpty(request.CardNumber) && request.CardNumber.Length >= 4
                    ? request.CardNumber.Substring(request.CardNumber.Length - 4)
                    : string.Empty,
                CardHolderName = request.CardHolderName,
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            var successMessage = loyaltyDiscountAmount > 0
                ? $"Payment initiated. Loyalty discount of {loyaltyDiscountAmount:C} applied. You pay {finalAmount:C}"
                : "Payment initiated successfully";

            var response = MapToPaymentResponse(payment);
            return ApiResponse<PaymentResponseDto>.SuccessResponse(response, successMessage);
        }

        public async Task<ApiResponse<PaymentResponseDto>> ProcessPaymentAsync(ProcessPaymentDto request)
        {
            var payment = await _context.Payments.FindAsync(request.PaymentId);

            if (payment == null)
            {
                return ApiResponse<PaymentResponseDto>.FailResponse("Payment not found");
            }

            if (payment.Status == "Completed")
            {
                return ApiResponse<PaymentResponseDto>.FailResponse("Payment already processed");
            }

            if (request.IsSuccessful)
            {
                payment.Status = "Completed";
                payment.TransactionId = request.TransactionId;
                payment.PaymentDate = DateTime.UtcNow;

                // Update booking status via HttpClient
                await UpdateBookingPaymentAsync(payment.BookingId, payment.PaymentId);

                // Earn loyalty points on the FinalAmount (what user actually paid)
                // This is fire-and-forget — payment success does NOT depend on this call
                await EarnLoyaltyPointsAsync(payment.UserId, payment.BookingId, payment.FinalAmount);
            }
            else
            {
                payment.Status = "Failed";
                payment.Description = request.FailureReason;

                // If payment fails and points were already redeemed during initiation,
                // reverse the redemption so the user gets their points back
                if (payment.PointsRedeemed > 0)
                {
                    await ReverseLoyaltyRedemptionAsync(
                        payment.UserId,
                        payment.PointsRedeemed,
                        $"Points reversed — payment failed for booking #{payment.BookingId}");
                }
            }

            payment.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var response = MapToPaymentResponse(payment);
            var message = request.IsSuccessful ? "Payment processed successfully" : "Payment failed";
            return ApiResponse<PaymentResponseDto>.SuccessResponse(response, message);
        }

        public async Task<ApiResponse<PaymentResponseDto>> GetPaymentByIdAsync(int paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);

            if (payment == null)
            {
                return ApiResponse<PaymentResponseDto>.FailResponse("Payment not found");
            }

            var response = MapToPaymentResponse(payment);
            return ApiResponse<PaymentResponseDto>.SuccessResponse(response);
        }

        public async Task<ApiResponse<PaymentResponseDto>> GetPaymentByBookingIdAsync(int bookingId)
        {
            var payment = await _context.Payments
                .Where(p => p.BookingId == bookingId)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            if (payment == null)
            {
                return ApiResponse<PaymentResponseDto>.FailResponse("Payment not found for this booking");
            }

            var response = MapToPaymentResponse(payment);
            return ApiResponse<PaymentResponseDto>.SuccessResponse(response);
        }

        public async Task<ApiResponse<List<PaymentResponseDto>>> GetUserPaymentsAsync(int userId)
        {
            var payments = await _context.Payments
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var response = payments.Select(MapToPaymentResponse).ToList();
            return ApiResponse<List<PaymentResponseDto>>.SuccessResponse(response);
        }

        public async Task<ApiResponse<List<PaymentResponseDto>>> SearchPaymentsAsync(PaymentSearchDto searchDto)
        {
            var query = _context.Payments.AsQueryable();

            if (searchDto.UserId.HasValue)
            {
                query = query.Where(p => p.UserId == searchDto.UserId.Value);
            }

            if (searchDto.BookingId.HasValue)
            {
                query = query.Where(p => p.BookingId == searchDto.BookingId.Value);
            }

            if (!string.IsNullOrEmpty(searchDto.Status))
            {
                query = query.Where(p => p.Status == searchDto.Status);
            }

            if (!string.IsNullOrEmpty(searchDto.PaymentMethod))
            {
                query = query.Where(p => p.PaymentMethod == searchDto.PaymentMethod);
            }

            if (searchDto.FromDate.HasValue)
            {
                query = query.Where(p => p.CreatedAt >= searchDto.FromDate.Value);
            }

            if (searchDto.ToDate.HasValue)
            {
                query = query.Where(p => p.CreatedAt <= searchDto.ToDate.Value);
            }

            var payments = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
            var response = payments.Select(MapToPaymentResponse).ToList();
            return ApiResponse<List<PaymentResponseDto>>.SuccessResponse(response);
        }

        public async Task<ApiResponse<PaymentResponseDto>> RefundPaymentAsync(int paymentId, RefundPaymentDto request, int userId, string role)
        {
            var payment = await _context.Payments.FindAsync(paymentId);

            if (payment == null)
            {
                return ApiResponse<PaymentResponseDto>.FailResponse("Payment not found");
            }

            if (role != "Admin" && role != "Manager")
            {
                return ApiResponse<PaymentResponseDto>.FailResponse("Only Admin or Manager can process refunds");
            }

            if (payment.Status != "Completed")
            {
                return ApiResponse<PaymentResponseDto>.FailResponse("Can only refund completed payments");
            }

            if (request.RefundAmount > payment.FinalAmount)
            {
                return ApiResponse<PaymentResponseDto>.FailResponse("Refund amount cannot exceed the final charged amount");
            }

            payment.Status = "Refunded";
            payment.RefundAmount = request.RefundAmount;
            payment.RefundReason = request.RefundReason;
            payment.RefundDate = DateTime.UtcNow;
            payment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var response = MapToPaymentResponse(payment);
            return ApiResponse<PaymentResponseDto>.SuccessResponse(response, "Payment refunded successfully");
        }

        public async Task<ApiResponse> UpdatePaymentStatusAsync(int paymentId, string status)
        {
            var payment = await _context.Payments.FindAsync(paymentId);

            if (payment == null)
            {
                return ApiResponse.FailResponse("Payment not found");
            }

            payment.Status = status;
            payment.UpdatedAt = DateTime.UtcNow;

            if (status == "Completed")
            {
                payment.PaymentDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return ApiResponse.SuccessResponse($"Payment status updated to {status}");
        }

        // ─────────────────────────────────────────────────────────────────────
        // PRIVATE: LoyaltyService HTTP helpers
        // ─────────────────────────────────────────────────────────────────────

        // Calls LoyaltyService to redeem points and get back the discount amount
        private async Task<LoyaltyRedemptionResult?> RedeemLoyaltyPointsAsync(int userId, int bookingId, int pointsToRedeem)
        {
            try
            {
                var loyaltyServiceUrl = _configuration["ServiceUrls:LoyaltyService"];

                var payload = new
                {
                    PointsToRedeem = pointsToRedeem,
                    BookingId = bookingId,
                    Description = $"Points redeemed during payment for booking #{bookingId}"
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(payload),
                    System.Text.Encoding.UTF8,
                    "application/json");

                var response = await _httpClient.PostAsync(
                    $"{loyaltyServiceUrl}/api/loyalty/{userId}/redeem", content);

                if (!response.IsSuccessStatusCode)
                    return null;

                var responseBody = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var result = JsonSerializer.Deserialize<LoyaltyApiResponse>(responseBody, options);

                if (result?.Success == true && result.Data != null)
                {
                    return new LoyaltyRedemptionResult
                    {
                        DiscountAmount = result.Data.DiscountAmount,
                        PointsUsed = result.Data.PointsUsed
                    };
                }

                return null;
            }
            catch
            {
                return null;
            }
        }

        // Calls LoyaltyService to earn points after a successful payment
        // Points are earned on FinalAmount (what user actually paid, not full amount)
        private async Task EarnLoyaltyPointsAsync(int userId, int bookingId, decimal finalAmount)
        {
            try
            {
                var loyaltyServiceUrl = _configuration["ServiceUrls:LoyaltyService"];

                var payload = new
                {
                    BookingId = bookingId,
                    BookingAmount = finalAmount
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(payload),
                    System.Text.Encoding.UTF8,
                    "application/json");

                await _httpClient.PostAsync(
                    $"{loyaltyServiceUrl}/api/loyalty/{userId}/earn", content);
            }
            catch
            {
                // Points earning failure must NOT fail the payment — just ignore
            }
        }

        // Calls LoyaltyService to add points back if payment failed after points were deducted
        private async Task ReverseLoyaltyRedemptionAsync(int userId, int pointsToRestore, string reason)
        {
            try
            {
                var loyaltyServiceUrl = _configuration["ServiceUrls:LoyaltyService"];

                var payload = new
                {
                    Points = pointsToRestore,
                    Reason = reason
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(payload),
                    System.Text.Encoding.UTF8,
                    "application/json");

                await _httpClient.PostAsync(
                    $"{loyaltyServiceUrl}/api/loyalty/{userId}/bonus", content);
            }
            catch
            {
               
            }
        }

        private async Task UpdateBookingPaymentAsync(int bookingId, int paymentId)
        {
            try
            {
                var bookingServiceUrl = _configuration["ServiceUrls:BookingService"];
                var content = new StringContent(
                    JsonSerializer.Serialize(new { PaymentId = paymentId }),
                    System.Text.Encoding.UTF8,
                    "application/json");

                await _httpClient.PutAsync($"{bookingServiceUrl}/api/bookings/{bookingId}/payment", content);
            }
            catch
            {
                // Log error but don't fail the payment
            }
        }

        private string GenerateTransactionId()
        {
            return $"TXN{DateTime.UtcNow:yyyyMMddHHmmss}{new Random().Next(1000, 9999)}";
        }

        private PaymentResponseDto MapToPaymentResponse(Payment payment)
        {
            return new PaymentResponseDto
            {
                PaymentId = payment.PaymentId,
                UserId = payment.UserId,
                BookingId = payment.BookingId,
                Amount = payment.Amount,
                LoyaltyDiscountAmount = payment.LoyaltyDiscountAmount,
                PointsRedeemed = payment.PointsRedeemed,
                FinalAmount = payment.FinalAmount,
                Status = payment.Status,
                PaymentMethod = payment.PaymentMethod,
                TransactionId = payment.TransactionId,
                Currency = payment.Currency,
                Description = payment.Description,
                CardLastFourDigits = payment.CardLastFourDigits,
                PaymentDate = payment.PaymentDate,
                RefundAmount = payment.RefundAmount,
                CreatedAt = payment.CreatedAt
            };
        }
    }

    // Helper classes for reading LoyaltyService HTTP response
    internal class LoyaltyApiResponse
    {
        public bool Success { get; set; }
        public LoyaltyRedemptionResult? Data { get; set; }
    }

    internal class LoyaltyRedemptionResult
    {
        public decimal DiscountAmount { get; set; }
        public int PointsUsed { get; set; }
    }
}