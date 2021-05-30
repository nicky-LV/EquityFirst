import axios from "axios";

// Queries (for usage w/ React Query) must be a promise which either rejects or resolves.
export const getTechnicalIndicators = () => {
    return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-technical-indicators/`)
}