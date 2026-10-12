@echo off
rem MultipleCorp Golden Reference: local read-only server (r13 persistent shell, docs/PERSISTENT_SHELL.md).
rem Double-click: starts tools\serve.py on http://127.0.0.1:8137/ in its own window and opens the Beranda in the
rem default browser. Another port: set MC_PORT=8140 before running (or: python tools\serve.py --port 8140);
rem serve.py reads and checks MC_PORT itself (a whole number 1-65535): nothing of it is spliced into a command.
rem Already running (double-clicked twice): the browser opens at the running server.
rem Stop: Ctrl+C in the server window, or close that window.
setlocal
cd /d "%~dp0"

set "PY="
if exist "%LOCALAPPDATA%\Python\bin\python.exe" set "PY=%LOCALAPPDATA%\Python\bin\python.exe"
if not defined PY (
  py -3 -c "import sys" >nul 2>nul && set "PY=py -3"
)
if not defined PY (
  python -c "import sys" >nul 2>nul && set "PY=python"
)
if not defined PY (
  echo Python 3 tidak ditemukan.
  echo Pasang Python 3 dari https://www.python.org/ lalu jalankan serve.cmd lagi.
  echo Tanpa server, halaman tetap bisa dibuka langsung dari folder pages\ ^(muat ulang penuh^).
  pause
  exit /b 1
)

rem The server gets its OWN console window (start) and this batch ends at once: Ctrl+C in that window stops the
rem server and closes the window without cmd's "Terminate batch job (Y/N)?" question. With --window, serve.py
rem waits for Enter after a failure (busy port, invalid MC_PORT) so the message can be read.
rem MC_SERVE_TEST (QA only, scratch/r13/phase3fix2/serve_repro.py) starts that window minimised.
set "WIN="
if defined MC_SERVE_TEST set "WIN=/min"
if "%PY%"=="py -3" (
  start "MultipleCorp Golden Reference - server lokal" %WIN% py -3 tools\serve.py --open --window
) else (
  start "MultipleCorp Golden Reference - server lokal" %WIN% "%PY%" tools\serve.py --open --window
)
endlocal
exit /b 0
