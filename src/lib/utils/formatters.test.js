import { describe, it, expect } from 'vitest';
import {
	formatDate,
	formatRelativeTime,
	formatNumber,
	formatPercentage,
	capitalizeFirst,
	truncate
} from './formatters.js';

describe('formatters', () => {
	describe('formatDate', () => {
		it('should format a date object', () => {
			const date = new Date('2024-01-15T12:00:00Z');
			const formatted = formatDate(date);
			expect(formatted).toContain('Jan');
			expect(formatted).toContain('15');
			expect(formatted).toContain('2024');
		});

		it('should format a date string', () => {
			const formatted = formatDate('2024-01-15');
			expect(formatted).toBeTruthy();
		});

		it('should return empty string for null', () => {
			expect(formatDate(null)).toBe('');
		});

		it('should return empty string for invalid date', () => {
			expect(formatDate('invalid')).toBe('');
		});
	});

	describe('formatRelativeTime', () => {
		it('should return "just now" for recent times', () => {
			const now = new Date();
			expect(formatRelativeTime(now)).toBe('just now');
		});

		it('should return minutes ago', () => {
			const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
			expect(formatRelativeTime(date)).toContain('minute');
		});

		it('should return empty string for null', () => {
			expect(formatRelativeTime(null)).toBe('');
		});
	});

	describe('formatNumber', () => {
		it('should format number with thousand separators', () => {
			expect(formatNumber(1000)).toBe('1,000');
			expect(formatNumber(1000000)).toBe('1,000,000');
		});

		it('should handle small numbers', () => {
			expect(formatNumber(0)).toBe('0');
			expect(formatNumber(42)).toBe('42');
		});

		it('should return "0" for non-numbers', () => {
			expect(formatNumber('abc')).toBe('0');
			expect(formatNumber(null)).toBe('0');
		});
	});

	describe('formatPercentage', () => {
		it('should format percentage without decimals by default', () => {
			expect(formatPercentage(75)).toBe('75%');
			expect(formatPercentage(100)).toBe('100%');
		});

		it('should format percentage with decimals', () => {
			expect(formatPercentage(75.567, 2)).toBe('75.57%');
		});

		it('should handle 0', () => {
			expect(formatPercentage(0)).toBe('0%');
		});

		it('should return "0%" for non-numbers', () => {
			expect(formatPercentage('abc')).toBe('0%');
		});
	});

	describe('capitalizeFirst', () => {
		it('should capitalize first letter', () => {
			expect(capitalizeFirst('hello')).toBe('Hello');
			expect(capitalizeFirst('world')).toBe('World');
		});

		it('should not change already capitalized strings', () => {
			expect(capitalizeFirst('Hello')).toBe('Hello');
		});

		it('should return empty string for empty input', () => {
			expect(capitalizeFirst('')).toBe('');
			expect(capitalizeFirst(null)).toBe('');
		});
	});

	describe('truncate', () => {
		it('should truncate long strings', () => {
			const long = 'This is a very long string that needs truncation';
			const result = truncate(long, 20);
			expect(result.length).toBeLessThanOrEqual(20);
			expect(result).toContain('...');
		});

		it('should not truncate short strings', () => {
			const short = 'Short';
			expect(truncate(short, 20)).toBe('Short');
		});

		it('should use custom suffix', () => {
			const result = truncate('Long string here', 10, '—');
			expect(result).toContain('—');
		});

		it('should handle empty strings', () => {
			expect(truncate('', 10)).toBe('');
		});
	});
});
