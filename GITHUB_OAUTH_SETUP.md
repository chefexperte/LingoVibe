# GitHub OAuth Setup for LingoVibe Cloud Sync

LingoVibe uses GitHub Gists to store your learning progress in the cloud. To enable this feature, you need to set up a GitHub OAuth application.

## For Users

If you're just using the deployed version of LingoVibe, the OAuth app is already configured. Simply click "Sign in with GitHub" in the app to start syncing your progress.

## For Developers

If you're running your own instance of LingoVibe or contributing to development, you'll need to create your own GitHub OAuth application.

### Step 1: Register a GitHub OAuth App

1. Go to your GitHub Settings: https://github.com/settings/developers
2. Click on "OAuth Apps" in the left sidebar
3. Click "New OAuth App"
4. Fill in the application details:
   - **Application name**: LingoVibe (or your custom name)
   - **Homepage URL**: `https://yourusername.github.io/LingoVibe` (or your deployment URL)
   - **Application description**: Language learning app with cloud sync
   - **Authorization callback URL**: 
     - For production: `https://yourusername.github.io/LingoVibe/auth/callback`
     - For local development: `http://localhost:5173/LingoVibe/auth/callback`
5. Click "Register application"
6. You'll be redirected to your app's settings page

### Step 2: Get Your Client ID

On your OAuth app's settings page, you'll see:
- **Client ID**: This is public and can be committed to your code
- **Client Secret**: **Keep this secret!** Never commit this to public repositories

### Step 3: Configure Your LingoVibe Instance

You have two options for configuring your OAuth credentials:

#### Option A: Environment Variables (Recommended for Production)

Create a `.env` file in the root of your project:

```env
VITE_GITHUB_CLIENT_ID=your_client_id_here
VITE_REDIRECT_URI=https://yourusername.github.io/LingoVibe/auth/callback
```

For local development:
```env
VITE_GITHUB_CLIENT_ID=your_client_id_here
VITE_REDIRECT_URI=http://localhost:5173/LingoVibe/auth/callback
```

#### Option B: Direct Configuration

Edit `src/lib/services/githubAuth.js` and replace the default client ID:

```javascript
const GITHUB_CLIENT_ID = 'your_client_id_here';
```

### Step 4: Set Up OAuth Proxy (Required for Static Sites)

Since LingoVibe is a static site, we can't directly exchange the OAuth code for a token (which requires the client secret). You need to use one of these solutions:

#### Option 1: Use the Default Proxy (Easiest)

The app uses `https://github-oauth-proxy.herokuapp.com` by default. This is a free service but may have rate limits.

#### Option 2: Deploy Your Own Proxy (Recommended for Production)

1. Clone this repository: https://github.com/prose/gatekeeper
2. Deploy it to Heroku, Vercel, or any Node.js hosting service
3. Set environment variables:
   - `OAUTH_CLIENT_ID`: Your GitHub OAuth app client ID
   - `OAUTH_CLIENT_SECRET`: Your GitHub OAuth app client secret
4. Update your `.env` file:
   ```env
   VITE_OAUTH_PROXY_URL=https://your-proxy.herokuapp.com/authenticate
   ```

#### Option 3: Use a Serverless Function

If you're deploying to Netlify or Vercel, you can create a serverless function to handle the OAuth exchange. See the documentation for your platform.

### Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser

3. Click "Sign in with GitHub"

4. You should be redirected to GitHub to authorize the app

5. After authorization, you'll be redirected back to LingoVibe

6. Your progress should now sync automatically!

## Scopes Required

LingoVibe only requires the `gist` scope, which allows:
- Creating private Gists
- Reading your Gists
- Updating your Gists
- Deleting your Gists

**Note**: The app will never access any other GitHub data, and all Gists are created as private by default.

## Revoking Access

If you want to revoke LingoVibe's access to your GitHub account:

1. Go to https://github.com/settings/applications
2. Find "LingoVibe" in the list
3. Click "Revoke"

Your local data will remain intact even after revoking access.

## Security Notes

- **Never commit your Client Secret** to version control
- Use environment variables for sensitive configuration
- The OAuth proxy should be deployed on a trusted server
- Tokens are stored only in your browser's localStorage
- All Gists are created as private by default

## Troubleshooting

### "OAuth proxy error: 403"
- The OAuth proxy is not configured correctly
- Deploy your own proxy or check the proxy URL

### "Invalid state parameter"
- Clear your browser's localStorage and try again
- This is a security feature to prevent CSRF attacks

### "Failed to fetch Gist: 401"
- Your GitHub token has expired or been revoked
- Sign out and sign in again

### "Not authenticated"
- You're not signed in with GitHub
- Click "Sign in with GitHub" to authenticate

## Support

For issues or questions, please open an issue on the GitHub repository.
