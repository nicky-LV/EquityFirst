import Card from "./card";
import TechnicalIndicatorList from "../technicalAnalysis/technicalIndicatorList";
import TechnicalStats from "../technicalAnalysis/technicalStats";

export default function TechnicalStatsCard(props){
    return (
        <Card header={<span className="font-bold">Technical Analysis</span>}>
            <div>
                <TechnicalStats />
            </div>
        </Card>
    )
}