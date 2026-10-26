@echo off
rem Double-click to run Autumn Buddy. Installs dependencies on first run, then opens the app in your browser.
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies, this only happens once...
  call npm install
)
call npm run dev -- --open
