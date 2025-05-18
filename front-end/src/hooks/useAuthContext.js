import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuthContext = () => {
  const { currentUser, setCurrentUser, authToken, setAuthToken, logOut } =
    useContext(AuthContext);

  return {
    currentUser,
    setCurrentUser,
    authToken,
    setAuthToken,
    logOut,
  };
};

export default useAuthContext;
