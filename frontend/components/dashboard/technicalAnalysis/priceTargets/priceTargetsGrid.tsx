import {CountBadge} from "../../../badges/countBadge";
import {RecommendationBadge} from "../../../badges/recommendationBadge";
import {Recommendations} from "../../../../ts/types";

export default function PriceTargetsGrid(){
    return (
        <div className="grid grid-cols-2 grid-rows-3 gap-3">
            <p className="text-gray-500 text-center">High price target </p>
            <CountBadge count={141} />
            <p className="text-gray-500 text-center">Low price target </p>
            <CountBadge count={141} />
            <p className="text-gray-500 text-center">Recommendation </p>
            <RecommendationBadge recommendation={Recommendations.BUY} />
        </div>
    )
}
