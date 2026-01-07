/**
 * Validation utilities for user input and data
 */

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} Validation result with {valid: boolean, error: string}
 */
export function validateUsername(username) {
	if (!username || typeof username !== 'string') {
		return { valid: false, error: 'Username is required' };
	}
	
	const trimmed = username.trim();
	
	if (trimmed.length < 2) {
		return { valid: false, error: 'Username must be at least 2 characters' };
	}
	
	if (trimmed.length > 20) {
		return { valid: false, error: 'Username must be at most 20 characters' };
	}
	
	if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
		return { valid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
	}
	
	return { valid: true, error: null };
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} Validation result with {valid: boolean, error: string}
 */
export function validateEmail(email) {
	if (!email || typeof email !== 'string') {
		return { valid: false, error: 'Email is required' };
	}
	
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	
	if (!emailRegex.test(email.trim())) {
		return { valid: false, error: 'Invalid email address' };
	}
	
	return { valid: true, error: null };
}

/**
 * Validate that a value is within a range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if valid
 */
export function isInRange(value, min, max) {
	return typeof value === 'number' && value >= min && value <= max;
}

/**
 * Validate that a string is not empty
 * @param {string} str - String to validate
 * @returns {boolean} True if not empty
 */
export function isNotEmpty(str) {
	return typeof str === 'string' && str.trim().length > 0;
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeHTML(str) {
	if (!str) return '';
	
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'/': '&#x2F;'
	};
	
	return str.replace(/[&<>"'/]/g, (char) => map[char]);
}
