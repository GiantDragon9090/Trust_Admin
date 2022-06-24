import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState, useEffect } from 'react'
import axios from "axios"
import { Modal, notification } from "antd"
import { BsTrash } from "react-icons/bs"

export default function DetailToken() {
    const { id } = useParams()
    const [realData, setRealData] = useState({})
    const [price, setPrice] = useState(0)
    const [isVisible, setModal] = useState(false)
    const logined = useSelector((state) => state.log_reducer.logined)

    const navigate = useNavigate()
    useEffect(() => {
        if (!logined) navigate("/")
        axios.post(global.backendserver + "/api/getTokenById", {
            payload: { id }
        }).then((resp) => {
            setRealData(resp.data[0])
            axios.post(global.backendserver + "/api/getPriceById", {
                payload: { id:resp.data[0].cmc_id }
            }).then((resp) => {
                setPrice(resp.data.price)
            })
        })
    }, [logined, id])

    const deleteThis = () => {
        axios.post(global.backendserver + "/api/saveToken",{
            payload : {
                id: -id
            }
        }).then((resp) => {
            notification.success({
                message : "Success"
                ,description: "Delete Success!"
            })
            navigate("/tokens")
        })
    }

    return (
        <div className="p-4 md:w-[calc(100vw-330px)] w-[calc(100vw-280px)] 2xl:w-[calc(100vw-430px)]  bg-white h-full flex flex-col">
            <div className="w-full flex flex-col md:flex-row text-base md:text-xl 2xl:text-3xl items-center">
                <h4 className="font-bold p-4 w-full flex text-xl md:text-3xl 2xl:text-5xl justify-start">Token View</h4>
                <a onClick={() => {
                    setModal(true)
                }} className="text-gray-400 w-full lg:w-5/6 font-semibold justify-end flex flex-row items-center"><BsTrash></BsTrash>Delete Token</a>
            </div>
            <Modal visible={isVisible} title="Confirm" onOk={deleteThis} onCancel={() => {
                setModal(false)
            }}>
                <p className="text-xl md:text-3xl 2xl:text-5xl">Delete this token?</p>
            </Modal>
            {
                realData && <div className="flex flex-col md:flex-row justify-start mb-12 text-base md:text-xl 2xl:text-3xl  ">
                    <img src={realData.logo} className="rounded-[9999px] bg-[#e5e5e5]  w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] pointer-events-none"></img>
                    <div className="flex flex-col px-6 w-full  md:w-[calc(100%-150px)] lg:w-[calc(100%-200px)]">
                        <span className="font-bold flex ">{realData.name}</span>
                        <span className="mt-2 flex ">Symbol: {realData.symbol}</span>
                        <span className="mt-2 flex text-gray-400 font-semibold">{realData.type == 0? "$" + price:"NewToken"}</span>
                        <span className="mt-2 flex ">Slug: {realData.slug}</span>
                        {realData.address && <span className="mt-2 flex overflow-hidden">Address: {realData.address}({`${realData.platform ?? 'None'}`})</span>}
                        <span className="mt-2 flex text-gray-700 font-semibold">Description</span>
                        <span className=" flex">{realData.description}</span>
                    </div>
                </div>}
        </div>
    )
}