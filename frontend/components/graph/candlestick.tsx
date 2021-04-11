import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false})
import {useSelector} from "react-redux";
import store, {RootState} from "../../redux/store";
import {useStore} from "react-redux";
import {useEffect, useLayoutEffect, useState} from "react";

const timeScaleFormats = {
    "1D": "HH:mm",
    "1W": "dd MMM",
    "1M": "dd MMM yy",
    "1Y": "MMM yy"
}

const CandlestickChart = (props) => {
    const [data, setData] = useState([])
    // Accessing redux store
    const historicalData = useSelector((store: RootState) => store.historicalData)
    const intradayData = useSelector((store: RootState) => store.intradayData)
    const timeScale = useSelector((store: RootState) => store.timeScale)

    // Initializing store for subscribers
    const store = useStore()
    store.subscribe(() => timescaleListener(timeScale))

    useEffect(() => {
        // Default timeScale === "1D".
        // Initializes chart with intraday data.
        parseData(timeScale)
    }, [])

    function timescaleListener(prevTimescale: string) : void {
        const newTimeScale = store.getState().timeScale
        if (newTimeScale !== prevTimescale){
            parseData(newTimeScale)
        }
    }

    function parseData(timeScale: string) : void {
        const dataLength = historicalData.length
        switch (timeScale){
            case "1D":
                // Show intraday data
                setData(intradayData);
                break;

            case "1W":
                // Truncate data to 7 points
                setData(historicalData.slice(dataLength-7, dataLength-1));
                break;

            case "1M":
                // Truncate data to 30 points
                setData(historicalData.slice(dataLength-30, dataLength-1));
                break;

            case "1Y":
                setData(historicalData.slice(dataLength-365, dataLength-1))
        }
    }

    const options = {
        chart: {
            type: 'candlestick',
            height: 350,
            toolbar: {
                show: true,
                tools: {
                    zoomin: timeScale !== "1D",
                    zoomout: timeScale !== "1D",
                    download: true,
                    zoom: false,
                    selection: false,
                    pan: false,
                    reset: false
                }
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                format: timeScaleFormats[timeScale]
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        },
    }

    const series = [{
        data: data
    }]

    return (
        historicalData !== null && (
            <ReactApexChart options={options} series={series} type="candlestick"
                            height={350}/>)
    )

}

export default CandlestickChart

