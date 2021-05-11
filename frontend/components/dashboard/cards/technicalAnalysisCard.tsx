import Card from "./card";
import TechnicalIndicatorList from "../technicalAnalysis/technicalIndicatorList";
import TechnicalStats from "../technicalAnalysis/technicalStats";

export default function TechnicalAnalysisCard(props){
    return (
        <Card header="Technical Analysis">
            <div>
                <TechnicalStats />
                <TechnicalIndicatorList />
            </div>
        </Card>
    )
}