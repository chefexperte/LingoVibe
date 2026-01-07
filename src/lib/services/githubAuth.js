/**
 * GitHub OAuth Authentication Service
 * Handles GitHub OAuth flow for user authentication
 */

import { browser } from '$app/environment';

// OAuth Configuration
// Users need to register a GitHub OAuth App at: https://github.com/settings/developers
// For local development: http://localhost:5173/LingoVibe/auth/callback
// For production: https://chefexperte.github.io/LingoVibe/auth/callback
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'Ov23lizdY6fUEwbpvD8R';
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 
	(browser && window.location.origin + '/LingoVibe/auth/callback');

const TOKEN_KEY = 'github_access_token';
const USER_KEY = 'github_user';

/**
 * Get stored GitHub access token
 * @returns {string|null} Access token or null
 */
export function getAccessToken() {
	if (!browser) return null;
	try {
		return localStorage.getItem(TOKEN_KEY);
	} catch (e) {
		console.error('Error reading access token:', e);
		return null;
	}
}

/**
 * Store GitHub access token
 * @param {string} token - Access token to store
 */
export function setAccessToken(token) {
	if (!browser) return;
	try {
		localStorage.setItem(TOKEN_KEY, token);
	} catch (e) {
		console.error('Error storing access token:', e);
	}
}

/**
 * Remove stored GitHub access token
 */
export function clearAccessToken() {
	if (!browser) return;
	try {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
	} catch (e) {
		console.error('Error clearing access token:', e);
	}
}

/**
 * Get stored GitHub user info
 * @returns {Object|null} User info or null
 */
export function getGithubUser() {
	if (!browser) return null;
	try {
		const stored = localStorage.getItem(USER_KEY);
		return stored ? JSON.parse(stored) : null;
	} catch (e) {
		console.error('Error reading GitHub user:', e);
		return null;
	}
}

/**
 * Store GitHub user info
 * @param {Object} user - User info to store
 */
export function setGithubUser(user) {
	if (!browser) return;
	try {
		localStorage.setItem(USER_KEY, JSON.stringify(user));
	} catch (e) {
		console.error('Error storing GitHub user:', e);
	}
}

/**
 * Check if user is authenticated with GitHub
 * @returns {boolean} True if authenticated
 */
export function isAuthenticated() {
	return !!getAccessToken();
}

/**
 * Initiate GitHub OAuth flow
 * Redirects user to GitHub for authorization
 */
export function initiateGithubLogin() {
	if (!browser) return;
	
	const state = generateRandomState();
	sessionStorage.setItem('oauth_state', state);
	
	const params = new URLSearchParams({
		client_id: GITHUB_CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		scope: 'gist',
		state: state
	});
	
	window.location.href = `https://github.com/login/oauth/authorize?${params}`;
}

/**
 * Exchange authorization code for access token
 * Note: For client-side apps, we use GitHub's OAuth proxy or device flow
 * This is a simplified version - in production, use a backend or GitHub Apps
 * 
 * @param {string} code - Authorization code from GitHub
 * @returns {Promise<string>} Access token
 */
export async function exchangeCodeForToken(code) {
	// For static sites, we can't directly exchange the code without exposing client secret
	// Options:
	// 1. Use a serverless function (e.g., Netlify Functions, Vercel)
	// 2. Use GitHub's device flow (more complex)
	// 3. Use a third-party OAuth proxy (e.g., github-oauth-proxy)
	
	// For now, we'll use a simple proxy approach
	// Users should set up their own proxy or use services like:
	// https://github-oauth-proxy.herokuapp.com or similar
	
	const proxyUrl = import.meta.env.VITE_OAUTH_PROXY_URL || 
		'https://github-oauth-proxy.herokuapp.com/authenticate';
	
	try {
		const response = await fetch(proxyUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				code: code,
				client_id: GITHUB_CLIENT_ID
			})
		});
		
		if (!response.ok) {
			throw new Error(`OAuth proxy error: ${response.status}`);
		}
		
		const data = await response.json();
		return data.token || data.access_token;
	} catch (error) {
		console.error('Error exchanging code for token:', error);
		throw error;
	}
}

/**
 * Fetch GitHub user information
 * @param {string} token - Access token
 * @returns {Promise<Object>} User information
 */
export async function fetchGithubUserInfo(token) {
	try {
		const response = await fetch('https://api.github.com/user', {
			headers: {
				'Authorization': `token ${token}`,
				'Accept': 'application/vnd.github.v3+json'
			}
		});
		
		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.status}`);
		}
		
		return await response.json();
	} catch (error) {
		console.error('Error fetching GitHub user info:', error);
		throw error;
	}
}

/**
 * Verify token is still valid
 * @param {string} token - Access token to verify
 * @returns {Promise<boolean>} True if token is valid
 */
export async function verifyToken(token) {
	try {
		const response = await fetch('https://api.github.com/user', {
			headers: {
				'Authorization': `token ${token}`,
				'Accept': 'application/vnd.github.v3+json'
			}
		});
		return response.ok;
	} catch (error) {
		console.error('Error verifying token:', error);
		return false;
	}
}

/**
 * Sign out user
 * Clears all GitHub authentication data
 */
export function signOut() {
	clearAccessToken();
	// Note: This doesn't revoke the token on GitHub's side
	// Users can revoke access at: https://github.com/settings/applications
}

/**
 * Generate random state for OAuth CSRF protection
 * @returns {string} Random state string
 */
function generateRandomState() {
	const array = new Uint8Array(16);
	crypto.getRandomValues(array);
	return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate OAuth state to prevent CSRF attacks
 * @param {string} state - State to validate
 * @returns {boolean} True if state is valid
 */
export function validateOAuthState(state) {
	if (!browser) return false;
	const storedState = sessionStorage.getItem('oauth_state');
	sessionStorage.removeItem('oauth_state');
	return storedState === state;
}
