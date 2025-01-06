import { Chain, optimism } from 'viem/chains';

const environment = {
  apiUrl: 'https://chat-api.socialbureau.io',
  sbApiUrl: 'https://api.socialbureau.io',
  supportChains: [optimism] as Chain[],
  domainName: 'https://app.purringchat.io',
  domainSocialBureau: 'https://www.socialbureau.io',
  emailOfficialPurringChat: 'hoodiepurr@purrmail.io',

  web3AuthClientId:
    'BLUTtdC_qs-icqGqEMWGdMeK-HxeBuvl1jEEEvO_tBtrtC4e_UGQhITg5RqSoAf8MncxdXPWQ2j2nB7B3fndIbk',
  firebaseConfig: {
    apiKey: 'AIzaSyDmkK5YuYawqLNaHDwtRZ-QnFhZbCefdr4',
    authDomain: 'socialbureau-website.firebaseapp.com',
    databaseURL:
      'https://socialbureau-website-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'socialbureau-website',
    storageBucket: 'socialbureau-website.appspot.com',
    messagingSenderId: '615628052231',
    appId: '1:615628052231:web:3246523e944c62f28ad7a2',
    measurementId: 'G-0F9WKW89B6',
    messagingKey:
      'BKYV-wtWs6Yq657QVlR9qngfeGt8HMyA6Jut0HKG5CQBNoi_6e0geHD-vcklnkCIyL8fzbbKPDhk4Xwz5_ydZKA',
  },
  userDisplayNameUpdateTime: 30,
  xApiKey:
    'VZayu2/Xrxuc2WUuJLVQ5NipmFMTqWMGUOteMIG2aGt+JBPdWEo1ZvX9DrSg1xJOkZnUAi2MTE0ig7lsyyqyETsrpWwzcJN1RVJ0bo5ucLMbnL1wfF2X3jfD6RrUt+cUWSsM3s5Bs4nJ6mvGMVzcbqJ2tb5Jb/guhK/wZKB2Tym7NfNcMaBriGqVcXF02ru+PL90WCwJ8sz3Qmk2iHRFBLe9de+88I01dPeQ3X1J3g77Xr1OXm60qkcbguY59DKHseiBqh/wsZiNOO3vgJLyt4SKr6nhc1BxrGde2iPuqPzgDeo3yhuVRtzgGWd/IMGWuQpFsfrdYaB8VXI9QgWBOw==',
  sentryDsn: 'https://2ba68a49d5fd471a99fc1da5e627aca9@sentry.rawinlab.com/29',
  appVersion: '2.4',
};

export default environment;
