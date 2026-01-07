# LingoVibe 🌍

A modern, gamified language learning application built with SvelteKit. Learn languages with joy through interactive lessons, quizzes, and progress tracking.

## ✨ Features

### 🎓 Interactive Learning
- **Structured Lessons**: Learn vocabulary, grammar, and pronunciation step-by-step
- **Multiple Languages**: Start with Russian, with more languages coming soon
- **Difficulty Levels**: Choose from common, intermediate, and advanced word sets
- **Interactive Quizzes**: Test your knowledge with various quiz types

### 🏆 Progress Tracking
- **XP System**: Earn experience points as you complete lessons
- **Streak Counter**: Build and maintain your learning streak
- **Progress Dashboard**: Track your learning journey across all languages

### ☁️ Cloud Sync (NEW!)
- **GitHub Integration**: Sign in with GitHub to sync your progress across devices
- **Automatic Backup**: Your progress is automatically saved to a private GitHub Gist
- **Offline-First**: Everything works offline with automatic sync when online
- **Cross-Device**: Access your progress from any device
- **Privacy-Focused**: All data is stored in your private GitHub Gist

### 🎨 User Experience
- **Beautiful UI**: Clean, modern interface inspired by popular language learning apps
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **No Account Required**: Start learning immediately (account optional for cloud sync)
- **Fast & Lightweight**: Built as a static site for maximum performance

## 🚀 Getting Started

### For Users

Simply visit the deployed app and start learning! No installation required.

**Optional**: Sign in with GitHub to enable cloud sync and access your progress from any device.

### For Developers

#### Prerequisites
- Node.js 18+ 
- npm

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/chefexperte/LingoVibe.git
cd LingoVibe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173/LingoVibe`

#### Building for Production

```bash
npm run build
```

The built files will be in the `build` directory.

#### Preview Production Build

```bash
npm run preview
```

#### Running Tests

LingoVibe uses Vitest for unit testing. The test suite covers stores, services, and utility functions.

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

Test coverage includes:
- ✅ Store logic (user, lessons, quizzes)
- ✅ Utility functions (formatters, validators)
- ✅ Business logic and state management

Target coverage: >70% on core business logic

## 🔐 GitHub OAuth Setup

To enable cloud sync features, you need to set up GitHub OAuth. See [GITHUB_OAUTH_SETUP.md](GITHUB_OAUTH_SETUP.md) for detailed instructions.

Quick setup:
1. Create a GitHub OAuth App at https://github.com/settings/developers
2. Set the callback URL to your deployment URL + `/auth/callback`
3. Add your Client ID to `.env`:
   ```
   VITE_GITHUB_CLIENT_ID=your_client_id_here
   ```
4. Set up an OAuth proxy (see GITHUB_OAUTH_SETUP.md)

## 📱 Usage

### Without Cloud Sync
1. Create a local account with a username
2. Choose your target language
3. Start learning with lessons
4. Track your progress locally

### With Cloud Sync
1. Click "Sign in with GitHub"
2. Authorize LingoVibe
3. Your progress is automatically backed up
4. Sign in on any device to continue learning

## 🛠️ Technology Stack

- **Framework**: SvelteKit 2.0
- **Language**: JavaScript
- **Styling**: Vanilla CSS with custom design system
- **Build Tool**: Vite
- **Deployment**: GitHub Pages (static adapter)
- **Cloud Storage**: GitHub Gists (via GitHub API)
- **Authentication**: GitHub OAuth

## 📂 Project Structure

```
LingoVibe/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable Svelte components
│   │   ├── services/       # Business logic (auth, sync)
│   │   ├── stores/         # Svelte stores (state management)
│   │   ├── lessons/        # Lesson content
│   │   └── data/          # Static data (word frequency)
│   ├── routes/            # SvelteKit routes (pages)
│   └── app.css           # Global styles
├── static/               # Static assets
└── build/               # Production build output
```

## 🔒 Privacy & Security

- **Local-First**: All data is stored locally in your browser first
- **Private Gists**: Cloud backups are stored in private GitHub Gists
- **Minimal Permissions**: Only requests `gist` scope from GitHub
- **No Tracking**: No analytics or tracking scripts
- **Open Source**: All code is public and auditable

## 🌟 Features in Detail

### Lesson Types
- **Vocabulary**: Learn new words with translations and examples
- **Grammar**: Understand sentence structure and rules
- **Pronunciation**: Practice speaking with phonetic guides

### Quiz Modes
- **Translation**: Translate words between languages
- **Multiple Choice**: Choose the correct translation
- **Typing**: Type the correct translation
- **Audio**: Listen and identify words

### Sync Features
- **Auto-Sync**: Changes sync automatically with debouncing
- **Conflict Resolution**: Most recent data wins
- **Sync Status**: Visual indicator shows sync state
- **Manual Sync**: Force sync from settings page
- **Offline Queue**: Syncs automatically when back online

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Run tests to ensure everything works (`npm test`)
5. Build the project to verify (`npm run build`)
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

### Code Quality Guidelines

- Write tests for new features
- Follow existing code style and patterns
- Use the provided utility functions (in `src/lib/utils/`)
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test responsive design on mobile and desktop

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

### What this means:
- ✅ Free to use, modify, and distribute
- ✅ Can be used commercially
- ✅ No warranty provided
- ✅ Attribution appreciated but not required

## 🙏 Acknowledgments

- Wiktionary for language data
- GitHub for providing free Gist storage
- The Svelte/SvelteKit team for the amazing framework

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ using Svelte
