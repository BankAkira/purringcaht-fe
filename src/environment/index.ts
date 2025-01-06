import devEnv from './development';
import prodEnv from './production';
import trydevEnv from './trydev';

const mode = import.meta.env.MODE;

let environment = devEnv;
if (mode === 'production') environment = prodEnv;
if (mode === 'trydev') environment = trydevEnv;

export default environment;
