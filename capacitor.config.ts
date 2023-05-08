import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gendfr.app',
  appName: 'gend-fr',
  webDir: 'www',
  bundledWebRuntime: false
};

/*
FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com"],
    }
*/

export default config;
