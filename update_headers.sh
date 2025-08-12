#!/bin/bash

# 영문 페이지들의 헤더를 일괄 업데이트하는 스크립트

cd "C:\250811\20250810\html\en"

# 헤더 템플릿 파일 경로
TEMPLATE="C:\250811\header-template-en.html"

# 각 파일별로 헤더 업데이트
for file in *.html; do
    if [[ -f "$file" ]]; then
        echo "Processing $file..."
        
        # 파일명에서 확장자 제거
        basename=$(basename "$file" .html)
        
        # KR_PAGE 경로 결정
        if [[ "$basename" == "MN01" ]]; then
            kr_page="../main/MN01.html"
        else
            kr_page="../sub/$basename.html"
        fi
        
        # 템플릿에서 {KR_PAGE} 치환
        sed "s|{KR_PAGE}|$kr_page|g" "$TEMPLATE" > temp_header.html
        
        # 기존 헤더 제거하고 새 헤더 삽입
        # <!-- HEADER -->부터 </header>까지 제거하고 새 헤더로 교체
        awk '
        BEGIN { in_header = 0; header_done = 0 }
        /<!-- HEADER -->/ { 
            in_header = 1; 
            if (!header_done) {
                system("cat temp_header.html");
                header_done = 1;
            }
            next;
        }
        /<\/header>/ { 
            in_header = 0; 
            next;
        }
        !in_header { print }
        ' "$file" > "${file}.tmp"
        
        mv "${file}.tmp" "$file"
        echo "Updated $file with Korean page: $kr_page"
    fi
done

# 임시 파일 삭제
rm -f temp_header.html

echo "All headers updated successfully!"