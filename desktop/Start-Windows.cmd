@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Install Node.js 24 or newer from https://nodejs.org then run this launcher again.
 pause
 exit /b 1
)
node launch.mjs
pause
