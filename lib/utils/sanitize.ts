/**
 * XSS 방지를 위한 입력 sanitization 유틸리티
 */

export function sanitizeInput(input: string): string {
  if (!input) return "";
  
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function validateTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: "제목을 입력해주세요." };
  }
  
  if (title.length > 100) {
    return { valid: false, error: "제목은 100자 이내로 입력해주세요." };
  }
  
  return { valid: true };
}

export function validateDate(date: string): { valid: boolean; error?: string } {
  if (!date) return { valid: true };
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { valid: false, error: "올바른 날짜 형식이 아닙니다. (YYYY-MM-DD)" };
  }
  
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return { valid: false, error: "유효하지 않은 날짜입니다." };
  }
  
  return { valid: true };
}

export function sanitizeAndValidate(input: string, maxLength: number = 1000): { 
  sanitized: string; 
  valid: boolean; 
  error?: string;
} {
  if (!input || input.trim().length === 0) {
    return { sanitized: "", valid: false, error: "입력값이 비어있습니다." };
  }
  
  if (input.length > maxLength) {
    return { 
      sanitized: "", 
      valid: false, 
      error: `입력값은 ${maxLength}자 이내로 입력해주세요.` 
    };
  }
  
  const sanitized = sanitizeInput(input);
  return { sanitized, valid: true };
}
