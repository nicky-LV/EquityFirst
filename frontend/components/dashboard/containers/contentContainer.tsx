import GraphCard from "../graph/graphCard";
import AnalystDataCard from "../technicalAnalysis/analystDataCard/analystDataCard";
import MlCard from "../technicalAnalysis/mlModels/mlCard";
import TechnicalStats from "../technicalAnalysis/technicalData/technicalStats";

export default function DashboardContent(){
    return(
        <div className="grid grid-cols-2 m-5 gap-8 h-full">
            <div className="grid grid-cols-1 grid-rows-1 w-full gap-8 h-auto">
                <GraphCard />
            </div>

            <div className="flex flex-col gap-8">
                <div className="flex-grow-0">
                        <TechnicalStats/>
                </div>

                        <div className="flex-grow">
                            <AnalystDataCard />
                        </div>
                    <MlCard />
            </div>
        </div>
    )
}