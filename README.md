# 🏆 Gold Probot Coin

> The Revolutionary Cryptocurrency Powered by Pure Optimism

A joke cryptocurrency website built with Angular, featuring live price tracking, historical charts, and data persistence. All values are measured in "Pounds of Pure Optimism" (lbs).

## 🌟 Features

- **Live Price Tracking**: Real-time price updates every 30 seconds
- **Historical Charts**: Custom canvas-based price history visualization
- **Data Persistence**: Uses localStorage to maintain consistent data between visits
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Gold-themed crypto aesthetic with smooth animations
- **SPA Routing**: Seamless navigation between intro and tracker pages

## 🚀 Live Demo

Visit the live site at: `https://yourusername.github.io/probotcoin/`

## 📱 Pages

- **Intro Page** (`/`): Landing page with features and current statistics
- **Tracker Page** (`/tracker`): Detailed price tracking with charts and analytics

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/probotcoin.git
cd probotcoin

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`

### Build Commands

```bash
# Development build
npm run build

# Production build
npm run build:prod

# GitHub Pages build (with correct base href)
npm run build:gh-pages

# Deploy to GitHub Pages
npm run deploy
```

## 🚀 GitHub Pages Deployment

### Method 1: Automated Deployment (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy on every push to main

3. **Access your site**: 
   - Your site will be available at `https://yourusername.github.io/probotcoin/`

### Method 2: Manual Deployment

```bash
# Build and deploy manually
npm run deploy
```

### SPA Routing Support

The project includes:
- **404.html**: Redirects unknown routes back to the app
- **.nojekyll**: Prevents Jekyll processing
- **SPA redirect scripts**: Handles client-side routing on GitHub Pages

## 🏗️ Project Structure

```
gold-probot-coin/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── intro/          # Landing page component
│   │   │   └── tracker/        # Price tracker component
│   │   ├── services/
│   │   │   └── crypto-data.ts  # Data generation & persistence
│   │   ├── app.routes.ts       # Routing configuration
│   │   └── ...
│   ├── styles.scss             # Global styles
│   └── index.html              # Main HTML file
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions deployment
└── public/
    ├── probotcoin.png          # Coin image asset
    └── favicon.ico
```

## 🎨 Technical Details

### Data Generation
- **Random Walk Algorithm**: Creates realistic price movements
- **30-Day History**: Maintains rolling price history
- **localStorage Persistence**: Data survives browser refreshes
- **Daily Updates**: Generates new prices when visiting on new days

### UI/UX
- **Angular 18**: Latest Angular with standalone components
- **SCSS Styling**: Modern CSS with variables and mixins
- **Canvas Charts**: Custom-drawn price charts without external libraries
- **Responsive Grid**: CSS Grid and Flexbox for layout
- **Gold Theme**: Consistent #ffd700 color scheme

### Performance
- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Production builds with tree shaking
- **Minimal Bundle**: Under 100KB compressed

## 🔧 Configuration

### Changing Repository Name
If your repository name is different from `probotcoin`, update:

1. **package.json**: Update the `build:gh-pages` script base href
2. **404.html**: Update the redirect logic if needed
3. **Deploy script**: Ensure the directory path matches

### Custom Domain
To use a custom domain:

1. Add a `CNAME` file to the `public/` folder
2. Update the base href in build scripts
3. Configure DNS settings with your domain provider

## 📊 Features Detail

### Price Tracking
- Real-time updates every 30 seconds
- Micro-fluctuations for realistic movement
- 24h and 7d percentage changes
- Volume and market cap calculations

### Data Persistence
- localStorage for price history
- Date-based data generation
- Consistent experience across sessions
- No backend required

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized typography scaling

## 🤝 Contributing

This is a joke project, but improvements are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this for your own joke crypto projects!

## ⚠️ Disclaimer

Gold Probot Coin is a joke/demo project and not a real cryptocurrency. All price data is randomly generated for entertainment purposes only. Please do not make any actual financial decisions based on this website.

---

*Powered by Pure Optimism™* 🌟
