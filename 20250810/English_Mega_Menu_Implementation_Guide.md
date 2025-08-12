# English Mega Menu Implementation Guide

## Overview
This guide provides instructions for implementing the standardized English mega menu system across all English pages, matching the successful Korean mega menu structure.

## Current Status
- ✅ English mega menu template created
- ✅ CO01.html updated with new mega menu structure
- 🔄 Remaining English pages need to be updated

## English Menu Structure

### Top-Level Navigation
| Korean | English | data-menu |
|--------|---------|-----------|
| NEXUSGAS | NEXUSGAS | nexus |
| 사업분야 | Business | business |
| 솔루션분야 | Solutions | solution |
| 홍보 | Media | pr |
| 지속가능경영 | Sustainability | esg |
| 채용 | Careers | recruit |

### Sub-Menu Translations

#### NEXUSGAS Column (data-col="nexus")
- 기업소개 → Company Overview (CO01.html)
- 인사말 → CEO Message (CO04.html)
- 연혁 → History (CO05.html)
- CI → CI (CO06.html)
- 찾아오시는 길 → Location (CO07.html)

#### Business Column (data-col="business")
- 수소 인프라 → Hydrogen Infrastructure (BU01.html)
- LNG 인프라 → LNG Infrastructure (BU02.html)
- LPG 인프라 → LPG Infrastructure (BU03.html)
- 기술 → Technology (BU11.html)

#### Solutions Column (data-col="solution")
- NEXUS™ → NEXUS™ (SU01.html)
- R&D → R&D (BU31.html)

#### Media Column (data-col="pr")
- 뉴스 → News (MK01.html)
- 자료실 → Resources (MK01.html)
- 프로젝트 → Projects (MK21.html)

#### Sustainability Column (data-col="esg")
- ESG경영 → ESG Management (EM01.html)
- 안전·보건·환경 → Safety·Health·Environment (EM02.html)
- 윤리경영 → Ethics Management (EM03.html)
- 품질경영 → Quality Management (EM04.html)
- 사회공헌 → Social Contribution (HV01.html)

#### Careers Column (data-col="recruit")
- 인재상 → Talent Vision (FAQ01.html)
- 채용안내 → Recruitment (FAQ01.html)
- 지원서 접수 → Application (FAQ01.html)

## Implementation Steps

### For Each English Page:

1. **Replace Header Navigation Section**
   ```html
   <!-- Replace old dropdown navigation with this mega menu structure -->
   <div class="main-header__gnb gnb">
     <ul class="gnb__list" role="menubar">
       <li class="gnb__item">
         <a href="#" class="gnb__link" data-menu="nexus">NEXUSGAS</a>
       </li>
       <li class="gnb__item">
         <a href="#" class="gnb__link" data-menu="business">Business</a>
       </li>
       <li class="gnb__item">
         <a href="#" class="gnb__link" data-menu="solution">Solutions</a>
       </li>
       <li class="gnb__item">
         <a href="#" class="gnb__link" data-menu="pr">Media</a>
       </li>
       <li class="gnb__item">
         <a href="#" class="gnb__link" data-menu="esg">Sustainability</a>
       </li>
       <li class="gnb__item">
         <a href="#" class="gnb__link" data-menu="recruit">Careers</a>
       </li>
     </ul>
   </div>
   ```

2. **Add Mega Menu Structure**
   Insert the complete mega menu HTML structure after the header util section.

3. **Update Utility Section**
   ```html
   <div class="main-header__util">
     <div class="main-header__util-item">
       <button type="button" class="main-header__util-button">Support</button>
     </div>
     <div class="main-header__util-item">
       <button type="button" class="main-header__util-button has-dropdown">
         EN
       </button>
     </div>
   </div>
   ```

4. **Add Required JavaScript Libraries**
   Ensure these scripts are included:
   ```html
   <script src="../../assets/js/lib/lenis.min.js"></script>
   <script src="../../assets/js/lib/swiper-bundle.min.js"></script>
   <script src="../../assets/js/lib/gsap.min.js"></script>
   <script src="../../assets/js/lib/ScrollTrigger.min.js"></script>
   <script src="../../assets/js/common.js"></script>
   ```

5. **Add Mega Menu JavaScript**
   Replace existing navigation JavaScript with the standardized mega menu functionality.

## Files to Update

All English pages in `/en/` directory need to be updated:
- MN01.html (Main page)
- CO01.html ✅ (Already updated)
- CO02.html through CO08.html
- BU01.html through BU33.html
- SU01.html through SU05.html
- MK01.html through MK23.html
- EM01.html through EM04.html
- HV01.html through HV04.html
- FAQ01.html

## Key Features

### Accessibility
- ARIA attributes for screen readers
- Keyboard navigation support (Escape key closes menu)
- Role-based navigation structure

### Responsive Design
- Maintains same layout structure as Korean version
- 6-column grid system
- Hover and focus states

### JavaScript Functionality
- Mouse hover activation
- Keyboard focus support
- Auto-close on mouse leave
- Consistent timing (180ms delay)
- Language switching functionality

## Quality Assurance

### Before Implementation
- ✅ Korean mega menu structure analyzed
- ✅ English translations validated
- ✅ Template file created
- ✅ Test page (CO01.html) successfully updated

### Testing Checklist
- [ ] Mega menu opens on hover
- [ ] All links navigate correctly
- [ ] Menu closes on mouse leave
- [ ] Keyboard navigation works
- [ ] Language switching functions
- [ ] Mobile compatibility maintained
- [ ] Consistent styling across pages

## Next Steps

1. Apply this template to all remaining English pages
2. Test functionality across different browsers
3. Verify mobile responsiveness
4. Ensure all translations are accurate and consistent
5. Update any page-specific navigation requirements

## Notes

- The mega menu uses the same data-attributes as the Korean version for consistency
- All English pages should link to corresponding English files (same filename structure)
- The JavaScript handles both mega menu functionality and language switching
- Template file location: `/english_mega_menu_template.html` for reference