# CO01.html의 정상적인 헤더를 다른 서브 페이지들에 일괄 적용하는 스크립트

Set-Location "C:\250811\20250810\html\sub"

Write-Host "CO01.html의 정상적인 헤더를 다른 서브 페이지들에 적용합니다..."

# CO01.html에서 정상적인 헤더 부분 추출 (시작부터 </header>까지)
$templateHeader = Get-Content "CO01.html" -Raw | Select-String -Pattern '(?s)<!doctype html>.*?</header>' | ForEach-Object { $_.Matches[0].Value }

# 모든 HTML 파일에 대해 헤더 교체
Get-ChildItem -Filter "*.html" | Where-Object { $_.Name -ne "CO01.html" } | ForEach-Object {
    $file = $_.Name
    Write-Host "Processing $file..."
    
    try {
        # 파일 내용 읽기
        $content = Get-Content $file -Raw
        
        # 기존 헤더 부분 제거 (시작부터 </header>까지)
        $contentWithoutHeader = $content -replace '(?s)<!doctype html>.*?</header>', ''
        
        # 새로운 헤더 추가
        $newContent = $templateHeader + $contentWithoutHeader
        
        # 파일 저장
        [System.IO.File]::WriteAllText($_.FullName, $newContent, [System.Text.UTF8Encoding]::new($false))
        
        Write-Host "Updated $file"
    }
    catch {
        Write-Host "Error processing $file : $_"
    }
}

Write-Host "모든 서브 페이지 헤더가 CO01.html 템플릿으로 업데이트되었습니다!"
