import GraphCard from "../graph/graphCard";
import TechnicalIndicatorList from "../technicalIndicators/technicalIndicatorList";
import AnalystDataCard from "../technicalAnalysis/analystDataCard/analystDataCard";
import MlCard from "../technicalAnalysis/mlModels/mlCard";
import TechnicalStats from "../technicalAnalysis/technicalData/technicalStats";

export default function DashboardContent(){
    return(
        <div className="grid grid-cols-2 m-5 gap-8 h-full">
            <div className="grid grid-cols-1 grid-rows-1 w-full gap-8 h-auto">
                <GraphCard />
                <TechnicalIndicatorList />
            </div>

            <div className="flex flex-col h-full gap-5">
                <div className="h-3/4">
                    <div className="flex flex-col h-full gap-8">
                        <TechnicalStats/>

                        <AnalystDataCard />
                    </div>
                </div>
                <div className="h-full flex flex-col justify-end justify-self-end">
                    <MlCard />
                </div>
            </div>
        </div>
    )
}