@echo off
echo Stopping process on port 8081...
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running as administrator...
    echo.
    
    REM Stop the process using port 8081
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
        echo Stopping process PID %%a...
        taskkill /F /PID %%a >nul 2>&1
        if %errorLevel% == 0 (
            echo Successfully stopped process %%a
        ) else (
            echo Failed to stop process %%a (may require different method)
        )
    )
    
    echo.
    echo Port 8081 should now be free!
    echo You can now run: npm start
) else (
    echo ERROR: This script must be run as Administrator!
    echo.
    echo Right-click on this file and select "Run as administrator"
    echo OR
    echo Run PowerShell as admin and execute: .\free-port-8081.bat
)

pause

