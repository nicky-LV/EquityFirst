import {PriceTarget, PriceTargetDataType, Recommendations} from "../../../../ts/types";
import {useEffect, useState} from "react";
import PriceTargetsHeader from "./priceTargetsHeader";
import RecommendationTable from "./tables/recommendationTable";
import PriceTargetTable from "./tables/priceTargetTable";
import Card from "../../cards/card";

export default function AnalystDataCard() {
    const [priceTargetData, setPriceTargetData] = useState<PriceTargetDataType | null>(null);

    useEffect(() => {
        // todo: get recommendations
        setPriceTargetData({
            recommendations: [[Recommendations.BUY, 4], [Recommendations.HOLD, 5], [Recommendations.SELL, 7]],
            priceTargets: [
                [PriceTarget.HIGH, 168],
                [PriceTarget.LOW, 126],
                [PriceTarget.OVERALL, (168+126)/2]
            ],
            noOfAnalysts: 4,
            score: 5
        });
    }, [])

    return (
        <Card>
            {priceTargetData && (
                    <div className="grid grid-cols-1 divide-y px-4 py-5 sm:px-6 gap-4">
                        <PriceTargetsHeader noOfAnalysts={4}/>
                        <div className="grid 2xl:grid-cols-2 pt-8 gap-4 xl:grid-cols-1">
                            <RecommendationTable recommendations={priceTargetData.recommendations}/>
                            <PriceTargetTable priceTargets={priceTargetData.priceTargets}/>
                        </div>
                    </div>)}
        </Card>
    )
}

