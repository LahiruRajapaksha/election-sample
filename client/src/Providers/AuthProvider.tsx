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
  electionStatus?: string;
};

type initialUserData = {
  userData: UserData;
  loginSuccess: (userDetails: UserData) => void;
  logoutSuccess: () => void;
  onVoteSuccess: () => void;
  updateElectionStatus?: (status: string) => void;
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
    electionStatus: "",
  },
  loginSuccess: () => {},
  logoutSuccess: () => {},
  onVoteSuccess: () => {},
  updateElectionStatus: () => {},
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
  }, []);

  const loginSuccess = (userDetails: UserData) => {
    setUserDetails({ ...userDetails });
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  };

  const logoutSuccess = () => {
    setUserDetails({} as UserData);
    localStorage.removeItem("userDetails");
  };

  const updateElectionStatus = (status: string) => {
    setUserDetails((userDetails) => ({
      ...userDetails,
      electionStatus: status,
    }));
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  };

  const onVoteSuccess = () => {
    setUserDetails((userDetails) => ({
      ...userDetails,
      isVoted: true,
    }));
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  };

  return (
    <AuthContext.Provider
      value={{
        userData: userDetails,
        loginSuccess,
        logoutSuccess,
        onVoteSuccess,
        updateElectionStatus,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
