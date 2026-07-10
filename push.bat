@echo off
setlocal enabledelayedexpansion
rem === 一鍵 push 到 GitHub ===
rem 用法：直接雙擊，或在終端機執行  push.bat "你的 commit 訊息"
rem 若不給訊息，會提示你輸入；直接 Enter 則用時間戳當訊息。

rem --- UTF-8：讓中文 commit 訊息與檔名正常 ---
chcp 65001 >nul
cd /d "%~dp0"

rem --- 確保 git 以 UTF-8 處理訊息 ---
git config i18n.commitEncoding utf-8 >nul 2>&1
git config i18n.logOutputEncoding utf-8 >nul 2>&1

rem --- 確保在 main 分支（首次從 master 改名）---
for /f "delims=" %%b in ('git branch --show-current') do set "BRANCH=%%b"
if /i "!BRANCH!"=="master" (
    git branch -M main
    set "BRANCH=main"
)
if "!BRANCH!"=="" set "BRANCH=main"

rem --- 若沒有 origin，提示輸入一次並記住 ---
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo [設定] 尚未設定遠端 repo。
    set /p "REPOURL=請貼上 GitHub repo 網址（https 或 git@ 皆可）: "
    if "!REPOURL!"=="" (
        echo 未輸入網址，已取消。
        pause
        exit /b 1
    )
    git remote add origin "!REPOURL!"
)

rem --- 取得 commit 訊息：優先用參數，其次提示，最後用時間戳 ---
set "MSG=%~1"
if "!MSG!"=="" (
    set /p "MSG=請輸入 commit 訊息（直接 Enter 用時間戳）: "
)
if "!MSG!"=="" (
    set "MSG=update %date% %time%"
)

echo.
echo === git add ===
git add -A

rem --- 若沒有變更就跳過 commit，仍嘗試 push（處理上次沒 push 成功的情況）---
git diff --cached --quiet
if errorlevel 1 (
    echo === git commit ===
    git commit -m "!MSG!"
) else (
    echo 沒有新的變更，略過 commit。
)

echo.
echo === git push origin !BRANCH! ===
git push -u origin "!BRANCH!"
if errorlevel 1 (
    echo.
    echo [失敗] push 沒有成功，請看上面的錯誤訊息。
    pause
    exit /b 1
)

echo.
echo [完成] 已推送到 origin/!BRANCH!
pause
endlocal
