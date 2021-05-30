import {Recommendations} from "../../ts/types";

export function RecommendationBadge(props: BadgeProps){
    return(
        <span className="text-center text-white font-bold px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-700">
            {props.recommendation}
        </span>
    )
}
interface BadgeProps {
    recommendation: Recommendations.BUY | Recommendations.HOLD | Recommendations.SELL
}