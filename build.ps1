param(
    [ValidateSet("Debug", "Release")]
    [string]$Configuration = "Release",
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$project = Join-Path $root "src\PunisherBanna\PunisherBanna.csproj"
$solution = Join-Path $root "PunisherBanna.slnx"
[xml]$projectXml = Get-Content -LiteralPath $project
$version = [string]$projectXml.Project.PropertyGroup.Version
$artifactRoot = Join-Path $root "artifacts"
$packageFolder = Join-Path $artifactRoot "PunisherBanna_$version"
$packageFile = Join-Path $artifactRoot "PunisherBanna_$version.zip"
$output = Join-Path $root "src\PunisherBanna\bin\$Configuration\net10.0"

if (-not $SkipTests) {
    dotnet test $solution --configuration $Configuration
    if ($LASTEXITCODE -ne 0) {
        throw "Tests failed."
    }
}

dotnet build $project --configuration $Configuration --no-restore
if ($LASTEXITCODE -ne 0) {
    throw "Build failed."
}

New-Item -ItemType Directory -Force -Path $artifactRoot | Out-Null
if (Test-Path -LiteralPath $packageFolder) {
    Remove-Item -LiteralPath $packageFolder -Recurse -Force
}
if (Test-Path -LiteralPath $packageFile) {
    Remove-Item -LiteralPath $packageFile -Force
}

New-Item -ItemType Directory -Path $packageFolder | Out-Null
Copy-Item -LiteralPath (Join-Path $output "Jellyfin.Plugin.PunisherBanna.dll") -Destination $packageFolder
Copy-Item -LiteralPath (Join-Path $root "LICENSE") -Destination $packageFolder
Compress-Archive -Path (Join-Path $packageFolder "*") -DestinationPath $packageFile -CompressionLevel Optimal

$md5 = (Get-FileHash -LiteralPath $packageFile -Algorithm MD5).Hash.ToLowerInvariant()
Write-Host "Package: $packageFile"
Write-Host "MD5:     $md5"
