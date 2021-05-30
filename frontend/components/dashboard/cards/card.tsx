import CardHeader from "./cardHeader";
import {ReactNode} from "react";

export default function Card(props : CardProps){
    return (
        <div className="bg-white flex flex-col overflow-hidden border-gray-200 shadow-md rounded-lg w-full">
            {props.header && (
                <CardHeader header={props.header}>
                    {props.headerContent}
                </CardHeader>
            )}

            <div className="px-4 flex flex-col justify-center gap-12">
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