import axios from 'axios';
export default function GetEquityStats(equity){
    return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stats/${equity}/`)
}