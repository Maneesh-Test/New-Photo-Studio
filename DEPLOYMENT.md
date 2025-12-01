# 🚀 Deploy Photo Studio to the Internet

This guide will help you deploy your Photo Studio app so anyone can use it online.

## Option 1: Vercel (Recommended - Easiest)

### Why Vercel?
- ✅ **Free hosting** for personal projects
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **One-click deployment**
- ✅ **Auto-deploys** on git push

### Steps:

1. **Create a Vercel account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Push your code to GitHub**
   ```bash
   cd "/Users/maneeshchandra/Antigravity Project/Photo-Studio"
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create photo-studio --public --source=. --remote=origin --push
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Vite
   - Click "Deploy"

4. **Add Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add:
     - `VITE_GEMINI_API_KEY` = your Gemini API key
   - Redeploy

5. **Your app is live! 🎉**
   - URL: `https://photo-studio-yourname.vercel.app`

---

## Option 2: Netlify

### Steps:

1. **Create Netlify account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Build your app**
   ```bash
   npm run build
   ```

3. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

4. **Or deploy via drag-and-drop**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag your `dist` folder
   - Done!

---

## Option 3: GitHub Pages

### Steps:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add to `scripts`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. **Update vite.config.ts**
   Add:
   ```typescript
   base: '/photo-studio/'
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repo Settings → Pages
   - Source: `gh-pages` branch
   - Your site: `https://yourusername.github.io/photo-studio/`

---

## Environment Variables

For your app to work properly, you need to set:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### How to get Gemini API Key:
1. Go to [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy and add to your deployment platform

---

## Quick Deploy Commands

### Vercel (via CLI)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Netlify (via CLI)
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## Testing Before Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Custom Domain (Optional)

### On Vercel:
1. Go to project Settings → Domains
2. Add your custom domain
3. Update DNS records as shown

### On Netlify:
1. Go to Domain Settings
2. Add custom domain
3. Follow DNS instructions

---

## Troubleshooting

### Build fails?
- Check `node_modules` is in `.gitignore`
- Run `npm install` before building
- Ensure all dependencies are in `package.json`

### Environment variables not working?
- Make sure variable names start with `VITE_`
- Redeploy after adding env vars
- Check deployment logs

### 404 errors?
- Add `_redirects` file to `public` folder:
  ```
  /*    /index.html   200
  ```

---

## Summary

**Fastest option**: Vercel
1. Push to GitHub
2. Connect to Vercel
3. Add API key
4. Deploy (takes ~2 minutes)

Your app will be live at: `https://your-app.vercel.app`

🎉 **Now anyone on the internet can use your Photo Studio!**
