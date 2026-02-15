$ErrorActionPreference = "Stop"

# Load admin session into $global:session and $session
. "$PSScriptRoot\admin-session.ps1"
$session = $global:session

function Ok($msg) { Write-Host "[OK] $msg" }
function Fail($msg) { Write-Host "[FAIL] $msg"; exit 1 }

Write-Host ""
Write-Host "=== 1) GET /api/admin/submissions ==="
$sub = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/submissions" -WebSession $session
if (-not $sub.ok) { Fail "submissions not ok" }
Ok ("submissions ok; rows=" + $sub.rows.Count)

$requestId = $sub.rows[0].requestId

Write-Host ""
Write-Host "=== 2) POST /api/admin/status ($requestId -> in_review) ==="
$upd = Invoke-RestMethod `
  -Method POST `
  -Uri "http://localhost:3000/api/admin/status" `
  -WebSession $session `
  -ContentType "application/json" `
  -Body (@{
    requestId = $requestId
    status    = "in_review"
  } | ConvertTo-Json)

if (-not $upd.ok) { Fail "status update failed" }
Ok "status update ok"

Write-Host ""
Write-Host "=== 3) Re-GET /api/admin/submissions (confirm change) ==="
$sub2 = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/submissions" -WebSession $session
$found = $sub2.rows | Where-Object { $_.requestId -eq $requestId } | Select-Object -First 1
if (-not $found) { Fail "requestId not found after update" }
Ok ("found $requestId; status=" + $found.status)

Write-Host ""
Write-Host "[PASS] SMOKE TEST PASSED"
