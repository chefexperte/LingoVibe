import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Get initial user data from localStorage
 */
function getInitialUser() {
	if (!browser) return null;
	
	try {
		const stored = localStorage.getItem('lingovibeUser');
		return stored ? JSON.parse(stored) : null;
	} catch (e) {
		console.error('Error loading user data:', e);
		return null;
	}
}

/**
 * Get initial welcome screen seen status
 */
function getWelcomeScreenSeen() {
	if (!browser) return false;
	
	try {
		return localStorage.getItem('welcomeScreenSeen') === 'true';
	} catch (e) {
		console.error('Error loading welcome screen status:', e);
		return false;
	}
}

/**
 * User data store
 */
export const user = writable(getInitialUser());

/**
 * Welcome screen seen status
 */
export const welcomeScreenSeen = writable(getWelcomeScreenSeen());

/**
 * Derived store for checking if user is logged in
 */
export const isLoggedIn = derived(user, $user => $user !== null);

/**
 * Subscribe to changes and persist to localStorage
 */
if (browser) {
	user.subscribe(value => {
		try {
			if (value) {
				localStorage.setItem('lingovibeUser', JSON.stringify(value));
			} else {
				localStorage.removeItem('lingovibeUser');
			}
		} catch (e) {
			console.error('Error saving user data:', e);
		}
	});

	welcomeScreenSeen.subscribe(value => {
		try {
			localStorage.setItem('welcomeScreenSeen', value.toString());
		} catch (e) {
			console.error('Error saving welcome screen status:', e);
		}
	});
}

/**
 * Create a new user account
 * @param {string} username - User's chosen username
 */
export function createAccount(username) {
	const newUser = {
		username: username.trim(),
		createdAt: new Date().toISOString(),
		preferences: {
			selectedLanguage: null,
			difficulty: 'common'
		}
	};
	
	user.set(newUser);
	return newUser;
}

/**
 * Update user preferences
 * @param {Object} preferences - Partial preferences object to update
 */
export function updatePreferences(preferences) {
	user.update(currentUser => {
		if (!currentUser) return currentUser;
		
		return {
			...currentUser,
			preferences: {
				...currentUser.preferences,
				...preferences
			}
		};
	});
}

/**
 * Log out the current user
 */
export function logout() {
	user.set(null);
	if (browser) {
		localStorage.removeItem('lingovibeUser');
	}
}

/**
 * Mark welcome screen as seen
 */
export function markWelcomeScreenSeen() {
	welcomeScreenSeen.set(true);
}

/**
 * Reset all user data (for testing)
 */
export function resetUserData() {
	user.set(null);
	welcomeScreenSeen.set(false);
	if (browser) {
		localStorage.removeItem('lingovibeUser');
		localStorage.removeItem('welcomeScreenSeen');
	}
}
