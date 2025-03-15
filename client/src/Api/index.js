import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

// Login API
export const loginUser = (userData) => API.post("/auth/login", userData);

// Register API
export const registerUser = ({username, email, password}) => API.post("/auth/signup", {username, email, password});
