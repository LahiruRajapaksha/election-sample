import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";
import { CandidateList } from "../views/VoterDashBoard/VoterDashboard";
import { RegisterUserData } from "../components/RegistrationForm/RegisterForm";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// axios interceptors
const registerUser = async (data: RegisterUserData) => {
  try {
    const response = await axiosClient.post("/gevs/users/register", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      return error;
    }
  }
};

const loginUser = async (data: any) => {
  try {
    const response = await axiosClient.post("/gevs/user/login", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      return error;
    }
  }
};

const getUser = async (data: any) => {
  try {
    const response = await axiosClient.get(`/gevs/users/register`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const updateUser = async (data: any) => {
  try {
    const response = await axiosClient.put(`/gevs/users/register`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getCandidateList = async (constituency: string) => {
  try {
    const response = await axiosClient.get(`/gevs/candidates/${constituency}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      return error;
    }
  }
};

// tanstack/react-query
export const useRegisterUser = () => {
  const {
    mutate: register,
    error,
    isPending,
    data,
  } = useMutation({
    mutationKey: ["registerUser"],
    mutationFn: (data: RegisterUserData) => registerUser(data),
  });
  return { register, error, isPending, data };
};

export const useLoginUser = () => {
  const {
    mutate: login,
    error,
    isSuccess,
    data,
  } = useMutation({
    mutationKey: ["loginUser"],
    mutationFn: (data: any) => loginUser(data),
  });
  return { login, error, isSuccess, data };
};

export const useGetUser = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["getUser"],
    queryFn: getUser,
  });
  return { data, refetch, isLoading };
};

export const useUpdateUser = () => {
  const { mutate: updateUserMutation } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: updateUser,
  });
  return { updateUserMutation };
};

export const useGetCandidateList = (
  constituency: string
): {
  data: CandidateList;
  refetch: () => void;
  isLoading: boolean;
} => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["getCandidateList", { constituency }],
    queryFn: useCallback(() => getCandidateList(constituency), [constituency]),
  });

  return { data, refetch, isLoading };
};


