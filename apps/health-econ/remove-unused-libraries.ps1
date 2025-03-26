# List of unused libraries to remove
$unusedLibraries = @(
    "ts-prune"  # Only used for finding unused code
)

# Function to remove a library
function Remove-UnusedLibrary {
    param (
        [string]$library
    )
    
    Write-Host "Removing $library..."
    pnpm remove $library
}

# Remove each unused library
foreach ($library in $unusedLibraries) {
    Remove-UnusedLibrary -library $library
}

Write-Host "Finished removing unused libraries." 