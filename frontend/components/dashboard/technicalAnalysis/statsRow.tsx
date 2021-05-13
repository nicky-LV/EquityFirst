import {ArrowSmDownIcon, ArrowSmUpIcon} from "@heroicons/react/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function StatsRow(props){
    return(
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-x-0 lg:divide-x w-100">
            {props.pair.map(item => (
                <div key={item.name} className="px-4 py-5 sm:p-6 w-full">
                <dt className="text-base font-normal text-gray-900">{item.name}</dt>
                <div className="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                        {item.stat}
                        <span className="ml-2 text-sm font-medium hidden md:block text-gray-500">from {item.previousStat}</span>
                    </div>

                    <div
                        className={classNames(
                            item.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                            'inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0'
                        )}
                    >
                        {item.changeType === 'increase' ? (
                            <ArrowSmUpIcon
                                className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500"
                                aria-hidden="true"
                            />
                        ) : (
                            <ArrowSmDownIcon
                                className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500"
                                aria-hidden="true"
                            />
                        )}

                        <span className="sr-only">{item.changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                        {item.change}
                    </div>
                </div>
            </div>
            ))}
        </div>
    )
}