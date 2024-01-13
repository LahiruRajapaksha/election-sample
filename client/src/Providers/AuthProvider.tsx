import React, { createContext, useState } from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

export type UserData = {
  email: string;
  userType: string;
  constituency?: string;
  dateOfBirth?: string;
  name?: string;
  isVoted?: boolean;
  isAuthenticated?: boolean;
};

type initialUserData = {
  userData: UserData;
  loginSuccess: (userDetails: UserData) => void;
  logoutSucess: () => void;
};

const initialUserData: initialUserData = {
  userData: {
    email: "",
    userType: "",
    constituency: "",
    dateOfBirth: "",
    name: "",
    isVoted: false,
    isAuthenticated: false,
  },
  loginSuccess: () => {},
  logoutSucess: () => {},
};
export const AuthContext = createContext(initialUserData);

const AuthProvider = (props: AuthProviderProps) => {
  const [userDetails, setUserDetails] = useState<UserData>({} as UserData);

  const loginSuccess = (userDetails: UserData) => {
    setUserDetails({ ...userDetails });
  };
  const logoutSucess = () => {
    setUserDetails({} as UserData);
  };

  return (
    <AuthContext.Provider
      value={{
        userData: userDetails,
        loginSuccess,
        logoutSucess,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
