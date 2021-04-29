import axios from 'axios';
export const getEquitySymbols = () => {
    return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-tickers/`)
}