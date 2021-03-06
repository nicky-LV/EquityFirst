import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import useMovingAverageData from "../../../hooks/getMovingAvg";
import {useEffect, useRef} from "react";
import Card from "../cards/card";
import SelectTimerange from '../../interactive/selectTimerange';

export default function GraphCard(props) {
    const equity: string = useSelector((store: RootState) => store.info.selectedEquity)
    const moving_average = useMovingAverageData()

    useEffect(() => {
        console.log(moving_average.data)
    }, [])


    return (
            <Card
                header={<p><span className="font-bold">{equity}</span> Equity Graph</p>}
                headerContent={<SelectTimerange />}
            >
                Graph
            </Card>
    )
}
