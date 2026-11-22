@echo off
chcp 65001 >nul
echo ==============================================
echo GeoSeen n8n package - first publish
echo ==============================================
echo.
echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
  echo Node.js is NOT installed.
  echo Please install Node.js from https://nodejs.org/ first, then double-click this file again.
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo Node.js %%v found.
echo.
echo [2/4] Downloading package file...
curl -L -o "%TEMP%\n8n-nodes-geoseen-0.1.0.tgz" "https://raw.githubusercontent.com/KEithwy1030/n8n-nodes-geoseen/main/n8n-nodes-geoseen-0.1.0.tgz"
if errorlevel 1 (
  echo Download failed. Check your internet and run this file again.
  pause
  exit /b 1
)
echo Package downloaded.
echo.
echo [3/4] Logging in to npm...
echo A browser window will open. Please log in as geoseen and complete the security-key check if asked.
call npm login --auth-type=web
if errorlevel 1 (
  echo npm login failed. Please run this file again.
  pause
  exit /b 1
)
echo Logged in.
echo.
echo [4/4] Publishing n8n-nodes-geoseen 0.1.0...
call npm publish "%TEMP%\n8n-nodes-geoseen-0.1.0.tgz" --access public
if errorlevel 1 (
  echo Publish failed. Please send the error above to XiaoMo.
  pause
  exit /b 1
)
echo.
echo ==============================================
echo Published! n8n-nodes-geoseen 0.1.0 is live.
echo ==============================================
pause
