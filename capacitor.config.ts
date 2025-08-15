import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iriseller.mobile',
  appName: 'IRISeller',
  webDir: 'www',
  server: {
    url: 'https://app.iriseller.com',
    cleartext: true,
    allowNavigation: ['app.iriseller.com', 'api.iriseller.com', 'beta.iriseller.com']
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#06868D',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#06868D'
    },
    Keyboard: {
      resize: 'body'
    }
  },
  ios: {
    scheme: 'IRISeller',
    contentInset: 'automatic'
  }
};

export default config;
