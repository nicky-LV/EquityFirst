import {CountBadge} from "../../../badges/countBadge";
import {RecommendationBadge} from "../../../badges/recommendationBadge";
import {PriceTargetDataType} from "../../../../ts/types";

export default function RecommendationData(props: RecommendationDataProps){
    return (
        <div className="grid grid-cols-2 grid-rows-3 gap-3 w-3/4">
            {props.priceTargetData.priceTargetData.map((key) => (
                <>
                    <CountBadge count={key[1]} />
                    <RecommendationBadge recommendation={key[0]}/>
                </>
            ))}
        </div>
    )
}

interface RecommendationDataProps {
    priceTargetData: PriceTargetDataType
}