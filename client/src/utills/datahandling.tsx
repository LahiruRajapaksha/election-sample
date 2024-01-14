import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useCallback } from "react";
import {
  Candidate,
  CandidateList,
} from "../views/VoterDashBoard/VoterDashboard";
import { RegisterUserData } from "../components/RegistrationForm/RegisterForm";
import { createData } from "../components/TableVote";

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

export type CandidateResults = {
  id?: number;
  name: string;
  party: string;
  vote: number;
};

export type ConstituencyResult = {
  constituency: string;
  results: CandidateResults[];
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
    data.seats.length > 0 &&
    data.seats.map((data: { party: string; seats: number }, index: number) => {
      return {
        id: `${index} + ${Math.random()}`,
        value: data.seats,
        label: data.party,
        color:
          data.party === "Independent Party"
            ? "green"
            : data.party?.split(" ")[0].toLowerCase(),
      };
    });
  const winner: string = data?.winner;
  const status: string = data?.status;
  return {
    overAllPartyResults: overAllPartyResults,
    refetch,
    data,
    isAllResultsLoading: isLoading,
    winner,
    status,
  };
};

export const useGetResultsByConstituency = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["getResultsByConstituency"],
    queryFn: getResultsByConstituency,
    refetchInterval: 8000,
  });

  const barChartData =
    data &&
    data.constituencyTotal &&
    Object.entries(data.constituencyTotal).map((data) => {
      const parties = data[1];
      if (typeof parties === "object" && parties !== null) {
        return {
          ...parties,
          constituencyName: data[0],
        };
      }
    });

  const tableData =
    data &&
    data.results.length > 0 &&
    Object.entries(data.results as ConstituencyResult[]).map((data) => {
      return {
        constituency: data[1].constituency,
        results: data[1].results.map((result, index) => {
          return {
            id: index + 1,
            name: result.name,
            party: result.party,
            vote: result.vote,
          };
        }),
      };
    });

  return {
    resultsByConstituency: data,
    refetch,
    isConstituencyResultsLoading: isLoading,
    barChartData,
    tableData,
  };
};
