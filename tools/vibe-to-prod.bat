@echo off
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo   Python is not installed on this computer.
    echo.
    echo   To install Python:
    echo   1. Go to https://www.python.org/downloads/
    echo   2. Download the latest version
    echo   3. IMPORTANT: Check "Add Python to PATH" during installation
    echo   4. After installing, double-click this file again
    echo.
    pause
    exit /b 1
)
python "%~dp0vibe-to-prod.py"
pause
