# IRISeller Mobile App

A premium cross-platform mobile application for IRISeller that provides access to your AI Sales Team on iOS, Android, and tablet devices.

## 🎨 Design Philosophy

The mobile app maintains complete brand consistency with the IRISeller web platform:

- **Teal Color Palette**: Featuring our signature turquoise (#06868D) as the primary brand color
- **Modern Typography**: Futura PT for headers, clean system fonts for body text
- **Minimalist UI**: Clean white backgrounds with subtle shadows and ample whitespace
- **Smooth Animations**: Native-feeling transitions and interactions

## 📱 Features

### Current Features
- ✅ Beautiful login screen with gradient branding
- ✅ Dashboard with key performance metrics
- ✅ AI Agents status monitoring
- ✅ Quick action buttons
- ✅ Bottom tab navigation
- ✅ Responsive design for phones and tablets

### Planned Features
- 📋 Lead qualification interface
- 🔍 Prospect research viewer
- 📧 Email composition and automation
- 📊 Interactive analytics charts
- 🔔 Real-time push notifications
- 💾 Offline mode with data sync
- 🎤 Voice commands integration
- 🔐 Biometric authentication

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI (will be installed automatically)
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on your physical device (optional)

### Installation

1. Navigate to the mobile app directory:
```bash
cd /opt/IRISeller/IRISellerMobile
```

2. Install dependencies (if not already done):
```bash
npm install
```

### Running the App

#### On iOS Simulator (Mac only)
```bash
npm run ios
```

#### On Android Emulator
```bash
npm run android
```

#### On Physical Device via Expo Go
```bash
npx expo start
```
Then scan the QR code with:
- iOS: Camera app
- Android: Expo Go app

#### On Web Browser (Development)
```bash
npm run web
```

## 🏗️ Project Structure

```
IRISellerMobile/
├── src/
│   ├── components/         # Reusable UI components
│   │   └── common/         # Common components (Button, Card, Text)
│   ├── screens/           # Screen components
│   │   ├── LoginScreen.tsx
│   │   └── HomeScreen.tsx
│   ├── theme/             # Design system
│   │   ├── colors.ts      # IRIS brand colors
│   │   ├── typography.ts  # Font system
│   │   └── index.ts       # Theme exports
│   └── services/          # API services (coming soon)
├── assets/                # Images, fonts, icons
├── App.tsx               # Main app entry point
└── package.json          # Dependencies
```

## 🎨 Brand Colors

Our mobile app uses the same IRIS brand palette:

| Color | Hex | Usage |
|-------|-----|-------|
| **True Turquoise** | `#06868D` | Primary brand color, CTAs |
| **Off Black** | `#09171F` | Primary text, headers |
| **Peacock** | `#265E5A` | Medium accents, secondary buttons |
| **Plex Blue** | `#2EE5EA` | Highlights, active states |
| **Sky** | `#A0B8D0` | Subtle backgrounds, borders |

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test on Different Devices
The app is optimized for:
- iPhone 12-15 series
- iPad Pro and iPad Mini
- Android phones (Pixel, Samsung Galaxy)
- Android tablets

## 📦 Building for Production

### iOS Build (requires Mac)
```bash
npx eas build --platform ios
```

### Android Build
```bash
npx eas build --platform android
```

### Over-The-Air Updates
```bash
npx expo publish
```

## 🔧 Development Tips

### Hot Reload
The app supports hot reload - save your changes and see them instantly.

### Debugging
- Shake device or press `Cmd+D` (iOS) / `Ctrl+M` (Android) to open developer menu
- Use React Native Debugger for advanced debugging

### Performance
- Use React.memo for expensive components
- Implement lazy loading for screens
- Optimize images with expo-optimize

## 📱 Screenshots

### Login Screen
- Gradient background with IRIS branding
- Clean form inputs with teal accents
- SSO integration support

### Dashboard
- Key metrics cards with real-time data
- AI Agent status monitoring
- Quick action buttons for common tasks

### Navigation
- Bottom tab navigation with 5 main sections
- Smooth transitions between screens
- Consistent header styling

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test on both iOS and Android
4. Submit a pull request

## 📄 License

Proprietary - IRISeller © 2024

## 🆘 Support

For issues or questions:
- Check the [main documentation](/opt/IRISeller/docs)
- Contact the development team
- Review the [mobile app plan](/opt/IRISeller/docs/mobile-app-plan.md)

---

Built with ❤️ using React Native and Expo











