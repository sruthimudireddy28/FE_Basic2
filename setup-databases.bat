@echo off
echo Installing/Ensuring dotnet-ef global CLI tool...
dotnet tool install --global dotnet-ef

echo Running Entity Framework migrations for all services...

echo.
echo Setup AuthService Database...
cd AuthService && dotnet ef database update
cd ..

echo.
echo Setup HotelService Database...
cd HotelService && dotnet ef database update
cd ..

echo.
echo Setup RoomService Database...
cd RoomService && dotnet ef database update
cd ..

echo.
echo Setup BookingService Database...
cd BookingService && dotnet ef database update
cd ..

echo.
echo Setup PaymentService Database...
cd PaymentService && dotnet ef database update
cd ..

echo.
echo Setup ReviewService Database...
cd ReviewService && dotnet ef database update
cd ..

echo.
echo Setup LoyaltyService Database...
cd LoyaltyService && dotnet ef database update
cd ..

echo.
echo Database setup complete!
pause
