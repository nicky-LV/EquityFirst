import {Switch} from "@headlessui/react";
import { useState } from 'react'
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {useDispatch, useSelector} from "react-redux";
import {SET_TECHNICAL_INDICATOR} from "../../redux/constants";
import {RootState} from "../../redux/store";

export default function TechnicalIndicatorButton(props: TechnicalIndicatorButtonProps){
    const [enabled, setEnabled] = useState(false);
    const technicalIndicator: string[] = useSelector((store: RootState) => store.info.technicalIndicators)
    const dispatch = useDispatch()

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const updateSelectedTechnicalIndicator = () => {
        console.log(technicalIndicator)
        dispatch({
            type: SET_TECHNICAL_INDICATOR,
            payload: props.name
        })
    }

    return(
        <div className="rounded-md bg-gray-800 flex-grow p-2">
            <Switch.Group as="div" className="flex items-center justify-between">
                <Switch.Label as="span" className="flex-grow flex flex-col" passive>
                    <span className="text-sm font-medium text-gray-100"><span className="font-bold">{props.name}</span></span>
                    <span className="text-xs text-gray-300 w-4/5">{props.description}</span>
                </Switch.Label>
                {!props.disabled && <Switch
                    checked={enabled}
                    onChange={updateSelectedTechnicalIndicator}
                    className={classNames(
                        technicalIndicator.includes(props.name) ? 'bg-indigo-600' : 'bg-gray-200',
                        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-indigo-500'
                    )}
                >
                    <span className="sr-only">Use setting</span>
                    <span
                        aria-hidden="true"
                        className={classNames(
                            technicalIndicator.includes(props.name) ? 'translate-x-5' : 'translate-x-0 bg-gray-500',
                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white transform ring-0 transition ease-in-out duration-200'
                        )}
                    />
                </Switch>}

                {props.disabled && <Switch
                    disabled={true}
                    checked={enabled}
                    onChange={updateSelectedTechnicalIndicator}
                    className={classNames(
                        technicalIndicator.includes(props.name) ? 'bg-indigo-600' : 'bg-gray-200',
                        'opacity-30 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-indigo-500'
                    )}
                >
                    <span className="sr-only">Use setting</span>
                    <span
                        aria-hidden="true"
                        className={classNames(
                            technicalIndicator.includes(props.name) ? 'translate-x-5' : 'translate-x-0 bg-gray-500',
                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white transform ring-0 transition ease-in-out duration-200'
                        )}
                    />
                </Switch>}
            </Switch.Group>
        </div>
    )
}

interface TechnicalIndicatorButtonProps{
    name: string | never,
    description?: string | ReactJSXElement,
    disabled: boolean
}