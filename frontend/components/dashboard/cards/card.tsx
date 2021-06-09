import CardHeader from "./cardHeader";
import {ReactNode} from "react";

export default function Card(props : CardProps){
    return (
        <div className="bg-white flex flex-col overflow-hidden border border-gray-200 shadow-sm rounded-lg w-full h-full">
            {props.header && (
                <CardHeader header={props.header}>
                    {props.headerContent}
                </CardHeader>
            )}

            <div className="flex flex-col justify-center gap-12 h-full px-4">
                {props.children}
            </div>


            {props.footer}
        </div>
    )
}

interface CardProps{
    header?: string | ReactNode,
    headerContent?: ReactNode,
    children?: ReactNode,
    footer?: ReactNode
}