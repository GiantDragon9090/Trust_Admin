import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState, useEffect } from 'react'
import axios from "axios"
import { notification, Select } from "antd"
import AddNewToken from "./AddNewToken"

export default function EditToken() {
    const [tokenData, setData] = useState({symbol: '', slug: '', address: ''})
    const [realData, setRealData] = useState(null)
    const logined = useSelector((state) => state.log_reducer.logined)
    const [isLoading, setLoading] = useState(false)
    const [type, setType] = useState(0)

    const navigate = useNavigate()
    useEffect(() => {
        if (!logined) navigate("/")
    }, [logined])

    const confirm = async () => {
        setLoading(true)
        setRealData(null)
        const {data} = await axios.post(global.backendserver + "/api/getURLData", {
            payload: tokenData
            })
        setLoading(false)
        const resData = data
        if(!resData){
            notification.info({
                message: "Message"
                ,description:"There is no token like that, please try again.."
            })
            setRealData(null)
        }else{
            setRealData(resData)
        }
    }

    const onSave = () =>{
        const {id, name, symbol, slug, logo, description} = realData
        axios.post(global.backendserver + '/api/saveToken', {payload:{"cmc_id":id, name, symbol, slug, address:realData.contract_address[0]?.contract_address, platform:realData.contract_address[0]?.platform?.name, logo, description}}).then((resp) => {
            if(resp.data == 'exist'){
                notification.info({
                    message : "Info",
                    description : "The token was already imported!!"
                })  
                return  
            }
            notification.success({
                message : "Success",
                description : "Save Success!!"
            })
            navigate(`/detailToken/${resp.data.insertId}`)
        })
    }

    return (
        <div className="p-4 md:w-[calc(100vw-330px)] w-[calc(100vw-280px)] 2xl:w-[calc(100vw-430px)]  bg-white h-full flex flex-col">
            <div className="w-full flex flex-row text-base md:text-xl 2xl:text-3xl items-center">
                <h4 className="font-bold p-4 w-full flex text-xl md:text-3xl 2xl:text-5xl justify-start">Add Token </h4>
                <Select defaultValue={0} onChange={(va)=>{
                    setType(va)
                }}>
                    <Select.Option value = {1}>New Token</Select.Option>
                    <Select.Option value = {0}>CMC Token</Select.Option>
                </Select>
            </div>
            {type == 0&&<>
            <form className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 p-4 text-base md:text-xl 2xl:text-3xl items-center">
                <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                    <h5 className=" font-bold ">Token Name *</h5>
                    <input required type="text" value = {tokenData?.slug} onChange={
                        (e) => {
                            setData({ slug: e.target.value, symbol:'', address:'' })
                        }
                    } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter Token Name"></input>
                </div>
                <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                    <h5 className=" font-bold ">Token Symbol *</h5>
                    <input required type="text"  value = {tokenData?.symbol} onChange={
                        (e) => {
                            setData({ symbol: e.target.value, slug: '', address: '' })
                        }
                    } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter Token Symbol"></input>
                </div>
                <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                    <h5 className=" font-bold ">Address *</h5>
                    <input required type="text" value = {tokenData?.address} onChange={
                        (e) => {
                            setData({ address: e.target.value, slug: '', symbol: '' })
                        }
                    } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter Token Address"></input>
                </div>
                <div className="flex flex-col mt-6 px-2 w-full text-base md:text-xl 2xl:text-3xl justify-end items-end">
                    <span onClick={confirm} className="flex p-2 px-6 bg-black cursor-pointer text-white">Search Token</span>
                </div>
            </form>
            <div className = {" w-full h-[150px] text-xl justify-center items-center" + (isLoading ? " flex":" hidden")}>
                    Loading...
            </div>
                {
                   realData && <div className="flex flex-col md:flex-row justify-start mb-12 text-base md:text-xl 2xl:text-3xl  ">
                    <img src={realData.logo} className="rounded-[9999px] bg-[#e5e5e5]  w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] pointer-events-none"></img>
                    <div className = "flex flex-col px-6">
                        <span className="font-bold">{realData.name}</span>
                        <span className = "mt-2 ">Symbol: {realData.symbol}</span>
                        <span className = "mt-2 text-gray-400 font-semibold">${realData.price}</span>
                        <span className = "mt-2 ">Slug: {realData.slug}</span>
                        {realData.contract_address[0]?.contract_address&&<span className = "mt-2">Address: {realData.contract_address[0]?.contract_address}({`${realData.contract_address[0]?.platform?.name??'None'}`})</span>}
                        <span className = "mt-2 text-gray-700 font-semibold">Description</span>
                        <span>{realData.description}</span>
                        <span className = "justify-end items-end w-full mt-3 flex"><button onClick={onSave} className = "flex p-2 px-6 bg-black cursor-pointer text-white">save</button></span>
                    </div>
                </div>}
                </>}
                {
                    type == 1 && <AddNewToken></AddNewToken>
                }
        </div>
    )
}