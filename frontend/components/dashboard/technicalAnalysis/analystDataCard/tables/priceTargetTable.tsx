import {PriceTarget} from "../../../../../ts/types";

export default function PriceTargetTable(props){
    return(
        <div className="flex flex-col border border-gray-200 sm:rounded-lg">
            <div className="-my-2 sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                                >
                                    Labels
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                                >
                                    Price Target
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {props.priceTargets.map((data) => (
                                <tr key={data[0]} className={data[0] === PriceTarget.LOW && "bg-gray-100"}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">{data[0]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">$ <span className="text-indigo-600 font-bold">{data[1]}</span></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

