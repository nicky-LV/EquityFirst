import Card from "../cards/card";
import PriceTargetsData from "./priceTargets/priceTargetsData";
import TechnicalStats from "./technicalData/technicalStats";
import MlCard from "./mlModels/mlCard";

export default function TechnicalAnalysisCard(props){
    return (
        <Card header={<span className="font-bold">Technical Analysis</span>} footer={<MlCard />}>
            <TechnicalStats />
            <PriceTargetsData />
        </Card>
    )
}