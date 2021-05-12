import SelectTimerange from "../inputs/selectTimerange";

export default function CardHeader(props){
    return (
        <div className="flex flex-row justify-between items-center py-4 px-4 bg-gray-800 h-20 rounded-t-lg shadow-md w-100">
            <h3 className="text-lg leading-6 font-medium text-white">{props.header}</h3>
            <div>
                {props.children}
            </div>
        </div>
    )
}