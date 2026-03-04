import axios from "axios";

/**
 * Axios client for calling backend APIs.
 * baseURL points to local server during development.
 */
export const api = axios.create({
  baseURL: "http://localhost:5050",
});