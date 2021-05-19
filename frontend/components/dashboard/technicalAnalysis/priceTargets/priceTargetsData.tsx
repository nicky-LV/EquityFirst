import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import PriceTargets from './priceTargets';
import RecommendationBadge from '../../../badges/recommendationBadge';
import { Recommendations } from './priceTargets';
import {useEffect, useReducer, useRef, useState} from "react";
import {CountBadge} from "../../../badges/countBadge";

export default function PriceTargetsData() {
    const equity = useSelector((store: RootState) => store.selectedEquity);
    const [priceTargetData, setPriceTargetData] = useState<priceTargetDataType | null>(null);

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
            <div className="flex flex-row flex-wrap justify-between items-center px-4 py-5 sm:px-6 gap-4">
                <div className="flex flex-col flex-wrap">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Analyst Price Targets</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Price targets are not definitive and can be subject to bias.</p>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{priceTargetData.noOfAnalysts} analysts contributed to this price target.</p>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center px-2 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Learn more
                </button>
            </div>
            <div className="border-t border-b border-gray-200 px-4 py-5 sm:px-6 gap-3">
                <div>
                    <dt className="text-sm font-medium text-gray-500 text-center xl:text-left">Recommendations</dt>
                    <dd className="mt-4 text-sm text-gray-900">
                        <div className="grid grid-cols-1 xl:grid-cols-3 xl:divide-y-0 divide-y-2">
                            <div className="flex flex-col gap-3 flex-wrap justify-center items-center xl:items-start w-full">
                                {priceTargetData.priceTargetData.map((key) => (
                                    <div className="flex flex-row items-center justify-center gap-3 w-1/2">
                                        <CountBadge count={key[1]} />
                                        <RecommendationBadge recommendation={key[0]}/>
                                    </div>
                                ))}
                            </div>
                            <div className="px-6 py-3 xl:py-0">
                                <p className="text-gray-500 text-center">
                                    Solely based off analyst predictions,
                                    <span className="font-bold text-indigo-700"> {equity}</span> was given a score of
                                    <span className="font-bold text-indigo-700"> {priceTargetData.score.toFixed(2)}.</span>
                                </p>
                                <br/>
                                <p className="text-gray-800 hover:underline text-center">See price correlation</p>

                            </div>

                            <div className="flex flex-col items-center xl:items-end justify-start gap-3 p-3 xl:p-0">
                                <div className="flex flex-row gap-3">
                                    <p className="text-gray-500">High price target </p>
                                    <CountBadge count={141} />
                                </div>
                                <div className="flex flex-row gap-3">
                                    <p className="text-gray-500">Low price target </p>
                                    <CountBadge count={141} />
                                </div>
                            </div>
                        </div>
                    </dd>
                </div>
            </div>

            <PriceTargets />
        </div>
    )
}

interface priceTargetDataType {
    priceTargetData: [[Recommendations.BUY, number], [Recommendations.HOLD, number], [Recommendations.SELL, number]]
    noOfAnalysts: number,
    score: number
}