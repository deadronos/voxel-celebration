param(
  [switch]$Commit
)

$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$RepoRoot = (Resolve-Path (Join-Path $RepoRoot "..")).Path
$src = Join-Path $RepoRoot "skills"
$dst = Join-Path $RepoRoot ".github\skills"

if (!(Test-Path $dst)) { New-Item -ItemType Directory -Path $dst -Force | Out-Null }

Write-Host "Running robocopy $src -> $dst"
# Use MIR to mirror source to dest
robocopy $src $dst /MIR /Z /R:2 /W:5 | Out-Null

if ($Commit) {
  Set-Location $RepoRoot
  git add .github/skills
  git commit -m "chore(skills): sync .github/skills from skills/ (automated)"
  Write-Host "Committed changes"
}
