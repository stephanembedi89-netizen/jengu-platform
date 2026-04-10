import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ai.jengu.assur',
  appName: 'JenguAssur',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Pour le dev, pointer vers le serveur Next.js local
    // url: 'http://192.168.1.x:3000',
    // cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0f1e',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0f1e',
    },
  },
}

export default config
