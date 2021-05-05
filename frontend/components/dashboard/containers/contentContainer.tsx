import Card from "../cards/graphCard";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import GraphCard from "../cards/graphCard";

export default function DashboardContent(){
    return(
        <div className="m-5">
            <div className="flex flex-row justify-content-between">
                <GraphCard />

                <div className="w-100 h-25">

                </div>
            </div>

        </div>
    )
}