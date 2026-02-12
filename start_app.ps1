$frontend = Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -NoNewWindow -PassThru
$backend = Start-Process -FilePath "uvicorn" -ArgumentList "backend.main:app --host 0.0.0.0 --port 8000 --reload" -NoNewWindow -PassThru

Write-Host "CodeHurdle Visualizer Started!"
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend: http://localhost:8000"
Write-Host "Press any key to close..."

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Stop-Process -Id $frontend.Id -ErrorAction SilentlyContinue
Stop-Process -Id $backend.Id -ErrorAction SilentlyContinue
