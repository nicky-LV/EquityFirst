import {Switch} from "@headlessui/react";
import { useState } from 'react'
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";

export default function TechnicalIndicatorButton(props: TechnicalIndicatorButtonProps){
    const [enabled, setEnabled] = useState(false);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return(
        <div className="border rounded-md shadow-md border-gray-300 bg-white flex-grow w-full p-2">
            <Switch.Group as="div" className="flex items-center justify-between">
                <Switch.Label as="span" className="flex-grow flex flex-col" passive>
                    <span className="text-sm font-medium text-gray-900"><span className="font-bold">{props.name}</span></span>
                    <span className="text-sm text-gray-500">{props.description}</span>
                </Switch.Label>
                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={classNames(
                        enabled ? 'bg-indigo-600' : 'bg-gray-200',
                        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    )}
                >
                    <span className="sr-only">Use setting</span>
                    <span
                        aria-hidden="true"
                        className={classNames(
                            enabled ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white transform ring-0 transition ease-in-out duration-200'
                        )}
                    />
                </Switch>
            </Switch.Group>
        </div>
    )
}

interface TechnicalIndicatorButtonProps{
    name: string | ReactJSXElement,
    description?: string | ReactJSXElement
}