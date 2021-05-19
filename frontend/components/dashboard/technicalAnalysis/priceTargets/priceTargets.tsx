import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

function borderColorFromRecommendation(recommendation: Recommendations) {
    switch (recommendation) {
        case Recommendations.STRONGBUY:
        case Recommendations.BUY:
            return "text-green-400";

        case Recommendations.HOLD:
            return "text-gray-400";

        case Recommendations.STRONGSELL:
        case Recommendations.SELL:
            return "text-red-400";

        default:
            return "text-gray-400"
    }
}

function combineClassNames(...classNames_) {
    return classNames_.join(" ")
}

export default function PriceTargets(props) {
    const [recommendation, setRecommendation] = useState<Recommendations | null>(Recommendations.STRONGBUY);
    const equityPrice = useSelector((store: RootState) => store.price)
    return (
        <div className="flex flex-row text-center justify-center items-center h-full w-full mt-3">

            <div className="flex-col h-3/4 w-1/3">
                <div className="flex items-center justify-center border border-b p-3 rounded-tl-lg rounded-bl-lg">
                        <p className="text-xl font-bold text-red-400 font-sans">$ Low</p>
                </div>
                <p className="text-xs font-sans text-red-400 font-medium h-1/6 mt-2">Low</p>
            </div>

            <div className="flex-col h-full w-1/3">
                <div className="p-3 h-full flex items-center justify-center border border-gray-600 shadow-lg rounded-md">
                    {recommendation && <div className={combineClassNames(borderColorFromRecommendation(recommendation))}>
                        <p className="text-xl font-bold font-sans text-gray-800">{recommendation}</p>
                    </div>}
                </div>
                <p className="text-xs font-sans text-gray-800 font-medium h-1/6 mt-2">Verdict</p>
            </div>

            <div className="flex-col h-3/4 w-1/3">
                <div className="flex items-center justify-center border p-3 rounded-tr-lg rounded-br-lg">
                        <p className="text-xl font-bold text-green-400 font-sans">$ High</p>
                </div>
                <p className="text-xs font-sans text-green-400 font-medium h-1/6 mt-2">High</p>
            </div>
        </div>
    )
}

export enum Recommendations {
    STRONGBUY = "STRONG BUY",
    BUY = "BUY",
    HOLD = "HOLD",
    SELL = "SELL",
    STRONGSELL = "STRONG SELL"
}