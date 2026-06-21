param (
    [string]$NewServer = "localhost"
)

$files = @(
    "AuthService/appsettings.json",
    "BookingService/appsettings.json",
    "HotelService/appsettings.json",
    "LoyaltyService/appsettings.json",
    "PaymentService/appsettings.json",
    "ReviewService/appsettings.json",
    "RoomService/appsettings.json"
)

$escapedServer = $NewServer.Replace("\", "\\")

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        # Replace the server name in the connection string
        $newContent = $content -replace 'Server=localhost\\\\SQLEXPRESS', "Server=$escapedServer"
        $newContent = $newContent -replace 'Server=[^;]+', "Server=$escapedServer"
        Set-Content $file $newContent
        Write-Host "Updated database server to '$NewServer' in $file"
    }
}
