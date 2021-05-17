import GraphCard from "../graph/graphCard";
import TechnicalAnalysisCard from "../technicalAnalysis/technicalAnalysisCard";
import TechnicalIndicatorList from "../technicalIndicators/technicalIndicatorList";

export default function DashboardContent(){
    return(
            <div className="inline-flex flex-row gap-5 m-5 h-full">
                <div className="flex flex-col w-full h-auto">
                        <GraphCard />
                        <TechnicalIndicatorList />  
                </div>

                <div className="flex flex-col w-full h-full">
                    <TechnicalAnalysisCard/>
                </div>
            </div>
    )
}