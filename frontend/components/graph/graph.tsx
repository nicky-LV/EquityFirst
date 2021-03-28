import {useEffect} from "react";
import axios from 'axios';

const D3Graph = (props: any) => {
    useEffect(() => {
        axios.get("ws://127.0.0.1:8000/datastream/")
    }, [])
}

export default D3Graph