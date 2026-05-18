if (Get-Command bun -ErrorAction SilentlyContinue) {
    Write-Host "Bun észlelve, függőségek telepítése..." -ForegroundColor Cyan
    bun install
} elseif (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "NPM észlelve, függőségek telepítése..." -ForegroundColor Green
    npm install
} else {
    Write-Host "Hiba: Sem a bun, sem az npm nem található a rendszeren!" -ForegroundColor Red
    exit 1
}

Write-Host "Kész! Most már futtathatod: bun dev vagy npm run dev" -ForegroundColor Gold
