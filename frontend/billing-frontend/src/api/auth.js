import axios from "axios";

// Backend Base URL
const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

// Register User
export const registerUser = (userData) => {
    return API.post("/auth/register", userData);
};

// Login User
export const loginUser = (credentials) => {
    return API.post("/auth/login", credentials);
};