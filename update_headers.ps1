# 영문 페이지들의 헤더를 일괄 업데이트하는 PowerShell 스크립트

Set-Location "C:\250811\20250810\html\en"

# 헤더 템플릿 파일 경로
$templatePath = "C:\250811\header-template-en.html"
$templateContent = Get-Content $templatePath -Raw

# 각 HTML 파일별로 헤더 업데이트
Get-ChildItem -Filter "*.html" | ForEach-Object {
    $file = $_.Name
    $basename = [System.IO.Path]::GetFileNameWithoutExtension($file)
    
    Write-Host "Processing $file..."
    
    # KR_PAGE 경로 결정
    if ($basename -eq "MN01") {
        $krPage = "../main/MN01.html"
    } else {
        $krPage = "../sub/$basename.html"
    }
    
    # 템플릿에서 {KR_PAGE} 치환
    $newHeader = $templateContent -replace '\{KR_PAGE\}', $krPage
    
    # 파일 내용 읽기
    $content = Get-Content $file -Raw
    
    # 정규식으로 헤더 섹션 찾기 및 교체
    $pattern = '(?s)<!-- HEADER -->.*?</header>'
    $newContent = $content -replace $pattern, $newHeader
    
    # 파일에 새 내용 쓰기
    Set-Content -Path $file -Value $newContent -Encoding UTF8
    
    Write-Host "Updated $file with Korean page: $krPage"
}

Write-Host "All headers updated successfully!"