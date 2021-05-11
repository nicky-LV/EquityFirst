import {useQuery} from "react-query";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {MOVING_AVG, TIMESCALE} from "../ts/types";
import axios, {AxiosPromise} from "axios";

function getMovingAverageData(equity: string, indicator: MOVING_AVG | string, timerange: TIMESCALE, ){
    return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/technical/${equity}/${indicator}/${timerange}/`)
}

export default function useMovingAverageData() : ReturnType<typeof useQuery>{
    const equity: string = useSelector((store: RootState) => store.selectedEquity);
    const indicator: MOVING_AVG | any = useSelector((store: RootState) => store.technicalIndicator);
    const timescale: TIMESCALE = useSelector((store: RootState) => store.timescale);

    return useQuery(indicator,
        () => getMovingAverageData(equity, indicator, timescale),
        {enabled: Object.values(MOVING_AVG).includes(indicator)})
}