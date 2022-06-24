import axios from 'axios'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'


export default function Token(props) {
    const {each} = props
    const [price, setPrice] = useState(0)
    const navigate = useNavigate()
    useEffect(()=>{
        if(each.id && each.type == 0)
        axios.post(global.backendserver + "/api/getPriceById",{
            payload : {id:each.cmc_id}
        }).then((resp) =>{
            setPrice(resp.data.price)
        })
    })

    return <div key={each.id} className="w-full hover:bg-[#d4d4d4] bg-[#e5e5e5] h-[200px] flex flex-col justify-center items-center cursor-pointer" onClick={() => {
        navigate(`/detailToken/${each.id}`)
    }}>
        <img src={each.logo || "/default.webp"} className="bg-[#e5e5e5] w-[50px] md:w-[100px] 2xl:w-[150px] 2xl:h-[150px] h-[50px] md:h-[100px] rounded-[9999px]"></img>
        <span className="pt-2 font-semibold text-sm md:text-lg 2xl:text-2xl">{each?.name}({each?.symbol})</span>
        <span className="pt-2 font-semibold text-gray-400 text-sm md:text-lg 2xl:text-2xl">{each.type == 0? "$" +price: "NewToken"}</span>
    </div>
}