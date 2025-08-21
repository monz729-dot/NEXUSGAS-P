/**
 * YCS Logistics UI Components JavaScript Library
 * Common utilities and functions converted from React components
 */

// Toast/Notification System
class Toast {
  static show(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="flex items-center">
        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${this.getIcon(type)}
        </svg>
        <span>${message}</span>
        <button class="ml-auto pl-3" onclick="this.parentElement.parentElement.remove()">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, duration);
  }
  
  static getIcon(type) {
    const icons = {
      success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
      error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>',
      warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>',
      info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    };
    return icons[type] || icons.info;
  }
}

// Modal/Dialog System
class Modal {
  static create(content, options = {}) {
    const modal = document.createElement('div');
    modal.className = 'dialog-overlay';
    modal.innerHTML = `
      <div class="dialog-content">
        <div class="dialog-header">
          ${options.title ? `<h2 class="dialog-title">${options.title}</h2>` : ''}
          ${options.description ? `<p class="dialog-description">${options.description}</p>` : ''}
        </div>
        <div class="dialog-body">
          ${content}
        </div>
        <div class="dialog-footer">
          ${options.buttons || '<button class="btn btn-primary" onclick="Modal.close(this)">확인</button>'}
        </div>
        <button class="dialog-close" onclick="Modal.close(this)">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        Modal.close(modal);
      }
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        Modal.close(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    return modal;
  }
  
  static close(element) {
    const modal = element.closest('.dialog-overlay');
    if (modal) {
      modal.remove();
    }
  }
}

// Accordion Component
class Accordion {
  static init(container) {
    const triggers = container.querySelectorAll('.accordion-trigger');
    
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const isOpen = content.getAttribute('data-state') === 'open';
        
        // Close all other accordions if single mode
        if (!container.hasAttribute('data-multiple')) {
          container.querySelectorAll('.accordion-content').forEach(otherContent => {
            if (otherContent !== content) {
              otherContent.setAttribute('data-state', 'closed');
              otherContent.style.height = '0px';
            }
          });
        }
        
        // Toggle current accordion
        if (isOpen) {
          content.setAttribute('data-state', 'closed');
          content.style.height = '0px';
        } else {
          content.setAttribute('data-state', 'open');
          content.style.height = content.scrollHeight + 'px';
        }
      });
    });
  }
}

// Tabs Component
class Tabs {
  static init(container) {
    const triggers = container.querySelectorAll('.tabs-trigger');
    const contents = container.querySelectorAll('.tabs-content');
    
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const value = trigger.getAttribute('data-value');
        
        // Update triggers
        triggers.forEach(t => t.setAttribute('data-state', 'inactive'));
        trigger.setAttribute('data-state', 'active');
        
        // Update contents
        contents.forEach(content => {
          if (content.getAttribute('data-value') === value) {
            content.style.display = 'block';
          } else {
            content.style.display = 'none';
          }
        });
      });
    });
  }
}

// Dropdown Component
class Dropdown {
  static init(trigger) {
    const content = trigger.nextElementSibling;
    let isOpen = false;
    
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      content.style.display = isOpen ? 'block' : 'none';
    });
    
    // Close on outside click
    document.addEventListener('click', () => {
      isOpen = false;
      content.style.display = 'none';
    });
    
    // Prevent content clicks from closing
    content.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

// Form Validation Utilities
class FormValidator {
  static validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  static validatePhone(phone) {
    const regex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    return regex.test(phone.replace(/[^0-9]/g, ''));
  }
  
  static validatePassword(password) {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  }
  
  static showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field && errorElement) {
      field.classList.add('input-error');
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }
  
  static hideFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field && errorElement) {
      field.classList.remove('input-error');
      errorElement.style.display = 'none';
    }
  }
}

// Loading States
class Loading {
  static show(element, text = '로딩 중...') {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
      <div class="flex items-center justify-center">
        <div class="loading-spinner mr-2"></div>
        <span>${text}</span>
      </div>
    `;
    
    element.disabled = true;
    element.innerHTML = '';
    element.appendChild(spinner);
  }
  
  static hide(element, originalText) {
    element.disabled = false;
    element.innerHTML = originalText;
  }
}

// Currency and Number Formatting
class Formatter {
  static currency(amount) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount);
  }
  
  static number(num) {
    return new Intl.NumberFormat('ko-KR').format(num);
  }
  
  static date(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    return new Date(date).toLocaleDateString('ko-KR', { ...defaultOptions, ...options });
  }
  
  static time(date) {
    return new Date(date).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// File Upload Utilities
class FileUpload {
  static init(element, options = {}) {
    const {
      accept = '*',
      maxSize = 10 * 1024 * 1024, // 10MB
      multiple = false,
      onSelect = () => {},
      onError = () => {}
    } = options;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.style.display = 'none';
    
    element.appendChild(input);
    
    element.addEventListener('click', () => input.click());
    
    element.addEventListener('dragover', (e) => {
      e.preventDefault();
      element.classList.add('dragover');
    });
    
    element.addEventListener('dragleave', () => {
      element.classList.remove('dragover');
    });
    
    element.addEventListener('drop', (e) => {
      e.preventDefault();
      element.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });
    
    input.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });
    
    function handleFiles(files) {
      const validFiles = [];
      
      for (let file of files) {
        if (file.size > maxSize) {
          onError(`파일 크기가 너무 큽니다: ${file.name}`);
          continue;
        }
        
        if (accept !== '*' && !accept.split(',').some(type => file.type.includes(type.trim()))) {
          onError(`지원하지 않는 파일 형식입니다: ${file.name}`);
          continue;
        }
        
        validFiles.push(file);
      }
      
      if (validFiles.length > 0) {
        onSelect(validFiles);
      }
    }
  }
}

// Search and Filter Utilities
class SearchFilter {
  static filterItems(items, query, fields) {
    if (!query.trim()) return items;
    
    const lowerQuery = query.toLowerCase();
    return items.filter(item => {
      return fields.some(field => {
        const value = this.getNestedValue(item, field);
        return String(value).toLowerCase().includes(lowerQuery);
      });
    });
  }
  
  static getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
  
  static highlightText(text, query) {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

// Pagination Utility
class Pagination {
  static create(container, totalItems, itemsPerPage, currentPage, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }
    
    let html = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
      html += `<button class="pagination-prev" onclick="${onPageChange}(${currentPage - 1})">이전</button>`;
    }
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      const activeClass = i === currentPage ? ' active' : '';
      html += `<button class="pagination-item${activeClass}" onclick="${onPageChange}(${i})">${i}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
      html += `<button class="pagination-next" onclick="${onPageChange}(${currentPage + 1})">다음</button>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
  }
}

// Local Storage Utilities
class Storage {
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
  
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage error:', e);
      return defaultValue;
    }
  }
  
  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
  
  static clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
}

// Animation Utilities
class Animation {
  static fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    const start = performance.now();
    
    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      
      element.style.opacity = progress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  static fadeOut(element, duration = 300) {
    const start = performance.now();
    const startOpacity = parseFloat(getComputedStyle(element).opacity);
    
    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      
      element.style.opacity = startOpacity * (1 - progress);
      
      if (progress === 1) {
        element.style.display = 'none';
      } else {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  static slideDown(element, duration = 300) {
    element.style.height = '0';
    element.style.overflow = 'hidden';
    element.style.display = 'block';
    
    const fullHeight = element.scrollHeight;
    const start = performance.now();
    
    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      
      element.style.height = (fullHeight * progress) + 'px';
      
      if (progress === 1) {
        element.style.height = '';
        element.style.overflow = '';
      } else {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  static slideUp(element, duration = 300) {
    const startHeight = element.offsetHeight;
    const start = performance.now();
    
    element.style.overflow = 'hidden';
    
    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      
      element.style.height = (startHeight * (1 - progress)) + 'px';
      
      if (progress === 1) {
        element.style.display = 'none';
        element.style.height = '';
        element.style.overflow = '';
      } else {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize accordions
  document.querySelectorAll('.accordion').forEach(Accordion.init);
  
  // Initialize tabs
  document.querySelectorAll('.tabs').forEach(Tabs.init);
  
  // Initialize dropdowns
  document.querySelectorAll('[data-dropdown-trigger]').forEach(Dropdown.init);
});

// Export utilities for global use
window.Toast = Toast;
window.Modal = Modal;
window.Accordion = Accordion;
window.Tabs = Tabs;
window.Dropdown = Dropdown;
window.FormValidator = FormValidator;
window.Loading = Loading;
window.Formatter = Formatter;
window.FileUpload = FileUpload;
window.SearchFilter = SearchFilter;
window.Pagination = Pagination;
window.Storage = Storage;
window.Animation = Animation;