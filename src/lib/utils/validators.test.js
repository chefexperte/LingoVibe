import { describe, it, expect } from 'vitest';
import {
	validateUsername,
	validateEmail,
	isInRange,
	isNotEmpty,
	sanitizeHTML
} from './validators.js';

describe('validators', () => {
	describe('validateUsername', () => {
		it('should accept valid usernames', () => {
			expect(validateUsername('user123').valid).toBe(true);
			expect(validateUsername('test_user').valid).toBe(true);
			expect(validateUsername('user-name').valid).toBe(true);
		});

		it('should reject empty username', () => {
			const result = validateUsername('');
			expect(result.valid).toBe(false);
			expect(result.error).toBeTruthy();
		});

		it('should reject short username', () => {
			const result = validateUsername('a');
			expect(result.valid).toBe(false);
			expect(result.error).toContain('at least 2 characters');
		});

		it('should reject long username', () => {
			const result = validateUsername('a'.repeat(21));
			expect(result.valid).toBe(false);
			expect(result.error).toContain('at most 20 characters');
		});

		it('should reject username with special characters', () => {
			const result = validateUsername('user@name');
			expect(result.valid).toBe(false);
			expect(result.error).toContain('letters, numbers');
		});

		it('should trim whitespace', () => {
			const result = validateUsername('  user123  ');
			expect(result.valid).toBe(true);
		});
	});

	describe('validateEmail', () => {
		it('should accept valid emails', () => {
			expect(validateEmail('test@example.com').valid).toBe(true);
			expect(validateEmail('user.name@domain.co.uk').valid).toBe(true);
		});

		it('should reject invalid emails', () => {
			expect(validateEmail('invalid').valid).toBe(false);
			expect(validateEmail('no@domain').valid).toBe(false);
			expect(validateEmail('@example.com').valid).toBe(false);
		});

		it('should reject empty email', () => {
			const result = validateEmail('');
			expect(result.valid).toBe(false);
			expect(result.error).toBeTruthy();
		});
	});

	describe('isInRange', () => {
		it('should return true for values in range', () => {
			expect(isInRange(5, 0, 10)).toBe(true);
			expect(isInRange(0, 0, 10)).toBe(true);
			expect(isInRange(10, 0, 10)).toBe(true);
		});

		it('should return false for values out of range', () => {
			expect(isInRange(-1, 0, 10)).toBe(false);
			expect(isInRange(11, 0, 10)).toBe(false);
		});

		it('should return false for non-numbers', () => {
			expect(isInRange('5', 0, 10)).toBe(false);
			expect(isInRange(null, 0, 10)).toBe(false);
		});
	});

	describe('isNotEmpty', () => {
		it('should return true for non-empty strings', () => {
			expect(isNotEmpty('hello')).toBe(true);
			expect(isNotEmpty('  hello  ')).toBe(true);
		});

		it('should return false for empty strings', () => {
			expect(isNotEmpty('')).toBe(false);
			expect(isNotEmpty('   ')).toBe(false);
		});

		it('should return false for non-strings', () => {
			expect(isNotEmpty(null)).toBe(false);
			expect(isNotEmpty(123)).toBe(false);
		});
	});

	describe('sanitizeHTML', () => {
		it('should escape HTML special characters', () => {
			expect(sanitizeHTML('<script>alert("xss")</script>'))
				.toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
		});

		it('should escape ampersands', () => {
			expect(sanitizeHTML('Tom & Jerry')).toBe('Tom &amp; Jerry');
		});

		it('should escape quotes', () => {
			expect(sanitizeHTML('He said "hello"')).toBe('He said &quot;hello&quot;');
			expect(sanitizeHTML("It's working")).toBe('It&#x27;s working');
		});

		it('should handle empty strings', () => {
			expect(sanitizeHTML('')).toBe('');
			expect(sanitizeHTML(null)).toBe('');
		});

		it('should not modify safe strings', () => {
			expect(sanitizeHTML('Hello World')).toBe('Hello World');
		});
	});
});
