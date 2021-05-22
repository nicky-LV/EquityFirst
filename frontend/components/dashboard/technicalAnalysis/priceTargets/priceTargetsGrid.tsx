import {CountBadge} from "../../../badges/countBadge";
import {RecommendationBadge} from "../../../badges/recommendationBadge";
import {Recommendations} from "../../../../ts/types";

export default function PriceTargetsGrid(){
    return (
        <div className="grid grid-cols-2 grid-rows-3 gap-3">
            <p className="text-gray-500 text-right mr-2">High</p>
            <CountBadge count={141} />
            <p className="text-gray-500 text-right mr-2">Low</p>
            <CountBadge count={141} />
            <p className="text-gray-500 text-right mr-2">Verdict</p>
            <RecommendationBadge recommendation={Recommendations.BUY} />
        </div>
    )
}
