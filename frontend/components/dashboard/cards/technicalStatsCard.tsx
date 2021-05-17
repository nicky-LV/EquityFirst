import Card from "./card";
import TechnicalStats from "../technicalAnalysis/technicalStats";
import PriceTargetsData from "../technicalAnalysis/priceTargetsData";

export default function TechnicalStatsCard(props){
    return (
        <Card header={<span className="font-bold">Technical Analysis</span>}>
                <TechnicalStats />
                <PriceTargetsData />
        </Card>
    )
}