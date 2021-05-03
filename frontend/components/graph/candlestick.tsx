import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false})
import {useSelector} from "react-redux";
import store, {RootState} from "../../redux/store";
import {useStore} from "react-redux";
import {useEffect, useLayoutEffect, useState} from "react";
import {TIMESCALE_ENUM} from "../../ts/types";

const timeScaleFormats = {
    "1D": "HH mm",
    "1W": "dd MMM",
    "1M": "dd MMM yy",
    "1Y": "MMM yy"
}

const CandlestickChart = (props) => {
    // Accessing redux store

    const selectedEquity = useSelector((store: RootState) => store.selectedEquity)
    const historicalData = useSelector((store: RootState) => store.historicalData)
    const data = useSelector((store: RootState) => store.data)
    let timescale = useSelector((store: RootState) => store.timescale)

    useEffect(() => {
        // Default timescale === "1D".
        // Initializes chart with intraday data.
    }, [])

    const options = {
        chart: {
            type: 'candlestick',
            height: 350,
            toolbar: {
                show: true,
                tools: {
                    zoomin: timescale !== TIMESCALE_ENUM.DAY,
                    zoomout: timescale !== TIMESCALE_ENUM.DAY,
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
                format: timeScaleFormats[timescale]
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        },
    }

    const series = [{
        name: "data",
        data: data
    }]

    return (
        historicalData !== null && (
            <ReactApexChart options={options} series={series} type="candlestick"
                            height={350} key={[selectedEquity, timescale]}/>)
    )

}

export default CandlestickChart

