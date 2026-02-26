# tools/dev-kill-3000.ps1
Write-Host "Killing anything on port 3000..." -ForegroundColor Cyan

$lines = netstat -ano | Select-String ":3000" | ForEach-Object { $_.Line.Trim() } | Where-Object { $_ -match "LISTENING" }

if (-not $lines -or $lines.Count -eq 0) {
  Write-Host "Nothing is listening on port 3000." -ForegroundColor Green
  exit 0
}

$lines | ForEach-Object {
  $parts = ($_ -split "\s+") | Where-Object { $_ -ne "" }
  $pid = $parts[-1]
  if ($pid -match "^\d+$") {
    Write-Host "Killing PID $pid" -ForegroundColor Yellow
    taskkill /PID $pid /F | Out-Null
  }
}

Write-Host "Done." -ForegroundColor Green