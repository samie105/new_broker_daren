# Trans-Atlantic Capitals - Crypto Landing Page

A modern, responsive cryptocurrency exchange landing page built with Next.js 15, Tailwind CSS, and advanced animations.

## Features

- 🌙 **Dark/Light Mode** - Full theme support with next-themes
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- ⚡ **Fast Performance** - Next.js 15 with React Server Components
- 🎨 **Modern UI** - Glass morphism effects and smooth animations
- 💙 **Blue Primary Theme** - Professional cryptocurrency branding
- 🔒 **TypeScript** - Full type safety throughout the application

## Design Features

- **Hero Section** - Eye-catching hero with animated trading widget
- **Live Market Data** - Real-time crypto prices and market trends
- **Feature Showcase** - Advanced trading features with icons
- **Trading Interface** - Interactive mock trading dashboard
- **Trust Indicators** - Statistics and social proof
- **Newsletter Signup** - Email collection with validation
- **Responsive Navigation** - Mobile-friendly header with theme toggle

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Shadcn UI patterns
- **Icons**: Lucide React
- **Typography**: Inter font
- **Package Manager**: pnpm
- **Theme**: next-themes for dark/light mode

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run the development server**:
   ```bash
   pnpm dev
   ```

3. **Build for production**:
   ```bash
   pnpm build
   pnpm start
   ```

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles with CSS variables
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Home page composition
├── components/
│   ├── layout/
│   │   ├── header.tsx       # Navigation header
│   │   └── footer.tsx       # Site footer
│   ├── sections/
│   │   ├── hero-section.tsx      # Hero with CTA
│   │   ├── stats-section.tsx     # Market data & stats
│   │   ├── features-section.tsx  # Feature highlights
│   │   ├── trading-section.tsx   # Trading showcase
│   │   └── cta-section.tsx       # Final call-to-action
│   ├── ui/
│   │   └── button.tsx       # Reusable button component
│   ├── widgets/
│   │   └── trading-widget.tsx    # Interactive trading demo
│   └── theme-provider.tsx   # Theme context provider
├── lib/
│   └── utils.ts             # Utility functions
└── package.json
```

## Styling Approach

### CSS Variables
- Custom CSS variables for consistent theming
- Blue primary color scheme (216, 100%, 50%)
- Semantic color tokens for light/dark modes

### Custom Classes
- `.gradient-bg` - Primary gradient backgrounds
- `.gradient-text` - Gradient text effects
- `.glass-effect` - Glass morphism styling
- `.neon-glow` - Subtle glow effects

### Animations
- Custom Tailwind animations for smooth interactions
- Staggered fade-in animations for section reveals
- Floating and pulse effects for visual interest

## Responsive Design

- **Mobile-first** approach with Tailwind breakpoints
- **Flexible grid layouts** that adapt to screen sizes
- **Touch-friendly** navigation and interactive elements
- **Optimized typography** scaling across devices

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## Performance

- **Server-side rendering** with Next.js 15
- **Optimized bundle** with tree shaking
- **Lazy loading** for non-critical components
- **CSS-in-JS** avoided for better performance

## License

MIT License - feel free to use this project as inspiration for your own crypto landing pages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ using Next.js 15 and Tailwind CSS 