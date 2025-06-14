# Portfolio Generator

A Next.js application that allows users to create and deploy their professional portfolio websites with ease.

## Features

- **Portfolio Form**: Fill out a form with your professional details to generate a portfolio
- **Preview**: View your generated portfolio before deploying
- **Deploy Portfolio**: Deploy your portfolio to GitHub and Vercel with a single click

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- NextAuth.js for GitHub authentication
- GitHub API for repository creation
- Vercel API for deployment

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- GitHub account
- Vercel account (optional, for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nityanand17/portfolio-generator.git
   cd portfolio-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   
   # GitHub OAuth
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   
   # Vercel API (optional)
   VERCEL_TOKEN=your-vercel-api-token
   ```

4. Create a GitHub OAuth application:
   - Go to GitHub Settings > Developer settings > OAuth Apps > New OAuth App
   - Set the Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
   - Copy the Client ID and Client Secret to your `.env.local` file

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. Fill out the portfolio form with your information
2. Click "Generate Portfolio" to preview your portfolio
3. Click "Deploy Portfolio" to:
   - Authenticate with GitHub
   - Create a new repository
   - Push your portfolio code
   - Deploy to Vercel (if configured)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | The base URL of your application |
| `NEXTAUTH_SECRET` | A secret string used to encrypt session cookies |
| `GITHUB_CLIENT_ID` | Your GitHub OAuth application client ID |
| `GITHUB_CLIENT_SECRET` | Your GitHub OAuth application client secret |
| `VERCEL_TOKEN` | (Optional) Your Vercel API token for deployments |

## License

[MIT](LICENSE)

## Credits

Created with ❤️ using Next.js, TailwindCSS, and Framer Motion.
