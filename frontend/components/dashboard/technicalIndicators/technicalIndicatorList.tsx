import {useQuery} from "react-query";
import {getTechnicalIndicators} from "../../../pages/api/getTechnicalIndicators";
import TechnicalIndicatorButton from "../../interactive/technicalIndicatorButton";

export default function TechnicalIndicatorList() {
    const query = useQuery("get-technical-indicators", getTechnicalIndicators)

    return (
                <div className="grid grid-cols-1 gap-3">
                        <p className="text-gray-200 text-sm text-left">Technical Indicators</p>
                    {query.isSuccess && query.data.data.map(({name, description}) => (
                            <TechnicalIndicatorButton name={name} description={description}/>
                        )
                    )}
                </div>
    )
}
