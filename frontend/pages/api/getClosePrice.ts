import axios from 'axios';
export const getClosePrice = (equity) => {
    return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-close-data/${equity}/`)
}