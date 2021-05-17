import Card from "../cards/card";
import PriceTargetsData from "./priceTargets/priceTargetsData";
import TechnicalStats from "./technicalData/technicalStats";

export default function TechnicalAnalysisCard(props){
    return (
        <Card header={<span className="font-bold">Technical Analysis</span>}>
                <TechnicalStats />
                <PriceTargetsData />
        </Card>
    )
}