import GraphCard from "../graph/graphCard";
import TechnicalAnalysisCard from "../technicalAnalysis/technicalAnalysisCard";
import TechnicalIndicatorList from "../technicalIndicators/technicalIndicatorList";

export default function DashboardContent(){
    return(
        <div className="inline-flex flex-row m-5 gap-8 h-full">
            <div className="grid grid-cols-1 grid-rows-1 w-full gap-8 h-auto">
                <div className="h-full">
                    <GraphCard />
                </div>

                <TechnicalIndicatorList />

            </div>

            <div className="flex flex-col w-full h-full">
                <TechnicalAnalysisCard/>
            </div>
        </div>
    )
}