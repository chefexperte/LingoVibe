import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	user,
	welcomeScreenSeen,
	isLoggedIn,
	createAccount,
	updatePreferences,
	logout,
	markWelcomeScreenSeen,
	resetUserData
} from './userStore.js';

// Mock browser environment
vi.stubGlobal('localStorage', {
	data: {},
	getItem(key) {
		return this.data[key] || null;
	},
	setItem(key, value) {
		this.data[key] = value;
	},
	removeItem(key) {
		delete this.data[key];
	},
	clear() {
		this.data = {};
	}
});

describe('userStore', () => {
	beforeEach(() => {
		localStorage.clear();
		resetUserData();
	});

	describe('createAccount', () => {
		it('should create a new user account', () => {
			const newUser = createAccount('TestUser');
			
			expect(newUser.username).toBe('TestUser');
			expect(newUser.createdAt).toBeTruthy();
			expect(newUser.preferences).toBeDefined();
		});

		it('should trim username whitespace', () => {
			const newUser = createAccount('  TestUser  ');
			expect(newUser.username).toBe('TestUser');
		});

		it('should update the user store', () => {
			createAccount('TestUser');
			
			const currentUser = get(user);
			expect(currentUser.username).toBe('TestUser');
		});

		it('should persist to localStorage', () => {
			createAccount('TestUser');
			
			const stored = localStorage.getItem('lingovibeUser');
			expect(stored).toBeTruthy();
			
			const parsed = JSON.parse(stored);
			expect(parsed.username).toBe('TestUser');
		});
	});

	describe('updatePreferences', () => {
		it('should update user preferences', () => {
			createAccount('TestUser');
			updatePreferences({ selectedLanguage: 'ru' });
			
			const currentUser = get(user);
			expect(currentUser.preferences.selectedLanguage).toBe('ru');
		});

		it('should not overwrite all preferences', () => {
			createAccount('TestUser');
			updatePreferences({ selectedLanguage: 'ru' });
			updatePreferences({ difficulty: 'advanced' });
			
			const currentUser = get(user);
			expect(currentUser.preferences.selectedLanguage).toBe('ru');
			expect(currentUser.preferences.difficulty).toBe('advanced');
		});

		it('should do nothing if no user exists', () => {
			updatePreferences({ selectedLanguage: 'ru' });
			expect(get(user)).toBe(null);
		});
	});

	describe('logout', () => {
		it('should clear user data', () => {
			createAccount('TestUser');
			logout();
			
			expect(get(user)).toBe(null);
		});

		it('should remove from localStorage', () => {
			createAccount('TestUser');
			logout();
			
			expect(localStorage.getItem('lingovibeUser')).toBe(null);
		});
	});

	describe('isLoggedIn', () => {
		it('should return false when no user', () => {
			expect(get(isLoggedIn)).toBe(false);
		});

		it('should return true when user exists', () => {
			createAccount('TestUser');
			expect(get(isLoggedIn)).toBe(true);
		});
	});

	describe('welcomeScreenSeen', () => {
		it('should start as false', () => {
			expect(get(welcomeScreenSeen)).toBe(false);
		});

		it('should update when marked as seen', () => {
			markWelcomeScreenSeen();
			expect(get(welcomeScreenSeen)).toBe(true);
		});

		it('should persist to localStorage', () => {
			markWelcomeScreenSeen();
			expect(localStorage.getItem('welcomeScreenSeen')).toBe('true');
		});
	});

	describe('resetUserData', () => {
		it('should clear all user data', () => {
			createAccount('TestUser');
			markWelcomeScreenSeen();
			resetUserData();
			
			expect(get(user)).toBe(null);
			expect(get(welcomeScreenSeen)).toBe(false);
		});
	});
});
