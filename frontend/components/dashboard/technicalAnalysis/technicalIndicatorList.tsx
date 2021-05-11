import {useQuery} from "react-query";
import {getTechnicalIndicators} from "../../../pages/api/getTechnicalIndicators";
import TechnicalIndicatorButton from "../inputs/technicalIndicatorButton";
import Divider from "../../divider";

export default function TechnicalIndicatorList() {
    const query = useQuery("get-technical-indicators", getTechnicalIndicators)

    return (
        <div className="flex flex-column">
            <div className="w-100 justify-content-center">
                <Divider text="Technical Indicators" />
                <div className="flex flex-row flex-wrap gap-3">
                    {query.isSuccess && query.data.data.map((technicalIndicator) => (
                            <TechnicalIndicatorButton name={technicalIndicator} description="placeholder"/>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
