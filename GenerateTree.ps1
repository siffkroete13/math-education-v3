$ignoreFile = ".gitignore"
$ignorePatterns = Get-Content $ignoreFile
$root = Get-Location

function Get-Tree {
    param (
        [string]$path,
        [int]$level = 0
    )

    $indent = " " * ($level * 2)
    $items = Get-ChildItem -LiteralPath $path -Force

    foreach ($item in $items) {
        $relativePath = $item.FullName.Substring($root.Length + 1)

        # Check if the item matches any ignore pattern
        $ignore = $false
        foreach ($pattern in $ignorePatterns) {
            if ($relativePath -like "*$pattern*") {
                $ignore = $true
                break
            }
        }

        if (-not $ignore) {
            if ($item.PSIsContainer) {
                Write-Output "$indent|-- $($item.Name)"
                Get-Tree -path $item.FullName -level ($level + 1)
            } else {
                Write-Output "$indent|-- $($item.Name)"
            }
        }
    }
}

Get-Tree -path $root > projektstruktur.txt
