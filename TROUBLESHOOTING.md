# Troubleshooting Guide

## Google Sign-In Issues

### Error: `[GSI_LOGGER]: FedCM get() rejects with IdentityCredentialError: Error retrieving a token.`

This error typically occurs due to one of these issues:

#### 1. Missing or Invalid Google Client ID

**Problem**: The `REACT_APP_GOOGLE_CLIENT_ID` environment variable is not set or is invalid.

**Solution**:
1. Create a `.env` file in the `client` directory:
   ```bash
   cd client
   cp env.example .env
   ```

2. Edit `.env` and add your Google Client ID:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-actual-google-client-id-here
   ```

3. Restart the React development server:
   ```bash
   npm start
   ```

#### 2. Google Cloud Console Configuration Issues

**Problem**: The OAuth 2.0 client is not properly configured.

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Find your OAuth 2.0 Client ID
5. Make sure:
   - **Authorized JavaScript origins** includes:
     - `http://localhost:3000`
     - `http://localhost:3001` (if using port 3001)
     - Your production domain
   - **Authorized redirect URIs** includes:
     - `http://localhost:3000`
     - `http://localhost:3001`
     - Your production domain

#### 3. YouTube Data API Not Enabled

**Problem**: The YouTube Data API v3 is not enabled in your Google Cloud project.

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Library"
4. Search for "YouTube Data API v3"
5. Click on it and press "Enable"

#### 4. Incorrect OAuth Consent Screen

**Problem**: The OAuth consent screen is not properly configured.

**Solution**:
1. Go to "APIs & Services" > "OAuth consent screen"
2. Make sure:
   - **User Type** is set to "External" (unless you have a Google Workspace)
   - **App name** is filled in
   - **User support email** is set
   - **Developer contact information** is filled
   - **Scopes** include YouTube Data API v3 scopes

### Testing Without Google OAuth

If you want to test the application without setting up Google OAuth:

1. **Use Channel ID Method**: This doesn't require Google OAuth setup
2. **Use Simple Method**: This is a fallback that doesn't require any API setup

### Quick Test Setup

For quick testing, you can temporarily disable Google OAuth:

1. In `client/src/App.js`, change:
   ```javascript
   const isGoogleConfigured = false; // Force disable Google OAuth
   ```

2. This will show a warning and disable the Google Sign-In option

### Common Environment Variable Issues

Make sure your `.env` files are in the correct locations:

- **Client**: `client/.env` (for React app)
- **Server**: `server/.env` (for Node.js app)

### Server Environment Variables

Make sure your `server/.env` file has:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
TARGET_CHANNEL_ID=UC91RZv71f8p0VV2gaFI07pg
JWT_SECRET=your_secure_jwt_secret_here
PORT=5500
```

### Client Environment Variables

Make sure your `client/.env` file has:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Note: The `REACT_APP_` prefix is required for React to read the environment variable.

### Debugging Steps

1. **Check Browser Console**: Look for any JavaScript errors
2. **Check Network Tab**: See if API calls are failing
3. **Check Server Logs**: Look at the terminal running the server
4. **Verify Environment Variables**: Make sure they're loaded correctly

### Testing the Channel ID Method

If Google OAuth isn't working, test with the Channel ID method:

1. Go to your YouTube channel
2. Copy your channel ID (starts with UC) or handle (starts with @)
3. Use the "Enter Your Channel Info" method
4. Enter your channel ID or handle
5. Click "Verify Subscription"

This method works without Google OAuth but only for users with public subscriptions.

### Still Having Issues?

1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Make sure the Google Cloud Console project is properly configured
4. Try the Channel ID method as a fallback
5. Check that both client and server are running on the correct ports
