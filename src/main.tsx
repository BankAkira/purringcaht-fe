import './helper/sentry-instrument';
import './asset/css/tailwind.scss';
import './asset/css/style.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-18-image-lightbox/style.css';
import 'react-modern-drawer/dist/index.css';

import ReactDOM from 'react-dom/client';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
