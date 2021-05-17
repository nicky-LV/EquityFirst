import CardHeader from "./cardHeader";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";

export default function Card(props : CardProps){
    return (
        <div className="bg-white flex flex-col border-b border-gray-200 rounded-md h-full w-full">
            <CardHeader header={props.header}>
                {props.headerContent}
            </CardHeader>

            <div className="px-4 py-4 flex flex-col gap-6">
                {props.children}
            </div>
        </div>
    )
}

interface CardProps{
    header: string | ReactJSXElement
    headerContent?: ReactJSXElement
    children?: ReactJSXElement
}