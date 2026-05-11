# EGTC STAFF PRO - Deployment Guide

This system is built using React, Vite, and Tailwind CSS. It is designed to be easily deployed to [Vercel](https://vercel.com).

## Vercel Deployment

1. **Connect Repository**: Push this code to a GitHub, GitLab, or Bitbucket repository.
2. **Import to Vercel**: Connect your repository to Vercel.
3. **Build Settings**: Vercel will automatically detect Vite.
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**: If you add backend features or Firebase later, add your variables in the Vercel dashboard.

## SPA Routing
The included `vercel.json` ensures that deep-linking and browser refreshes work correctly by rewriting all requests to `index.html`.

## Logo Asset
For the EGTC logo to appear correctly in your deployed version:
1. Download your company logo.
2. Place it in the `public` folder.
3. Rename it to `logo.png`.
4. The system will automatically pick it up if you update the references in `Login.tsx` and `StaffView.tsx` to `/logo.png`.

## Login Credentials
The system currently uses local storage for demo purposes. See `LOGIN_INFO.md` for test accounts.
