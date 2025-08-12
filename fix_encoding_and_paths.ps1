# 인코딩 및 경로 문제 수정 스크립트

Set-Location "C:\250811\20250810\html\en"

Get-ChildItem -Filter "*.html" | ForEach-Object {
    $file = $_.Name
    
    Write-Host "Fixing $file..."
    
    # 파일 내용을 UTF-8로 읽기 (원시 바이트로 읽어서 인코딩 문제 해결)
    $content = Get-Content $file -Raw -Encoding UTF8
    
    # 중복 경로 ../sub/../sub/ 를 ../sub/ 로 수정
    $content = $content -replace '\.\./sub/\.\./sub/', '../sub/'
    
    # 깨진 한글 문자 수정
    $content = $content -replace '\?\쒓뎅\?\?', '한국어'
    $content = $content -replace '\?\듯빀', '통합'
    $content = $content -replace '硫붽\?硫붾돱', '메가메뉴'
    $content = $content -replace '而щ읆', '컬럼'
    $content = $content -replace '\?ъ뾽遺꾩빞', '사업분야'
    $content = $content -replace '\?붾（\?섎텇\?\?', '솔루션분야'
    $content = $content -replace '\?띾낫', '홍보'
    $content = $content -replace '吏\?\띻\?\?κ꼍\?\?', '지속가능경영'
    $content = $content -replace '梨꾩슜', '채용'
    
    # UTF-8 BOM 없이 저장
    [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.UTF8Encoding]::new($false))
    
    Write-Host "Fixed $file"
}

Write-Host "All files fixed!"