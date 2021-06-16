import {useQuery} from "react-query";
import {getTechnicalIndicators} from "../../../pages/api/getTechnicalIndicators";
import TechnicalIndicatorButton from "../../interactive/technicalIndicatorButton";
import {useDispatch} from "react-redux";
import {SET_TECHNICAL_INDICATOR_LIST} from "../../../redux/constants";

export default function TechnicalIndicatorList() {
    const query = useQuery("get-technical-indicators", getTechnicalIndicators);
    const dispatch = useDispatch();

    if (query.isSuccess){
        let technicalIndicatorList: string[] = []
        for (let i=0; i < query.data.data.length; i++){
            technicalIndicatorList.push(query.data.data[i].name)
        }
        dispatch({
            type: SET_TECHNICAL_INDICATOR_LIST,
            payload: technicalIndicatorList
        })
    }
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
