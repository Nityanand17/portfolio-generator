# Setting up GitHub Authentication for Vercel Deployment

This guide will help you fix the "The redirect_uri is not associated with this application" error when using GitHub authentication with your Vercel-deployed portfolio.

## 1. Update your GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Select "OAuth Apps" and click on your portfolio application
3. Under "Authorization callback URL", add your Vercel deployment URL:
   ```
   https://your-portfolio-app.vercel.app/api/auth/callback/github
   ```
   (Replace 'your-portfolio-app' with your actual Vercel deployment URL)

4. Save your changes

## 2. Configure Environment Variables on Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your portfolio project
3. Click on "Settings" > "Environment Variables"
4. Add the following environment variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXTAUTH_URL` | `https://your-portfolio-app.vercel.app` | Production |
| `NEXTAUTH_SECRET` | `your-randomly-generated-secret` | All |
| `GITHUB_CLIENT_ID` | `your-github-oauth-client-id` | All |
| `GITHUB_CLIENT_SECRET` | `your-github-oauth-client-secret` | All |

5. Click "Save" and redeploy your application

## 3. Generate a Secure NEXTAUTH_SECRET

You can generate a secure random string for your NEXTAUTH_SECRET using this command:

```bash
openssl rand -base64 32
```

## 4. Verify Your Setup

1. After redeploying, try the GitHub authentication again
2. Check browser console for any errors
3. If you still encounter issues, check Vercel's Function Logs for detailed error messages

## Common Issues and Solutions

### "redirect_uri is not associated with this application"
- Ensure the callback URL in your GitHub OAuth App exactly matches your Vercel deployment URL
- Check for typos, missing or extra slashes, and HTTP vs HTTPS

### "OAuth callback URL mismatch"
- Make sure the NEXTAUTH_URL environment variable exactly matches your Vercel deployment URL

### "Invalid state"
- This usually happens when cookies are not properly set. Make sure your NEXTAUTH_SECRET is properly set
- Try clearing browser cookies and cache

### Session not persisting
- Ensure your NEXTAUTH_SECRET is set and doesn't change between deployments
- Check that your Vercel domain is correctly set in the NEXTAUTH_URL

## Testing Locally

To test locally while keeping the same GitHub OAuth App:

1. Add an additional callback URL to your GitHub OAuth App:
   ```
   http://localhost:3000/api/auth/callback/github
   ```

2. Create a `.env.local` file with:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-same-secret-as-vercel
   GITHUB_CLIENT_ID=your-github-oauth-client-id
   GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
   ```

This allows you to use the same GitHub OAuth App for both local development and production. 