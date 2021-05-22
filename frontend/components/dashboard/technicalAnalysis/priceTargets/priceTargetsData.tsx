import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {PriceTargetDataType, Recommendations} from "../../../../ts/types";
import {RecommendationBadge} from "../../../badges/recommendationBadge";
import {useEffect, useState} from "react";
import {CountBadge} from "../../../badges/countBadge";
import PriceTargetsHeader from "./priceTargetsHeader";
import RecommendationData from "./recommendationData";
import ScoreInfo from "./scoreInfo";
import PriceTargetsGrid from "./priceTargetsGrid";

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
            <PriceTargetsHeader noOfAnalysts={4} />
            <div className="border-t border-b border-gray-200 px-4 py-5 sm:px-6 gap-3">
                <div>
                    <dt className="text-sm font-medium text-gray-500 text-center xl:text-left">Recommendations</dt>
                    <dd className="mt-4 text-sm text-gray-900">
                        <div className="grid grid-cols-1 xl:grid-cols-3 xl:divide-y-0 divide-y-2">
                            <RecommendationData priceTargetData={priceTargetData} />
                            <ScoreInfo equity={equity} score={priceTargetData.score} />
                            <PriceTargetsGrid />
                        </div>
                    </dd>
                </div>
            </div>
        </div>
    )
}

