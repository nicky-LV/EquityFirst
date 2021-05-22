export default function PriceTargetsHeader(props: PTHeaderProps){
    return (
        <div className="flex flex-row flex-wrap justify-between items-center">
            <div className="flex flex-col flex-wrap">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Analyst Price Targets</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Price targets are not definitive and can be subject to bias.</p>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{props.noOfAnalysts} analysts contributed to this price target.</p>
            </div>

            <button
                type="button"
                className="inline-flex items-center px-2 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Learn more
            </button>
        </div>
    )
}

interface PTHeaderProps {
    noOfAnalysts: Number
}