@echo off
title RailSync AI - SIH 2026 Prototype (Team Jugaad Junction)
echo ======================================================================
echo   RAILSYNC AI: AUTOMATIC BLOCK PLANNING PROTOTYPE (SIH26027)
echo   Ministry of Railways - Team Jugaad Junction
echo ======================================================================
echo.
echo 1. Opening interactive web dashboard in your default browser...
start "" "%~dp0index.html"
echo.
echo 2. Starting local Python HTTP server on port 8080...
echo    (Press Ctrl+C at any time to stop)
echo.
python "%~dp0app.py"
pause
