import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3333/api"
})

export class userService{
    listAll(){
        return axiosInstance.get("/user");
    }
}