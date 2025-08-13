# 한글 서브 페이지 인코딩 문제 수정 스크립트

Set-Location "C:\250811\20250810\html\sub"

Write-Host "한글 서브 페이지 인코딩 문제를 수정합니다..."

Get-ChildItem -Filter "*.html" | ForEach-Object {
    $file = $_.Name
    
    Write-Host "Fixing $file..."
    
    try {
        # 파일 내용을 UTF-8로 읽기
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 깨진 한글 문자들을 올바른 한글로 수정
        $content = $content -replace '湲곗뾽\?뚭컻', '조직도비전'
        $content = $content -replace '湲곗뾽', '조직도'
        $content = $content -replace '뚭컻', '비전'
        
        # UTF-8 BOM 없이 저장
        [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.UTF8Encoding]::new($false))
        
        Write-Host "Fixed $file"
    }
    catch {
        Write-Host "Error fixing $file : $_"
    }
}

Write-Host "모든 한글 서브 페이지 인코딩 문제가 수정되었습니다!"
