import axios from "axios";

export const BASE_URL = REACT_APP_API_URL;

const API = axios.create({
  baseURL: BASE_URL
});

export default API;