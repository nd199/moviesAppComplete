import { createContext, useContext } from 'react';

const isLocalHost = () =>
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const EnvContext = createContext({ isDev: isLocalHost() });

export const EnvProvider = ({ children }) => {
  const value = { isDev: isLocalHost() };
  return <EnvContext.Provider value={value}>{children}</EnvContext.Provider>;
};

export const useEnv = () => useContext(EnvContext);
