# 🎬 PopStack - Track & Stack Your Media

> Social media platform for movie, TV show, and video game enthusiasts. Rate, review, and share your entertainment journey with friends.

![PopStack](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-Backend-green) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)

## 🚀 Quick Start

### Demo Mode (No Backend Required)

Perfect for portfolio showcase:

```bash
npm install
npm run demo  # Toggle demo mode
npm run dev
```

### Full Version (With Supabase)

For production use:

```bash
npm install
cp .env.example .env.local
# Fill in your Supabase and API keys
npm run dev
```

## ✨ Features

- 🎬 **Discover** - Browse thousands of movies, TV shows, and games
- ⭐ **Rate & Review** - 10-star rating system with text reviews
- 📚 **Watchlist** - Track what you want to watch/play
- 📁 **Collections** - Create custom folders
- 👥 **Social** - Friend system with activity feed
- 📊 **Stats** - Track your viewing/gaming habits
- 🌍 **i18n** - Polish & English support
- 🌓 **Themes** - Dark & Light mode
- 📱 **Responsive** - Works on all devices

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, TailwindCSS
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **APIs:** TMDB (movies/TV), RAWG (games)
- **State:** React Query, Context API
- **UI:** Radix UI, Custom components

## 📚 Documentation

- [Portfolio README](./PORTFOLIO-README.md) - Detailed project info
- [Deployment Guide](./DEPLOYMENT-GUIDE.md) - How to deploy
- [Supabase Setup](./supabase-setup.sql) - Database schema

## 🎯 Demo Mode vs Full Version

| Feature  | Demo Mode      | Full Version      |
| -------- | -------------- | ----------------- |
| Backend  | ❌ Not needed  | ✅ Supabase       |
| Auth     | ❌ Mock user   | ✅ Real auth      |
| Data     | 📦 Sample data | 💾 Real database  |
| Cost     | 💰 $0          | 💰 $0 (free tier) |
| Use Case | 🎨 Portfolio   | 🚀 Production     |

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Demo Version

```bash
npm run build:demo
vercel --prod
```

Set `VITE_DEMO_MODE=true` in Vercel environment variables.

## 📸 Screenshots

Coming soon...

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome!

## 📝 License

MIT License - Free to use in your portfolio

## 👨‍💻 Author

Created with ❤️ for my portfolio

---

⭐ **Star this repo if you like it!**
