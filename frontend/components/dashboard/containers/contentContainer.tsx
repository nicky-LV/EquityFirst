import GraphCard from "../cards/graphCard";
import Card from "../cards/card";
import TechnicalStatsCard from "../cards/technicalStatsCard";
import TechnicalIndicatorList from "../technicalAnalysis/technicalIndicatorList";
import PriceTargets from "../technicalAnalysis/priceTargets";

export default function DashboardContent(){
    return(
            <div className="inline-flex flex-row gap-5 m-5 h-full">
                <div className="flex flex-col w-full h-auto">
                    <GraphCard />
                        <TechnicalIndicatorList />  
                </div>

                <div className="flex flex-col w-full h-full">
                    <TechnicalStatsCard/>
                </div>
            </div>
    )
}