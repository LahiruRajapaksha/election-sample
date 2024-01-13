import React, { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  setUserType: (userType: string) => {},
  userType: "",
});

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = (props: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState("");
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        setIsAuthenticated: (value: boolean) => setIsAuthenticated(value),
        userType: userType,
        setUserType: (userType: string) => setUserType(userType),
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
