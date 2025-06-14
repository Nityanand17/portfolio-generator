import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Octokit } from "@octokit/rest";
import axios from "axios";
import { authOptions } from "@/lib/auth";

// Function to generate Next.js portfolio files
function generatePortfolioFiles(portfolioData: any) {
  // Create a package.json file
  const packageJson = `{
  "name": "${portfolioData.fullName.toLowerCase().replace(/\\s+/g, '-')}-portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "framer-motion": "10.16.4",
    "lucide-react": "0.309.0",
    "class-variance-authority": "0.7.0",
    "clsx": "2.0.0",
    "tailwind-merge": "2.2.0",
    "tailwindcss-animate": "1.0.7",
    "next-themes": "0.2.1"
  },
  "devDependencies": {
    "@types/node": "20.8.10",
    "@types/react": "18.2.36",
    "@types/react-dom": "18.2.14",
    "autoprefixer": "10.4.16",
    "postcss": "8.4.31",
    "tailwindcss": "3.3.5",
    "typescript": "5.2.2"
  }
}`;

// Create a next.config.js file
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['*'],
  },
  transpilePackages: ["lucide-react"],
}

module.exports = nextConfig`;

// Create a tsconfig.json file
const tsConfig = `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;

// Create a tailwind.config.js file
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        blob: "blob 7s infinite",
        blink: "blink 1s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`;

// Create a postcss.config.js file
const postcssConfig = `/** @type {import('postcss').Config} */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

// Create a .gitignore file
const gitignore = `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts`;

// Create a .npmrc file
const npmrc = `engine-strict=false
legacy-peer-deps=true
platform-check=false
`;

// Create app/globals.css
const themeColor = portfolioData.themeColor || 'blue';
const themeColorValue = themeColor === 'blue' ? '221 83% 53%' : 
                        themeColor === 'purple' ? '270 76% 53%' : 
                        '142 76% 36%';

const globalCss = [
  '@tailwind base;',
  '@tailwind components;',
  '@tailwind utilities;',
  '',
  '@layer base {',
  '  :root {',
  '    --background: 0 0% 100%;',
  '    --foreground: 240 10% 3.9%;',
  '    --card: 0 0% 100%;',
  '    --card-foreground: 240 10% 3.9%;',
  '    --popover: 0 0% 100%;',
  '    --popover-foreground: 240 10% 3.9%;',
  '    --primary: 240 5.9% 10%;',
  '    --primary-foreground: 0 0% 98%;',
  '    --secondary: 240 4.8% 95.9%;',
  '    --secondary-foreground: 240 5.9% 10%;',
  '    --muted: 240 4.8% 95.9%;',
  '    --muted-foreground: 240 3.8% 46.1%;',
  '    --accent: 240 4.8% 95.9%;',
  '    --accent-foreground: 240 5.9% 10%;',
  '    --destructive: 0 84.2% 60.2%;',
  '    --destructive-foreground: 0 0% 98%;',
  '    --border: 240 5.9% 90%;',
  '    --input: 240 5.9% 90%;',
  '    --ring: 240 5.9% 10%;',
  '    --radius: 0.5rem;',
  '    --theme-color: ' + themeColorValue + ';',
  '  }',
  '',
  '  .dark {',
  '    --background: 240 10% 3.9%;',
  '    --foreground: 0 0% 98%;',
  '    --card: 240 10% 3.9%;',
  '    --card-foreground: 0 0% 98%;',
  '    --popover: 240 10% 3.9%;',
  '    --popover-foreground: 0 0% 98%;',
  '    --primary: 0 0% 98%;',
  '    --primary-foreground: 240 5.9% 10%;',
  '    --secondary: 240 3.7% 15.9%;',
  '    --secondary-foreground: 0 0% 98%;',
  '    --muted: 240 3.7% 15.9%;',
  '    --muted-foreground: 240 5% 64.9%;',
  '    --accent: 240 3.7% 15.9%;',
  '    --accent-foreground: 0 0% 98%;',
  '    --destructive: 0 62.8% 30.6%;',
  '    --destructive-foreground: 0 0% 98%;',
  '    --border: 240 3.7% 15.9%;',
  '    --input: 240 3.7% 15.9%;',
  '    --ring: 240 4.9% 83.9%;',
  '  }',
  '',
  '  /* Theme color variations */',
  '  .theme-blue {',
  '    --primary: 221 83% 53%;',
  '    --primary-foreground: 210 40% 98%;',
  '    --ring: 221 83% 53%;',
  '    --theme-color: 221 83% 53%;',
  '  }',
  '',
  '  .theme-purple {',
  '    --primary: 270 76% 53%;',
  '    --primary-foreground: 270 40% 98%;',
  '    --ring: 270 76% 53%;',
  '    --theme-color: 270 76% 53%;',
  '  }',
  '',
  '  .theme-green {',
  '    --primary: 142 76% 36%;',
  '    --primary-foreground: 142 40% 98%;',
  '    --ring: 142 76% 36%;',
  '    --theme-color: 142 76% 36%;',
  '  }',
  ' ',
  '  /* Dark mode theme color variations */',
  '  .dark.theme-blue {',
  '    --primary: 213 94% 68%;',
  '    --primary-foreground: 210 40% 98%;',
  '    --ring: 213 94% 68%;',
  '    --theme-color: 213 94% 68%;',
  '  }',
  ' ',
  '  .dark.theme-purple {',
  '    --primary: 270 86% 70%;',
  '    --primary-foreground: 270 40% 98%;',
  '    --ring: 270 86% 70%;',
  '    --theme-color: 270 86% 70%;',
  '  }',
  ' ',
  '  .dark.theme-green {',
  '    --primary: 142 69% 58%;',
  '    --primary-foreground: 142 40% 98%;',
  '    --ring: 142 69% 58%;',
  '    --theme-color: 142 69% 58%;',
  '  }',
  '}',
  '',
  '@layer base {',
  '  * {',
  '    @apply border-border;',
  '  }',
  '  body {',
  '    @apply bg-background text-foreground;',
  '  }',
  '}',
  '',
  '/* Theme color utility classes */',
  '.text-theme {',
  '  color: hsl(var(--theme-color));',
  '}',
  '',
  '.bg-theme {',
  '  background-color: hsl(var(--theme-color));',
  '}',
  '',
  '.border-theme {',
  '  border-color: hsl(var(--theme-color));',
  '}',
  '',
  '.scrollbar-hide::-webkit-scrollbar {',
  '  display: none;',
  '}',
  '',
  '.scrollbar-hide {',
  '  -ms-overflow-style: none;',
  '  scrollbar-width: none;',
  '}'
].join('\n');

// Create app/animation.css
const animationCss = [
  '@keyframes blob {',
  '0% {',
  '  transform: translate(0px, 0px) scale(1);',
  '}',
  '33% {',
  '  transform: translate(30px, -50px) scale(1.1);',
  '}',
  '66% {',
  '  transform: translate(-20px, 20px) scale(0.9);',
  '}',
  '100% {',
  '  transform: translate(0px, 0px) scale(1);',
  '}',
  '}',
  '',
  '.animate-blob {',
  '  animation: blob 7s infinite;',
  '}',
  '',
  '.animation-delay-2000 {',
  '  animation-delay: 2s;',
  '}',
  '',
  '.animation-delay-4000 {',
  '  animation-delay: 4s;',
  '}',
  '',
  '@keyframes blink {',
  '  0%, 100% { opacity: 1; }',
  '  50% { opacity: 0; }',
  '}',
  '',
  '.animate-blink {',
  '  animation: blink 1s infinite;',
  '}'
].join('\n');

// Create app/layout.tsx
const layoutTsx = [
  'import "./globals.css";',
  'import "./animation.css";',
  'import type { Metadata } from "next";',
  'import { Inter } from "next/font/google";',
  'import { ThemeProvider } from "@/components/theme-provider";',
  '',
  'const inter = Inter({ subsets: ["latin"] });',
  '',
  'export const metadata: Metadata = {',
  '  title: ' + JSON.stringify(portfolioData.fullName + ' - Portfolio') + ',',
  '  description: ' + JSON.stringify(portfolioData.title + ' - Professional Portfolio') + ',',
  '  generator: "Portfolio Generator"',
  '};',
  '',
  'export default function RootLayout({',
  '  children,',
  '}: {',
  '  children: React.ReactNode;',
  '}) {',
  '  return (',
  '    <html lang="en" className="theme-' + (portfolioData.themeColor || 'blue') + '" suppressHydrationWarning>',
  '      <body className={inter.className}>',
  '        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>',
  '          {children}',
  '        </ThemeProvider>',
  '      </body>',
  '    </html>',
  '  );',
  '}'
].join('\n');

// Create app/page.tsx (main portfolio page)
const portfolioDataStr = JSON.stringify(JSON.stringify(portfolioData, null, 2));
const pageTsx = [
  '"use client";',
  '',
  "import { useState, useEffect, useRef } from 'react';",
  "import { motion, useInView } from 'framer-motion';",
  "import Image from 'next/image';",
  "import { DottedBackground } from '@/components/dotted-background';",
  "import { ThemeToggle } from '@/components/theme-toggle';",
  '',
  '// Portfolio content and components',
  'const portfolioData = JSON.parse(' + portfolioDataStr + ');',
  '',
  '// Map experience data',
  'const mappedExperience = portfolioData.experience ? portfolioData.experience.map(exp => ({',
  '  position: exp.role,',
  '  company: exp.company,',
  '  duration: exp.duration,',
  '  description: exp.description',
  '})) : [];',
  '',
  '// Map projects data',
  'const mappedProjects = portfolioData.projects ? portfolioData.projects.map(proj => ({',
  '  title: proj.name,',
  '  description: proj.description,',
  '  technologies: proj.technologies,',
  '  link: proj.link,',
  '  image: proj.image',
  '})) : [];',
  '',
  '// Hero Background Animation',
  'function HeroBgAnimation() {',
  '  return (',
  '    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">',
  '      <div className="relative w-full max-w-6xl h-full max-h-[600px]">',
  '        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 dark:from-blue-600/20 dark:to-purple-600/20 blur-3xl"></div>',
  '        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>',
  '        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>',
  '        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-pink-500/20 dark:bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>',
  '        <DottedBackground />',
  '      </div>',
  '    </div>',
  '  );',
  '}',
  '',
  'export default function Home() {',
  '  const [scrolled, setScrolled] = useState(false);',
  '  ',
  '  useEffect(() => {',
  '    const handleScroll = () => {',
  '      if (window.scrollY > 50) {',
  '        setScrolled(true);',
  '      } else {',
  '        setScrolled(false);',
  '      }',
  '    };',
  '    ',
  '    window.addEventListener("scroll", handleScroll);',
  '    return () => window.removeEventListener("scroll", handleScroll);',
  '  }, []);',
  '',
  '  return (',
  '    <div className="min-h-screen bg-background text-foreground">',
  '      {/* Navbar with theme toggle */}',
  '      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md shadow-sm py-2" : "py-4"}`}>',
  '        <div className="container mx-auto px-4 flex justify-between items-center">',
  '          <h1 className="text-xl font-bold">{portfolioData.fullName}</h1>',
  '          <div className="flex items-center gap-4">',
  '            <nav>',
  '              <ul className="hidden md:flex space-x-6">',
  '                <li><a href="#about" className="text-foreground/80 hover:text-theme transition-colors">About</a></li>',
  '                <li><a href="#skills" className="text-foreground/80 hover:text-theme transition-colors">Skills</a></li>',
  '                <li><a href="#experience" className="text-foreground/80 hover:text-theme transition-colors">Experience</a></li>',
  '                <li><a href="#projects" className="text-foreground/80 hover:text-theme transition-colors">Projects</a></li>',
  '                <li><a href="#education" className="text-foreground/80 hover:text-theme transition-colors">Education</a></li>',
  '              </ul>',
  '            </nav>',
  '            <ThemeToggle />',
  '          </div>',
  '        </div>',
  '      </header>',
  '',
  '      {/* Hero section with animated background */}',
  '      <section className="min-h-screen flex flex-col justify-center items-center text-center py-20 relative">',
  '        {/* Background animations */}',
  '        <HeroBgAnimation />',
  '        ',
  '        <motion.div',
  '          initial={{ opacity: 0, y: 20 }}',
  '          animate={{ opacity: 1, y: 0 }}',
  '          transition={{ duration: 0.8 }}',
  '          className="space-y-6 max-w-4xl w-full px-4 relative z-10"',
  '        >',
  '          <div className="flex flex-col md:flex-row items-center justify-center gap-8">',
  '            {portfolioData.profileImage && (',
  '              <motion.div',
  '                initial={{ opacity: 0, scale: 0.8 }}',
  '                animate={{ opacity: 1, scale: 1 }}',
  '                transition={{ delay: 0.2, duration: 0.5 }}',
  '                className="w-56 h-56 md:w-64 md:h-64 relative overflow-hidden rounded-full border-4 border-theme shadow-lg"',
  '              >',
  '                <img',
  '                  src={portfolioData.profileImage}',
  '                  alt={portfolioData.fullName}',
  '                  className="object-cover transition-transform duration-300 hover:scale-110 hover:rotate-3 w-full h-full"',
  '                />',
  '              </motion.div>',
  '            )}',
  '',
  '            <div className="text-left">',
  '              <h2 className="text-xl md:text-2xl mb-2">Hi, I am</h2>',
  '              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-theme">{portfolioData.fullName}</h1>',
  '              <div className="text-xl md:text-2xl mb-2">',
  '                I am a <span className="text-theme font-medium">{portfolioData.title}</span>',
  '              </div>',
  '            </div>',
  '          </div>',
  '',
  '          <motion.div',
  '            initial={{ opacity: 0, scale: 0.8 }}',
  '            animate={{ opacity: 1, scale: 1 }}',
  '            transition={{ delay: 0.3, duration: 0.5 }}',
  '            className="flex justify-center mt-8"',
  '          >',
  '            <button',
  '              onClick={() => {',
  '                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })',
  '              }}',
  '              className="animate-bounce bg-theme text-white rounded-full p-3"',
  '            >',
  '              <svg',
  '                xmlns="http://www.w3.org/2000/svg"',
  '                width="24"',
  '                height="24"',
  '                viewBox="0 0 24 24"',
  '                fill="none"',
  '                stroke="currentColor"',
  '                strokeWidth="2"',
  '                strokeLinecap="round"',
  '                strokeLinejoin="round"',
  '                className="h-6 w-6"',
  '              >',
  '                <path d="M12 5v14" />',
  '                <path d="m19 12-7 7-7-7" />',
  '              </svg>',
  '            </button>',
  '          </motion.div>',
  '        </motion.div>',
  '      </section>',
  '',
  '      {/* About section */}',
  '      <section id="about" className="py-20">',
  '        <div className="max-w-2xl mx-auto px-4 sm:px-6">',
  '          <motion.div',
  '            initial={{ opacity: 0, y: 50 }}',
  '            whileInView={{ opacity: 1, y: 0 }}',
  '            transition={{ duration: 0.8 }}',
  '            viewport={{ once: true, margin: "-100px" }}',
  '            className="space-y-6"',
  '          >',
  '            <h2 className="text-3xl font-bold text-theme">About Me</h2>',
  '            <div className="h-0.5 w-16 bg-theme"></div>',
  '            <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">{portfolioData.about}</p>',
  '          </motion.div>',
  '        </div>',
  '      </section>',
  '',
  '      {/* Skills section */}',
  '      <section id="skills" className="py-20 bg-secondary/30">',
  '        <div className="max-w-4xl mx-auto px-4 sm:px-6">',
  '          <motion.div',
  '            initial={{ opacity: 0, y: 50 }}',
  '            whileInView={{ opacity: 1, y: 0 }}',
  '            transition={{ duration: 0.8 }}',
  '            viewport={{ once: true, margin: "-100px" }}',
  '            className="space-y-8"',
  '          >',
  '            <div className="text-center mb-12">',
  '              <h2 className="text-3xl font-bold text-theme mb-4">Skills & Technologies</h2>',
  '              <div className="h-0.5 w-16 bg-theme mx-auto"></div>',
  '            </div>',
  '',
  '            <div className="flex flex-wrap justify-center gap-3">',
  '              {portfolioData.skills && portfolioData.skills.map((skill, index) => (',
  '                <motion.div',
  '                  key={index}',
  '                  initial={{ opacity: 0, y: 20 }}',
  '                  whileInView={{ opacity: 1, y: 0 }}',
  '                  transition={{ duration: 0.5, delay: index * 0.1 }}',
  '                  viewport={{ once: true }}',
  '                  className="bg-card text-card-foreground shadow-sm rounded-full px-4 py-2 border"',
  '                >',
  '                  {skill}',
  '                </motion.div>',
  '              ))}',
  '            </div>',
  '          </motion.div>',
  '        </div>',
  '      </section>',
  '',
  '      {/* Experience section */}',
  '      <section id="experience" className="py-20">',
  '        <div className="max-w-4xl mx-auto px-4 sm:px-6">',
  '          <motion.div',
  '            initial={{ opacity: 0, y: 50 }}',
  '            whileInView={{ opacity: 1, y: 0 }}',
  '            transition={{ duration: 0.8 }}',
  '            viewport={{ once: true, margin: "-100px" }}',
  '            className="space-y-8"',
  '          >',
  '            <div className="text-center mb-12">',
  '              <h2 className="text-3xl font-bold text-theme mb-4">Work Experience</h2>',
  '              <div className="h-0.5 w-16 bg-theme mx-auto"></div>',
  '            </div>',
  '',
  '            <div className="space-y-12">',
  '              {mappedExperience && mappedExperience.map((job, index) => (',
  '                <motion.div',
  '                  key={index}',
  '                  initial={{ opacity: 0, y: 50 }}',
  '                  whileInView={{ opacity: 1, y: 0 }}',
  '                  transition={{ duration: 0.5, delay: index * 0.1 }}',
  '                  viewport={{ once: true }}',
  '                  className="border-l-4 border-theme pl-6 space-y-2 relative"',
  '                >',
  '                  <div className="absolute w-4 h-4 bg-theme rounded-full -left-[10px] top-0"></div>',
  '                  <div className="text-lg font-semibold">{job.position}</div>',
  '                  <div className="text-muted-foreground flex flex-col sm:flex-row sm:justify-between">',
  '                    <span>{job.company}</span>',
  '                    <span>{job.duration}</span>',
  '                  </div>',
  '                  <p className="mt-2 text-muted-foreground">{job.description}</p>',
  '                </motion.div>',
  '              ))}',
  '            </div>',
  '          </motion.div>',
  '        </div>',
  '      </section>',
  '',
  '      {/* Projects section */}',
  '      <section id="projects" className="py-20 bg-secondary/30">',
  '        <div className="max-w-6xl mx-auto px-4 sm:px-6">',
  '          <motion.div',
  '            initial={{ opacity: 0, y: 50 }}',
  '            whileInView={{ opacity: 1, y: 0 }}',
  '            transition={{ duration: 0.8 }}',
  '            viewport={{ once: true, margin: "-100px" }}',
  '            className="space-y-8"',
  '          >',
  '            <div className="text-center mb-12">',
  '              <h2 className="text-3xl font-bold text-theme mb-4">Projects</h2>',
  '              <div className="h-0.5 w-16 bg-theme mx-auto"></div>',
  '            </div>',
  '',
  '            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">',
  '              {mappedProjects && mappedProjects.map((project, index) => (',
  '                <motion.div',
  '                  key={index}',
  '                  initial={{ opacity: 0, y: 50 }}',
  '                  whileInView={{ opacity: 1, y: 0 }}',
  '                  transition={{ duration: 0.5, delay: index * 0.1 }}',
  '                  viewport={{ once: true }}',
  '                  className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden border border-border/40 hover:shadow-xl transition-shadow duration-300"',
  '                >',
  '                  {project.image && (',
  '                    <div className="h-48 overflow-hidden">',
  '                      <img',
  '                        src={project.image}',
  '                        alt={project.title}',
  '                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"',
  '                      />',
  '                    </div>',
  '                  )}',
  '                  <div className="p-6">',
  '                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>',
  '                    <p className="text-muted-foreground mb-4">{project.description}</p>',
  '                    <div className="flex flex-wrap gap-2 mb-4">',
  '                      {project.technologies && project.technologies.map((tech, techIndex) => (',
  '                        <span',
  '                          key={techIndex}',
  '                          className="text-xs bg-secondary px-2 py-1 rounded-full text-secondary-foreground"',
  '                        >',
  '                          {tech}',
  '                        </span>',
  '                      ))}',
  '                    </div>',
  '                    {project.link && (',
  '                      <a',
  '                        href={project.link}',
  '                        target="_blank"',
  '                        rel="noopener noreferrer"',
  '                        className="text-theme hover:underline text-sm inline-flex items-center"',
  '                      >',
  '                        View Project',
  '                        <svg',
  '                          xmlns="http://www.w3.org/2000/svg"',
  '                          width="24"',
  '                          height="24"',
  '                          viewBox="0 0 24 24"',
  '                          fill="none"',
  '                          stroke="currentColor"',
  '                          strokeWidth="2"',
  '                          strokeLinecap="round"',
  '                          strokeLinejoin="round"',
  '                          className="ml-1 h-4 w-4"',
  '                        >',
  '                          <path d="M7 7h10v10" />',
  '                          <path d="M7 17 17 7" />',
  '                        </svg>',
  '                      </a>',
  '                    )}',
  '                  </div>',
  '                </motion.div>',
  '              ))}',
  '            </div>',
  '          </motion.div>',
  '        </div>',
  '      </section>',
  '',
  '      {/* Education section */}',
  '      <section id="education" className="py-20">',
  '        <div className="max-w-4xl mx-auto px-4 sm:px-6">',
  '          <motion.div',
  '            initial={{ opacity: 0, y: 50 }}',
  '            whileInView={{ opacity: 1, y: 0 }}',
  '            transition={{ duration: 0.8 }}',
  '            viewport={{ once: true, margin: "-100px" }}',
  '            className="space-y-8"',
  '          >',
  '            <div className="text-center mb-12">',
  '              <h2 className="text-3xl font-bold text-theme mb-4">Education</h2>',
  '              <div className="h-0.5 w-16 bg-theme mx-auto"></div>',
  '            </div>',
  '',
  '            <div className="space-y-8">',
  '              {portfolioData.education && portfolioData.education.map((edu, index) => (',
  '                <motion.div',
  '                  key={index}',
  '                  initial={{ opacity: 0, y: 50 }}',
  '                  whileInView={{ opacity: 1, y: 0 }}',
  '                  transition={{ duration: 0.5, delay: index * 0.1 }}',
  '                  viewport={{ once: true }}',
  '                  className="border-l-4 border-theme pl-6 space-y-2 relative"',
  '                >',
  '                  <div className="absolute w-4 h-4 bg-theme rounded-full -left-[10px] top-0"></div>',
  '                  <div className="text-lg font-semibold">{edu.school}</div>',
  '                  <div className="text-muted-foreground flex flex-col sm:flex-row sm:justify-between">',
  '                    <span>{edu.degree}</span>',
  '                    <span>{edu.year}</span>',
  '                  </div>',
  '                </motion.div>',
  '              ))}',
  '            </div>',
  '          </motion.div>',
  '        </div>',
  '      </section>',
  '',
  '      <footer className="bg-theme text-white py-6">',
  '        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">',
  '          <p>&copy; {new Date().getFullYear()} {portfolioData.fullName}. All rights reserved.</p>',
  '          <div className="mt-4 md:mt-0">',
  '            <ThemeToggle />',
  '          </div>',
  '        </div>',
  '      </footer>',
  '    </div>',
  '  );',
  '}'
].join('\n');

// Create README.md
const fullName = JSON.stringify(portfolioData.fullName);
const title = JSON.stringify(portfolioData.title);
const about = JSON.stringify(portfolioData.about.substring(0, 150) + '...');

const readme = [
  '# ' + fullName + ' - Portfolio',
  '',
  'A personal portfolio website for ' + fullName + ', ' + title + '.',
  '',
  '## About',
  '',
  about,
  '',
  '## Built With',
  '',
  '- Next.js',
  '- React',
  '- TypeScript',
  '- Tailwind CSS',
  '- Framer Motion',
  '',
  '## Getting Started',
  '',
  'First, install the dependencies:',
  '',
  '```bash',
  'npm install',
  '# or',
  'yarn install',
  '```',
  '',
  'Then, run the development server:',
  '',
  '```bash',
  'npm run dev',
  '# or',
  'yarn dev',
  '```',
  '',
  'Open [http://localhost:3000](http://localhost:3000) with your browser to see the portfolio.'
].join('\n');

// Create components/theme-provider.tsx
const themeProviderTsx = [
  '"use client"',
  '',
  'import * as React from "react"',
  'import { ThemeProvider as NextThemesProvider } from "next-themes"',
  'import { type ThemeProviderProps } from "next-themes/dist/types"',
  '',
  'export function ThemeProvider({ children, ...props }: ThemeProviderProps) {',
  '  return <NextThemesProvider {...props}>{children}</NextThemesProvider>',
  '}'
].join('\n');

// Create components/theme-toggle.tsx
const themeToggleTsx = [
  '"use client"',
  '',
  'import { useTheme } from "next-themes"',
  'import { useState, useEffect } from "react"',
  '',
  'export function ThemeToggle() {',
  '  const { theme, setTheme } = useTheme()',
  '  const [mounted, setMounted] = useState(false)',
  '',
  '  // Avoid hydration mismatch by only rendering after mount',
  '  useEffect(() => {',
  '    setMounted(true)',
  '  }, [])',
  '',
  '  if (!mounted) {',
  '    return <div className="w-10 h-10 rounded-full bg-secondary/30 opacity-0"></div>',
  '  }',
  '',
  '  return (',
  '    <button',
  '      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}',
  '      className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-lg"',
  '      style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" }}',
  '      aria-label="Toggle theme"',
  '    >',
  '      <span className="absolute inset-0 bg-white dark:bg-black opacity-80 dark:opacity-70"></span>',
  '      {theme === "dark" ? (',
  '        <div className="relative z-10 text-yellow-300">',
  '          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">',
  '            <circle cx="12" cy="12" r="5" />',
  '            <path d="M12 1v2" />',
  '            <path d="M12 21v2" />',
  '            <path d="M4.22 4.22l1.42 1.42" />',
  '            <path d="M18.36 18.36l1.42 1.42" />',
  '            <path d="M1 12h2" />',
  '            <path d="M21 12h2" />',
  '            <path d="M4.22 19.78l1.42-1.42" />',
  '            <path d="M18.36 5.64l1.42-1.42" />',
  '          </svg>',
  '        </div>',
  '      ) : (',
  '        <div className="relative z-10 text-slate-700">',
  '          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">',
  '            <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />',
  '          </svg>',
  '        </div>',
  '      )}',
  '    </button>',
  '  )',
  '}'
].join('\n');

// Create components/dotted-background.tsx
const dottedBackgroundTsx = [
  '"use client"',
  '',
  'import { useTheme } from "next-themes"',
  'import { useEffect, useState } from "react"',
  '',
  'export function DottedBackground() {',
  '  const { theme, resolvedTheme } = useTheme()',
  '  const [mounted, setMounted] = useState(false)',
  '',
  '  // Avoid hydration mismatch',
  '  useEffect(() => {',
  '    setMounted(true)',
  '  }, [])',
  '',
  '  if (!mounted) return null',
  '',
  '  const isDark = resolvedTheme === "dark";',
  '',
  '  return (',
  '    <>',
  '      {/* Dotted pattern */}',
  '      <div className="absolute inset-0 z-0 transition-opacity duration-500 ease-in-out"',
  '           style={{ opacity: isDark ? 0.15 : 0.45 }}>',
  '        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">',
  '          <defs>',
  '            <pattern id="dotted-pattern" width="16" height="16" patternUnits="userSpaceOnUse">',
  '              <circle cx="2" cy="2" r="1" fill={isDark ? "#555555" : "#e5e7eb"} />',
  '            </pattern>',
  '          </defs>',
  '          <rect width="100%" height="100%" fill="url(#dotted-pattern)" />',
  '        </svg>',
  '      </div>',
  '      ',
  '      {/* Diagonal stripes */}',
  '      <div className="absolute inset-0 z-0 transition-opacity duration-500 ease-in-out"',
  '           style={{ opacity: isDark ? 0.1 : 0.25 }}>',
  '        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">',
  '          <defs>',
  '            <pattern id="diagonal-stripes" width="10" height="10" patternUnits="userSpaceOnUse">',
  '              <path d="M -2,2 l 4,-4 M 0,10 l 10,-10 M 8,12 l 4,-4" ',
  '                stroke={isDark ? "#555555" : "#e5e7eb"} strokeWidth="1.5" fill="none"/>',
  '            </pattern>',
  '          </defs>',
  '          <rect width="100%" height="100%" fill="url(#diagonal-stripes)" />',
  '        </svg>',
  '      </div>',
  '      ',
  '      {/* Theme-colored gradient overlay */}',
  '      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10">',
  '        <div className="w-full h-full bg-gradient-to-br from-primary via-transparent to-primary/50 transition-all duration-500"></div>',
  '      </div>',
  '    </>',
  '  )',
  '}'
].join('\n');

  return {
    "package.json": packageJson,
    "next.config.js": nextConfig,
    "tsconfig.json": tsConfig,
    "tailwind.config.js": tailwindConfig,
    "postcss.config.js": postcssConfig,
    ".gitignore": gitignore,
    ".npmrc": npmrc,
    "app/globals.css": globalCss,
    "app/animation.css": animationCss,
    "app/layout.tsx": layoutTsx,
    "app/page.tsx": pageTsx,
    "README.md": readme,
    "components/theme-provider.tsx": themeProviderTsx,
    "components/theme-toggle.tsx": themeToggleTsx,
    "components/dotted-background.tsx": dottedBackgroundTsx,
  };
}

export async function POST(req: NextRequest) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await req.json();
    const { portfolioData, repoName } = body;
    
    if (!portfolioData || !repoName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize Octokit with the GitHub token
    const octokit = new Octokit({
      auth: session.accessToken,
    });

    // Get authenticated user
    const { data: user } = await octokit.users.getAuthenticated();
    const username = user.login;

    // Check if repo already exists
    let repoExists = false;
    try {
      await octokit.repos.get({
        owner: username,
        repo: repoName,
      });
      repoExists = true;
    } catch (error) {
      // Repo doesn't exist, which is fine
    }

    // Create repository if it doesn't exist
    if (!repoExists) {
      await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: `Portfolio website for ${portfolioData.fullName}`,
        private: false,
        auto_init: true,
      });
    }

    // Generate files
    const files = generatePortfolioFiles(portfolioData);

    // Get the default branch
    const { data: repoData } = await octokit.repos.get({
      owner: username,
      repo: repoName,
    });
    
    const defaultBranch = repoData.default_branch;

    // Get the latest commit SHA
    const { data: refData } = await octokit.git.getRef({
      owner: username,
      repo: repoName,
      ref: `heads/${defaultBranch}`,
    });
    
    const latestCommitSha = refData.object.sha;

    // Get the base tree
    const { data: commitData } = await octokit.git.getCommit({
      owner: username,
      repo: repoName,
      commit_sha: latestCommitSha,
    });
    
    const baseTreeSha = commitData.tree.sha;

    // Create blobs for each file
    const fileBlobs = await Promise.all(
      Object.entries(files).map(async ([path, content]) => {
        const { data } = await octokit.git.createBlob({
          owner: username,
          repo: repoName,
          content: typeof content === 'string' ? content : JSON.stringify(content),
          encoding: 'utf-8',
        });
        
        return {
          path,
          mode: "100644" as const, // file mode (standard file)
          type: "blob" as const,
          sha: data.sha,
        };
      })
    );

    // Create a new tree with the new files
    const { data: newTree } = await octokit.git.createTree({
      owner: username,
      repo: repoName,
      base_tree: baseTreeSha,
      tree: fileBlobs,
    });

    // Create a commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner: username,
      repo: repoName,
      message: 'Add Next.js portfolio files',
      tree: newTree.sha,
      parents: [latestCommitSha],
    });

    // Update the reference
    await octokit.git.updateRef({
      owner: username,
      repo: repoName,
      ref: `heads/${defaultBranch}`,
      sha: newCommit.sha,
    });

    // Deploy to Vercel
    // Note: You would need a Vercel API token and to set up the project in Vercel first
    // This is a simplified example
    try {
      // For a real implementation, you would use the Vercel API to deploy
      // This would require a VERCEL_TOKEN environment variable
      const vercelToken = process.env.VERCEL_TOKEN;
      
      if (!vercelToken) {
        return NextResponse.json({
          success: true,
          message: "Repository created/updated successfully",
          repoUrl: `https://github.com/${username}/${repoName}`,
          deployUrl: null,
          note: "Vercel deployment skipped - no API token provided"
        });
      }
      
      // Create a new deployment with Vercel
      const vercelResponse = await axios.post(
        'https://api.vercel.com/v13/deployments',
        {
          name: repoName,
          gitSource: {
            type: 'github',
            repo: `${username}/${repoName}`,
            ref: defaultBranch,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${vercelToken}`,
          },
        }
      );
      
      return NextResponse.json({
        success: true,
        message: "Repository created and deployed successfully",
        repoUrl: `https://github.com/${username}/${repoName}`,
        deployUrl: vercelResponse.data.url,
      });
      
    } catch (error) {
      console.error("Vercel deployment error:", error);
      
      // Return success for the GitHub part even if Vercel fails
      return NextResponse.json({
        success: true,
        message: "Repository created/updated successfully, but Vercel deployment failed",
        repoUrl: `https://github.com/${username}/${repoName}`,
        deployUrl: null,
        error: "Vercel deployment failed"
      });
    }
    
  } catch (error) {
    console.error("Deployment error:", error);
    return NextResponse.json(
      { error: "Failed to deploy portfolio" },
      { status: 500 }
    );
  }
}
