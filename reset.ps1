Write-Host "WARNING: This will remove all containers and container data, and will reset the .env file. This action cannot be undone!" -ForegroundColor Red

$confirmation = Read-Host "Are you sure you want to proceed? (y/N)"
if ($confirmation -notmatch '^[Yy]$') {
    Write-Host "Operation cancelled."
    exit 1
}

Write-Host "Stopping and removing all containers..."
docker compose -f docker-compose.yml -f ./dev/docker-compose.dev.yml down -v --remove-orphans

Write-Host "Cleaning up bind-mounted directories..."
$bindMounts = @(
    ".\volumes\db\data"
)

foreach ($dir in $bindMounts) {
    if (Test-Path $dir) {
        Write-Host "Deleting $dir..."
        Remove-Item -Path $dir -Recurse -Force
    } else {
        Write-Host "Directory $dir does not exist. Skipping bind mount deletion step..."
    }
}

Write-Host "Resetting .env file..."
if (Test-Path ".env") {
    Write-Host "Removing existing .env file..."
    Remove-Item -Path ".env" -Force
} else {
    Write-Host "No .env file found. Skipping .env removal step..."
}

if (Test-Path ".env.example") {
    Write-Host "Copying .env.example to .env..."
    Copy-Item ".env.example" ".env"
} else {
    Write-Host ".env.example file not found. Skipping .env reset step..."
}

Write-Host "Cleanup complete!" -ForegroundColor Green 