@echo off
chcp 65001 > nul
title Respublika Yagona Sug'urta Portali — Sugurta.uz
cls
echo ===================================================================
echo   🛡️  RESPUBLIKA YAGONA SUG'URTA PORTALI (SUGURTA.UZ)
echo   🚀  Server ishga tushirilmoqda...
echo ===================================================================
cd /d "%~dp0"
timeout /t 1 > nul
start "" "http://localhost:5000"
node server.js
pause
