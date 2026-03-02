import axios from "axios";

export const API = axios.create({
  baseURL: "https://smart-agriculture-backend-wsh4.onrender.com",
});