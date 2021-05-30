import {useDispatch, useSelector} from "react-redux";
import { SET_TIMESCALE } from "../../redux/constants";
import { RootState } from "../../redux/store";
import { TIMESCALE } from '../../ts/types';

export default function SelectTimerange() {
    const timescale = useSelector((store: RootState) => store.timescale)
    const dispatch = useDispatch()

    function updateTimescale(e){
        dispatch({
            type: SET_TIMESCALE,
            payload: e.target.value
        })
    }

    return (
        <span className="relative z-0 inline-flex shadow-sm rounded-md">
      <button
          onClick={(e) => updateTimescale(e)}
          value={TIMESCALE.DAY}
          type="button"
          className="relative inline-flex items-center px-4 py-2 rounded-l-md border text-sm text-white font-medium focus:bg-gray-900 hover:bg-gray-900 focus:z-10 focus:outline-none"
      >
        {TIMESCALE.DAY}
      </button>
      <button
          onClick={(e) => updateTimescale(e)}
          value={TIMESCALE.MONTH}
          type="button"
          className="-ml-px relative inline-flex items-center px-4 py-2 border text-sm text-white font-medium focus:bg-gray-900 hover:bg-gray-900 focus:z-10 focus:outline-none"
      >
          {TIMESCALE.MONTH}
      </button>
            <button
                onClick={(e) => updateTimescale(e)}
                value={TIMESCALE.SIX_MONTHS}
                type="button"
                className="-ml-px relative inline-flex items-center px-4 py-2 border text-sm text-white font-medium focus:bg-gray-900 hover:bg-gray-900 focus:z-10 focus:outline-none"
            >
          {TIMESCALE.SIX_MONTHS}
      </button>
      <button
          onClick={(e) => updateTimescale(e)}
          value={TIMESCALE.YEAR}
          type="button"
          className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border text-sm font-medium text-white focus:bg-gray-900 hover:bg-gray-900 focus:z-10 focus:outline-none"
      >
          {TIMESCALE.YEAR}
      </button>
    </span>
    )
}
