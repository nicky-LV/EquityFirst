import {useQuery} from "react-query";
import {getTechnicalIndicators} from "../../../pages/api/getTechnicalIndicators";
import TechnicalIndicatorButton from "../inputs/technicalIndicatorButton";
import Divider from "../../divider";

export default function TechnicalIndicatorList() {
    const query = useQuery("get-technical-indicators", getTechnicalIndicators)

    return (
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 divide-x">
                    {query.isSuccess && query.data.data.map((technicalIndicator) => (
                            <TechnicalIndicatorButton name={technicalIndicator} description="placeholder"/>
                        )
                    )}
                </div>
    )
}
