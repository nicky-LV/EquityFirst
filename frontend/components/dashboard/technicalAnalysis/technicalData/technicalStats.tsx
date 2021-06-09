import StatsRow from "./statsRow";
import Card from "../../cards/card";
import {useQuery} from "react-query";
import {useSelector} from "react-redux";
import {RootState} from "../../../../redux/store";
import GetEquityStats from "../../../../pages/api/getEquityStats";

export default function TechnicalStats() {
    const [equity, technicalIndicator, close] = useSelector((store: RootState) => [store.info.selectedEquity, store.info.technicalIndicator, store.technical.close])
    const query = useQuery('equityStats', () => GetEquityStats(equity))
    return (
        <Card>
            {query.isSuccess &&
            (
                <>
                    <StatsRow pair={
                        [{
                            name: "Close",
                            stat: close},

                            {
                                name: "P/E Ratio",
                                stat: query.data.data.pe_ratio
                            }]} />

                    <StatsRow pair={
                        [{
                            name: technicalIndicator,
                            stat: "Placeholder"
                        },
                            {
                            name: "Volume",
                            stat: query.data.data.volume
                        }
                        ]} />
                </>
            )
            }
        </Card>
    )
}
