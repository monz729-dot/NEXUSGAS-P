# 모든 HTML 파일에서 "R&D 부문"을 "R&D"로 변경
$files = Get-ChildItem -Path "C:\250811\20250812\html\sub" -Filter "*.html" -Recurse
$files += Get-ChildItem -Path "C:\250811\20250812\html\main" -Filter "*.html" -Recurse
$files += Get-ChildItem -Path "C:\250811" -Filter "header-template-sub.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Encoding UTF8
    $newContent = $content -replace 'R&D 부문', 'R&D'
    Set-Content $file.FullName -Value $newContent -Encoding UTF8
    Write-Host "Updated: $($file.Name)"
}

Write-Host "All HTML files updated successfully!"
