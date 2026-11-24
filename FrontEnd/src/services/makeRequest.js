import axios from "axios";
const api = axios.create({
    basURL: import.meta.env.REACT_APP_API_URL,
    withCredentials: true,
});

export function makeRequest(url, options) {
    return axios(url, options)
    .then (response => response.data)
    .catch(error => 
            Promise.reject(error?.response?.data?.message ??
                "Error"));
}