import {useQuery} from "react-query";
import {getTechnicalIndicators} from "../../../pages/api/getTechnicalIndicators";
import TechnicalIndicatorButton from "../../interactive/technicalIndicatorButton";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

export default function TechnicalIndicatorList() {
    const query = useQuery("get-technical-indicators", getTechnicalIndicators);
    const allowedTechnicalIndicators: string[] = useSelector((store: RootState) => store.info.allowedTechnicalIndicators)

    return (
        <div className="grid grid-cols-1 gap-3">
            <p className="text-gray-200 text-sm text-left">Technical Indicators</p>
            {query.isSuccess && query.data.data.map(({name, description}) => (
                    <TechnicalIndicatorButton name={name} description={description} disabled={!(allowedTechnicalIndicators.includes(name))}/>
                )
            )}
        </div>
    )
}
