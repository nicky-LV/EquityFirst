import { Fragment} from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { SET_SELECTED_EQUITY } from '../../redux/constants';
import { RootState } from '../../redux/store';
import { getEquitySymbols } from '../../pages/api/getEquitySymbols';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SelectEquity() {
    const equity = useSelector((store: RootState) => store.selectedEquity)
    const dispatch = useDispatch()
    const response = useQuery("fetchEquity", getEquitySymbols)

    function dispatchEquity(value){
        dispatch({
            type: SET_SELECTED_EQUITY,
            payload: value
        })
    }

    return (
        <Listbox value={equity} onChange={(value) => dispatchEquity(value)}>
            {({ open }) => (
                <>
                    <Listbox.Label className="block text-sm font-medium text-gray-700">Select an equity</Listbox.Label>
                    <div className="mt-1 relative">
                        <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="w-full inline-flex truncate">
                <span className="truncate">{equity}</span>
                <span className="ml-2 truncate text-gray-500">NYSE</span>
              </span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options
                                static
                                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                            >
                                {response.isSuccess && response.data.data.map((equity) => (
                                    <Listbox.Option
                                        key={equity}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                'cursor-default select-none relative py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={equity}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex">
                          <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'truncate')}>
                            {equity}
                          </span>
                                                    <span className={classNames(active ? 'text-indigo-200' : 'text-gray-500', 'ml-2 truncate')}>
                            NYSE
                          </span>
                                                </div>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-indigo-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}
