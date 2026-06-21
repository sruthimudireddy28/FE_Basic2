@echo off
echo ===================================================
echo SQL Server Instance Configurator for Microservices
echo ===================================================
echo.
echo Please enter your SQL Server instance name.
echo Common options:
echo   - (localdb)\MSSQLLocalDB  (Visual Studio LocalDB)
echo   - localhost               (Standard Local Instance)
echo   - .                       (Alternative Default Local Instance)
echo   - localhost\SQLEXPRESS    (SQL Server Express)
echo.
set /p server="Enter SQL Server Instance: "

if "%server%"=="" (
    echo No server entered. Exiting.
    pause
    exit /b
)

powershell -ExecutionPolicy Bypass -File update-sql-server.ps1 -NewServer "%server%"
echo.
echo Server configuration updated successfully!
echo Now please run setup-databases.bat to initialize/migrate the databases.
echo.
pause
