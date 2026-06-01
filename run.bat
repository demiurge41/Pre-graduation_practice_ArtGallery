@echo off
cd /d "%~dp0"
if not exist .venv\Scripts\python.exe (
  py -3 -m venv .venv
  .venv\Scripts\python.exe -m pip install -r requirements.txt -q
)
.venv\Scripts\python.exe -m scripts.init_db
.venv\Scripts\python.exe -m scripts.seed
echo.
echo Open in browser: http://127.0.0.1:8000/
echo Admin: admin@gallery.local / admin123
echo.
.venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000 --reload
pause
