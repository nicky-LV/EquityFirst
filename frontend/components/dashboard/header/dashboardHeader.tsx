import SelectEquity from "../../interactive/selectEquity";

export default function DashboardHeader(){
    return(
            <div className="w-100 flex flex-row content-start gap-5 py-4 bg-white shadow-md items-center">
                <h2 className="ml-5 text-3xl font-bold text-left leading-7 text-black sm:text-3xl self-center sm:truncate">Dashboard</h2>
                <div className="ml-5 w-1/4">
                    <SelectEquity />
                </div>
            </div>
    )
}