$Start-Process -FilePath "npm" -ArgumentList "run dev" -NoNewWindow
Start-Process -FilePath "uvicorn" -ArgumentList "backend.main:app --reload --port 8000" -NoNewWindowad" -PassThru
Write-Host "CodeHurdle Visualizer Started!"
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend: http://localhost:8000"
Write-Host "Press any key to close launcher (servers will keep running in new windows)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
