import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {PriceTargetDataType, Recommendations} from "../../../../ts/types";
import {useEffect, useState} from "react";
import PriceTargetsHeader from "./priceTargetsHeader";
import RecommendationData from "./recommendationData";
import ScoreInfo from "./scoreInfo";
import PriceTargetsGrid from "./priceTargetsGrid";
import Divider from "../../../divider";

export default function PriceTargetsData() {
    const equity = useSelector((store: RootState) => store.selectedEquity);
    const [priceTargetData, setPriceTargetData] = useState<PriceTargetDataType | null>(null);

    useEffect(() => {
        // get priceTargetData
        setPriceTargetData({
            priceTargetData: [[Recommendations.BUY, 4], [Recommendations.HOLD, 5], [Recommendations.SELL, 7]],
            noOfAnalysts: 4,
            score: 5
        });
    }, [])

    return (
        priceTargetData &&
        <div>
            <div className="grid grid-cols-1 border rounded-lg px-4 py-5 sm:px-6 gap-4">
                <PriceTargetsHeader noOfAnalysts={4} />
                <Divider text="Recommendations" />
                <div className="grid grid-cols-1 xl:grid-cols-3">
                    <RecommendationData priceTargetData={priceTargetData} />
                    <ScoreInfo equity={equity} score={priceTargetData.score} />
                    <PriceTargetsGrid />
                </div>
            </div>
        </div>
    )
}

