import Routes from './route';
import { BrowserRouter } from 'react-router-dom';
import Toastify from './wrapper/Toastify';
import { CombineComponents } from './wrapper/CombineComponents';
import ReduxProvider from './wrapper/ReduxProvider';
import WagmiProvider from './wrapper/WagmiProvider';
import FlowbiteProvider from './wrapper/FlowbiteProvider';
import AccountPortal from './wrapper/AccountPortal';
import ScrollTopPortal from './wrapper/ScrollTopPortal';

import MetamaskPortal from './wrapper/MetamaskPortal';
import LightboxPortal from './wrapper/LightBoxPortal';
import LightboxFilePortal from './wrapper/LightBoxFilePortal.tsx';
import FirebasePortal from './wrapper/FirebasePortal';
import NotificationPortal from './wrapper/NotificationPortal';
import UserEncryptionSchemePortal from './wrapper/UserEncryptionSchemePortal';
import VConsolePortal from './wrapper/VConsolePortal';

const providers = [
  VConsolePortal,
  Toastify,
  ReduxProvider,
  WagmiProvider,
  MetamaskPortal,
  FlowbiteProvider,
  AccountPortal,
  BrowserRouter,
  ScrollTopPortal,
  LightboxPortal,
  LightboxFilePortal,
  FirebasePortal,
  NotificationPortal,
  UserEncryptionSchemePortal,
];
const AppProvider = CombineComponents(...providers);

export default function App() {
  return (
    <AppProvider>
      <Routes />
    </AppProvider>
  );
}
