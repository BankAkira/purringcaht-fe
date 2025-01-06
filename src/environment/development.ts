import { Chain, sepolia } from 'viem/chains';

const environment = {
  apiUrl: 'http://localhost:3000',
  // apiUrl: 'https://ccc.dev.zchoolmate.com',
  // apiUrl: 'https://chat-api.socialbureau.io',
  sbApiUrl: 'https://api-dev.socialbureau.io',
  domainName: 'http://localhost:4200',
  domainSocialBureau: 'http://localhost:4201',
  emailOfficialPurringChat: 'hoodiepurr@purrmail.io',
  supportChains: [sepolia] as Chain[],
  web3AuthClientId:
    'BBkkRGurMbULAntngkexBmbs-tAjspKtaZLpTocycuCpNmL38OcnwlYf0AbmILMu4vXJje2h16dre7X0pksHzS4',
  firebaseConfig: {
    apiKey: 'AIzaSyCIKHNQnAl3DuzSUEdXcl0QM4mtGqNn-cY',
    authDomain: 'social-bureau-chat-backe-46f34.firebaseapp.com',
    databaseURL:
      'https://social-bureau-chat-backe-46f34-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'social-bureau-chat-backe-46f34',
    storageBucket: 'social-bureau-chat-backe-46f34.appspot.com',
    messagingSenderId: '755565667577',
    appId: '1:755565667577:web:97018c6b7056a4aa44ae28',
    messagingKey:
      'BLKr_dNY0tRBoZtc3qNNv4iWSx5uQrdoPnoqRt_6nXdvlGravmOlwMyHi3yc4jJpIKAruGpLLbhFu3BFS9EMiPU',
  },
  userDisplayNameUpdateTime: 30,
  xApiKey:
    'VZayu2/Xrxuc2WUuJLVQ5NipmFMTqWMGUOteMIG2aGt+JBPdWEo1ZvX9DrSg1xJOkZnUAi2MTE0ig7lsyyqyETsrpWwzcJN1RVJ0bo5ucLMbnL1wfF2X3jfD6RrUt+cUWSsM3s5Bs4nJ6mvGMVzcbqJ2tb5Jb/guhK/wZKB2Tym7NfNcMaBriGqVcXF02ru+PL90WCwJ8sz3Qmk2iHRFBLe9de+88I01dPeQ3X1J3g77Xr1OXm60qkcbguY59DKHseiBqh/wsZiNOO3vgJLyt4SKr6nhc1BxrGde2iPuqPzgDeo3yhuVRtzgGWd/IMGWuQpFsfrdYaB8VXI9QgWBOw==',
  sentryDsn: '',
  appVersion: '2.4',
};

export default environment;
