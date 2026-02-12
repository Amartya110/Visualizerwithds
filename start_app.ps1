$frontend = Start-Process powershell -ArgumentList "cd frontend; npm run dev" -PassThru
$backend = Start-Process powershell -ArgumentList "uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload" -PassThru
Write-Host "CodeHurdle Visualizer Started!"
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend: http://localhost:8000"
Write-Host "Press any key to close launcher (servers will keep running in new windows)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
