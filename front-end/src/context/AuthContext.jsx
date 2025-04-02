import { createContext, useEffect, useState } from 'react';
import { getRequest } from '../utils/apiHandler.js';
import { getAuthTokenFromCookie, removeCookie } from '../utils/cookieHandler';

export const AuthContext = createContext({
  currentUser: {},
  setCurrentUser: () => null,
  authToken: '',
  setAuthToken: () => null,
});

export const AuthContextProvider = ({ children }) => {
  const authTokenFromCookie = getAuthTokenFromCookie();

  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(authTokenFromCookie);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!authToken) {
        return;
      }

      setIsLoading(true);

      const res = await getRequest({
        endpoint: '/users/me',
      });

      setIsLoading(false);

      if (res.ok) {
        const _user = res.data;
        setCurrentUser(_user);
        return;
      }

      removeCookie();
      setCurrentUser(null);
    };

    fetchUserInfo();
  }, [authToken]);

  const logOut = () => {
    removeCookie();
    setCurrentUser(null);
    setAuthToken('');
  };

  const value = {
    authToken,
    currentUser,
    isLoading,
    setAuthToken,
    setCurrentUser,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

