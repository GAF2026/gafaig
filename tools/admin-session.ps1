# Creates a reusable admin session cookie object for Invoke-RestMethod.
# Usage:
#   . .\tools\admin-session.ps1
#   Invoke-RestMethod -Uri "http://localhost:3000/api/admin/submissions" -WebSession $session

$global:session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

$cookieObj = New-Object System.Net.Cookie
$cookieObj.Name   = "gafaig_admin"
$cookieObj.Value  = "1"
$cookieObj.Path   = "/"
$cookieObj.Domain = "localhost"

$global:session.Cookies.Add($cookieObj)

Write-Host "[OK] Admin session created in `$global:session"
Write-Host "     Cookie: gafaig_admin=1; Domain=localhost; Path=/"
Write-Host ""
Write-Host "Next test:"
Write-Host "Invoke-RestMethod -Uri ""http://localhost:3000/api/admin/submissions"" -WebSession `$session"
