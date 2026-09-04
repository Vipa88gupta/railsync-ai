@echo off
echo ========================================================
echo   RailSync AI - Auto-Push to GitHub
echo ========================================================
echo.
git add .
git commit -m "Auto update RailSync AI prototype"
git push -u origin main
echo.
echo ========================================================
echo   Done! Your changes have been pushed to GitHub.
echo ========================================================
pause
