@echo off
cd /d "%~dp0ctk"

echo Installing npm dependencies...
npm install

echo.
echo Starting TMF CTK...
echo.

npm start

echo.
echo Exit code: %ERRORLEVEL%
echo.
pause