import GraphCard from "../cards/graphCard";
import TechnicalAnalysisCard from "../cards/technicalAnalysisCard";

export default function DashboardContent(){
    return(
        <div className="m-5">
            <div className="flex flex-row justify-content-between gap-5">
                <GraphCard />
                <TechnicalAnalysisCard/>
            </div>

        </div>
    )
}