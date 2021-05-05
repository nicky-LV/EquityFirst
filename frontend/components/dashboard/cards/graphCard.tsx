import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import SelectTimerange from "../inputs/selectTimerange";

export default function GraphCard(props) {
    const equity : string = useSelector((store: RootState) => store.selectedEquity)
    return (
        <div className="bg-white flex flex-column border-b border-gray-200 rounded-md w-100">
            <div className="align-self-start flex flex-row justify-content-between align-items-center py-4 px-4 bg-gray-800 rounded-md w-100">
                <h3 className="text-lg leading-6 font-medium text-white"><span className="font-bold">{equity}</span> Equity Graph</h3>
                <SelectTimerange />
            </div>
        </div>
    )
}
