import axiosInstance from '../axios/axios';
import axios from 'axios';


// Fetch spot rates for the given adminId
export const fetchSpotRates = (adminId) => {
    return axiosInstance.get(`/get-spotrates/${adminId}`);
};

// Fetch server URL
export const fetchServerURL = async () => {
    try {
        const response = await axiosInstance.get('/get-server');
        return response;
    } catch (error) {
        console.error('Error fetching server URL:', error);
    }
};

// Fetch news for the given adminId
export const fetchNews = (adminId) => {
    return axiosInstance.get(`/get-news/${adminId}`);
};

// Fetch TV screen data
export const fetchTVScreenData = (adminId) => {
    return axiosInstance.get('/tv-screen', {
        headers: { 'admin-id': adminId }
    });
};

// Fetch Currency Data
export const fetchCurrencyData = async () => {
    try {
        const response = await axios.get(
            "https://exchangerateapi-ik2w.onrender.com/api/rates/latest"
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Server responded with error:", error.response.status);
        } else if (error.request) {
            console.error("No response received from server:", error.request);
        } else {
            console.error("Request setup error:", error.message);
        }
        return null;
    }
};
