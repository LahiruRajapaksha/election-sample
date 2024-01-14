import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";
import {
  Candidate,
  CandidateList,
} from "../views/VoterDashBoard/VoterDashboard";
import { RegisterUserData } from "../components/RegistrationForm/RegisterForm";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

type DistrictVoteData = {
  name: string;
  party: string;
  votes: number;
};

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

const updateUser = async (data: any) => {
  try {
    const response = await axiosClient.put(`/gevs/users/register`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      return error;
    }
  }
};

const getCandidateList = async (constituency: string) => {
  try {
    const response = await axiosClient.get(
      `/gevs/constituency/${constituency}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      return error;
    }
  }
};

const getOverAllPartyElectionResults = async () => {
  try {
    const response = await axiosClient.get(`/gevs/results`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      return error;
    }
  }
};

const getResultsByConstituency = async () => {
  try {
    const response = await axiosClient.get(`/gevs/electoral/results`);
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

  let candidates: Candidate[] = [];
  let parties: string[] = [];
  console.log("data", data.results);
  candidates = data.results?.map((data: DistrictVoteData) => {
    parties.push(data.party);
    return {
      name: data.name,
      party: data.party,
    };
  });
  parties = [...new Set(parties)];
  return { data: { candidates, parties }, refetch, isLoading };
};

export const useGetOverAllPartyElectionResults = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["getOverAllPartyElectionResults"],
    queryFn: getOverAllPartyElectionResults,
    refetchInterval: 5000,
  });
  const overAllPartyResults =
    data &&
    data?.results?.map((index: number, result) => {
      return {
        id: index + 1,
        value: result.seat,
        label: result.party,
        color: result.party.split("")[0].toLowerCase(),
      };
    });
  const winner = data?.winner;
  const status = data?.status;
  return {
    overAllPartyResults: overAllPartyResults,
    refetch,
    isAllResults: isLoading,
    winner,
    status,
  };
};

export const useGetResultsByConstituency = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["getResultsByConstituency"],
    queryFn: getResultsByConstituency,
    // refetchInterval: 5000,
  });
  return {
    resultsByConstituency: data,
    refetch,
    isConstituencyResults: isLoading,
  };
};
