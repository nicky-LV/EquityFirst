export function CountBadge(props: {count: number}){
    return(
        <span className="text-center text-white font-bold px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-700">
            {props.count}
        </span>
    )
}