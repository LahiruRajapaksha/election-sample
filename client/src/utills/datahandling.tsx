import { useMutation } from "@tanstack/react-query";
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
        console.error(error);
    }
}

export const useRegisterUser = () => {
    const {mutate: register} = useMutation({
        mutationKey: ["registerUser"],
        mutationFn: (data: any) => registerUser(data),
    });
    return {register}
}
