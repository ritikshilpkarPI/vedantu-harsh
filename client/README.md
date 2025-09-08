# YouTube Subscription Gate - Frontend Only

A simple React app for Harsh Priyam (Vedantu Master Teacher) that encourages YouTube subscriptions before PDF downloads.

## Features

- 📺 **Subscribe Button**: Opens YouTube channel with subscription prompt
- 📄 **Download Button**: Opens PDF link after subscription
- 🎨 **Clean Design**: Simple, modern interface
- 📱 **Mobile Responsive**: Works on all devices
- ⚡ **No Backend Required**: Pure frontend solution

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Build for production
npm run build
```

## Configuration

Edit the links in `src/App.js`:

```javascript
const YOUTUBE_SUBSCRIBE_URL = 'https://www.youtube.com/channel/UC91RZv71f8p0VV2gaFI07pg?sub_confirmation=1';
const PDF_DOWNLOAD_URL = 'https://vdnt.in/short?q=H2a8P';
```

## How it Works

1. User clicks "Subscribe to Channel"
2. YouTube opens in new tab with subscription prompt
3. User returns and can click "Download PDF"
4. PDF link opens in new tab

## Deployment

This is a standard React app that can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

Just run `npm run build` and deploy the `build` folder.

## No Backend Needed

This version doesn't require:
- ❌ Node.js server
- ❌ Database
- ❌ API keys
- ❌ Environment variables
- ❌ Complex setup

Just pure React!
