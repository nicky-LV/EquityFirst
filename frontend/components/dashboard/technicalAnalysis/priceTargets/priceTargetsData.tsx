import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import PriceTargets from './priceTargets';

export default function PriceTargetsData() {
    const equity = useSelector((store: RootState) => store.selectedEquity)
    const noOfBuy = 4;
    const noOfSell = 4;
    const noOfHold = 4;
    const recommendation = Recommendation.BUY
    const noOfAnalysts = 4;
    const score = 1.32;
    return (
        <div>
            <div className="flex flex-row flex-wrap justify-between items-center px-4 py-5 sm:px-6 gap-4">
                <div className="flex flex-col flex-wrap">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Analyst Price Targets</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Price targets are not definitive and can be subject to bias.</p>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{noOfAnalysts} analysts gave {equity} an overall score of {score}.</p>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center px-2 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Learn more
                </button>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="flex flex-row items-center gap-3">
                    <div className="w-2/3">
                        <dt className="text-sm font-medium text-gray-500">Recommendations</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            These recommendations come from the number of BUY, SELL or HOLD signals from analysts.
                            {equity} received {noOfBuy} BUY signals, {noOfSell} SELL signals and {noOfHold} HOLD signals giving it a score of {score}.
                            Giving {equity} the recommendation: {recommendation}
                        </dd>
                    </div>
                    <PriceTargets />

                </dl>
            </div>
        </div>
    )
}

enum Recommendation {
    STRONGBUY = "STRONG BUY",
    BUY = "BUY",
    HOLD = "HOLD",
    SELL = "SELL",
    STRONGSELL = "STRONG SELL"
}
