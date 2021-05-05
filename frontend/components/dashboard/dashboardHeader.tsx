import SelectEquity from "./inputs/selectEquity";
import SelectTimerange from "./inputs/selectTimerange";

export default function DashboardHeader(){
    return(
            <div className="w-100 flex flex-row justify-content-start gap-5 py-4 bg-white shadow-md align-items-center">
                <h2 className="ml-5 text-3xl font-bold text-left leading-7 text-black sm:text-3xl align-self-center sm:truncate">Dashboard</h2>
                <div className="w-25">
                    <SelectEquity />
                </div>
            </div>
    )
}