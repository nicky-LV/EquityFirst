import GraphCard from "../cards/graphCard";
import Card from "../cards/card";
import TechnicalStatsCard from "../cards/technicalStatsCard";
import TechnicalIndicatorList from "../technicalAnalysis/technicalIndicatorList";

export default function DashboardContent(){
    return(
        <div className="m-5">
            <div className="grid grid-cols-2 gap-5">
                <GraphCard />
                <TechnicalStatsCard/>
                <Card header="placeholder"><div></div></Card>
                <TechnicalIndicatorList />
            </div>

        </div>
    )
}