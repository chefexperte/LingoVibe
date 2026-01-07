/**
 * Formatting utilities for dates, numbers, and text
 */

/**
 * Format a date to a readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
	if (!date) return '';
	
	const d = typeof date === 'string' ? new Date(date) : date;
	
	if (isNaN(d.getTime())) return '';
	
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

/**
 * Format a date to relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
	if (!date) return '';
	
	const d = typeof date === 'string' ? new Date(date) : date;
	
	if (isNaN(d.getTime())) return '';
	
	const now = new Date();
	const diffMs = now - d;
	const diffSecs = Math.floor(diffMs / 1000);
	const diffMins = Math.floor(diffSecs / 60);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);
	
	if (diffSecs < 60) return 'just now';
	if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
	if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
	if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
	
	return formatDate(d);
}

/**
 * Format a number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
	if (typeof num !== 'number') return '0';
	return num.toLocaleString('en-US');
}

/**
 * Format a percentage
 * @param {number} value - Value between 0-100
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 0) {
	if (typeof value !== 'number') return '0%';
	return `${value.toFixed(decimals)}%`;
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalizeFirst(str) {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to a maximum length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength, suffix = '...') {
	if (!str || str.length <= maxLength) return str;
	return str.slice(0, maxLength - suffix.length) + suffix;
}
