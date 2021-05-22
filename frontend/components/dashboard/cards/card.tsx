import CardHeader from "./cardHeader";
import {ReactNode} from "react";

export default function Card(props : CardProps){
    return (
        <div className="bg-white flex flex-col justify-between border-b border-gray-200 rounded-lg h-full w-full">
            <CardHeader header={props.header}>
                {props.headerContent}
            </CardHeader>

            <div className="px-4 flex flex-col gap-12">
                {props.children}
            </div>
                {props.footer}
        </div>
    )
}

interface CardProps{
    header: string | ReactNode,
    headerContent?: ReactNode,
    children?: ReactNode,
    footer?: ReactNode
}