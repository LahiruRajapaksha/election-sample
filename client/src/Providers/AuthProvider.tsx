import React, { createContext, useLayoutEffect, useState } from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

export type UserData = {
  email: string;
  userType: string;
  constituency?: string;
  dateOfBirth?: string;
  fullName?: string;
  isVoted?: boolean;
  isAuthenticated?: boolean;
};

type initialUserData = {
  userData: UserData;
  loginSuccess: (userDetails: UserData) => void;
  logoutSuccess: () => void;
};

const initialUserData: initialUserData = {
  userData: {
    email: "",
    userType: "",
    constituency: "",
    dateOfBirth: "",
    fullName: "",
    isVoted: false,
    isAuthenticated: false,
  },
  loginSuccess: () => {},
  logoutSuccess: () => {},
};
export const AuthContext = createContext(initialUserData);

const AuthProvider = (props: AuthProviderProps) => {
  const [userDetails, setUserDetails] = useState<UserData>({} as UserData);

  useLayoutEffect(() => {
    // Load user details from localStorage on component mount
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }
    // // Cleanup localStorage when the window is closed
    // const handleWindowClose = () => {
    //   localStorage.removeItem("userDetails");
    // };

    // window.addEventListener("beforeunload", handleWindowClose);

    // return () => {
    //   window.removeEventListener("beforeunload", handleWindowClose);
    // };
  }, []);

  const loginSuccess = (userDetails: UserData) => {
    setUserDetails({ ...userDetails });
    console.log("UserDetails: ", userDetails);
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  };

  const logoutSuccess = () => {
    setUserDetails({} as UserData);
    localStorage.removeItem("userDetails");
  };

  return (
    <AuthContext.Provider
      value={{
        userData: userDetails,
        loginSuccess,
        logoutSuccess,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
