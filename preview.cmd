@echo off
REM Double-click this file to preview the CAS website.
REM It serves the generated site/ folder and opens it in your browser.
REM Close this black window when you are done to stop the server.

cd /d "%~dp0"

if not exist "site\index.html" (
  echo The site has not been built yet. Building it now...
  python build\generate.py
  echo.
)

echo.
echo   CAS website preview
echo   -------------------
echo   Address:  http://localhost:8099
echo   To stop:  close this window, or press Ctrl+C
echo.

start "" "http://localhost:8099"
python -m http.server 8099 --bind 127.0.0.1 --directory site
