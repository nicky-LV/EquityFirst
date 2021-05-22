import {PriceTargetDataType} from "../../../../ts/types";

export default function ScoreInfo(props: ScoreInfoProps){
    return (
        <div>
            <p className="text-gray-500 text-center">
                Solely based off analyst predictions,
                <span className="font-bold text-indigo-700"> {props.equity}</span> was given a score of
                <span className="font-bold text-indigo-700"> {props.score.toFixed(2)}.</span>
            </p>
            <br/>
            <p className="text-gray-800 hover:underline text-center">See price correlation</p>

        </div>
    )
}

interface ScoreInfoProps extends Partial<PriceTargetDataType>{
    equity: string
}