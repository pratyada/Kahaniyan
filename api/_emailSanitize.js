// Shared HTML sanitization for email templates.
// Prevents XSS and HTML injection in dynamic email content.

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Sanitize email address — strip CRLF to prevent header injection
export function sanitizeEmail(email) {
  if (!email) return '';
  return String(email)
    .trim()
    .toLowerCase()
    .replace(/[\r\n\t]/g, '')
    .replace(/[,;]/g, '');
}

// Validate email format
export function isValidEmail(email) {
  if (!email) return false;
  const clean = sanitizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) && clean.length < 254;
}
