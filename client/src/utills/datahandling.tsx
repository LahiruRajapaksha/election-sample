import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
})

const registerUser = async (data: any) => {
    try {
        const response = await axiosClient.post("/api/users/register", data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }else{
            return error  }

    }
}

const loginUser = async (data: any) => {
    try {
        const response = await axiosClient.post("/api/user/login", data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }else{
            return error  }

    }
}
export const useRegisterUser = () => {
    const {mutate: register, error, isSuccess, data, status} = useMutation({
        mutationKey: ["registerUser"],
        mutationFn: (data: any) => registerUser(data),
    });
    return {register, error, isSuccess, data}
}

export const useLoginUser = () => {
    const {mutate: login, error, isSuccess, data, status} = useMutation({
        mutationKey: ["loginUser"],
        mutationFn: (data: any) => loginUser(data),
    });

    console.log('Data: ', data)
    return {login, error, isSuccess, data}
}

const getUser = async (data: any) => {
    try {
        const response = await axiosClient.get(`/api/users/register`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const useGetUser = () => {
    const { data, refetch, isLoading } = useQuery({
        queryKey: ['getUser'],
        queryFn: getUser,
    });
    return { data, refetch, isLoading};
}

const updateUser = async ( data: any ) => {
    try {
        const response = await axiosClient.put(`/api/users/register`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const useUpdateUser = () => {
    const { mutate: updateUserMutation} = useMutation({
        mutationKey: ['updateUser'],
        mutationFn: updateUser,
    });
    return { updateUserMutation };
}
