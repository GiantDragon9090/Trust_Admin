import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState, useEffect } from 'react'
import axios from "axios"
import { notification } from "antd"

export default function AddNewToken() {
    const [ tokenData, setData ] = useState({})
    const logined = useSelector((state) => state.log_reducer.logined)

    const navigate = useNavigate()
    useEffect(() => {
        if(!logined) navigate("/")
    }, [])

    const submit = (e) => {
        if(!tokenData.name || tokenData.name == ''){
            notification.warning({
                message : "Warning",
                description : "Please input Token Name.."
            })
            return
        }
        if(!tokenData.symbol || tokenData.symbol == ''){
            notification.warning({
                message : "Warning",
                description : "Please input Symbol.."
            })
            return
        }
        if(!tokenData.address || tokenData.address == ''){
            notification.warning({
                message : "Warning",
                description : "Please input Contract Address.."
            })
            return
        }if(!tokenData.slug || tokenData.slug == ''){
            notification.warning({
                message : "Warning",
                description : "Please input Slug.."
            })
            return
        }
        if(!tokenData.platform || tokenData.platform == ''){
            notification.warning({
                message : "Warning",
                description : "Please input Platform.."
            })
            return
        }
        if( !tokenData.logoFile){
            notification.warning({
                message : "Warning",
                description : "Please Select Token Icon.."
            })
            return
        }
        const formData = new FormData()
        formData.append("logoFile", tokenData.logoFile)
        formData.append("payload", JSON.stringify({ ...tokenData, type : 1 }))
        axios.post(global.backendserver + '/api/saveToken', formData, { headers: { "Content-Type": 'multipart/form-data' } }).then((resp) => {
            if(resp.data == 'exist'){
                notification.info({
                    message : "Info",
                    description : "Duplicated Email Address!!"
                })  
                return  
            }
            notification.success({
                message : "Success",
                description : "Save Success!!"
            })
            navigate(`/tokens/${resp.data.insertId}`)
        })
    }

    const changePhoto = (e) => {
        const files = e.target.files
        setData((prev) => ({
            ...prev, logoFile: files[0]
        }))
        const objectUrl = URL.createObjectURL(files[0])
        setData((prev) => ({ ...prev, logo: objectUrl }))
    }
    return (
            <form onSubmit={submit} className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 p-4 text-base md:text-xl 2xl:text-3xl items-center">
                <div className="flex justify-start mb-12">
                    <input type="file" accept = "image/*" required onChange={
                        changePhoto
                    } className="rounded-[9999px]  w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] cursor-pointer "></input>
                    <img src={tokenData?.logo || "/plus.png"} className="rounded-[9999px] bg-[#e5e5e5] lg:-ml-[200px] -ml-[150px] w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] pointer-events-none"></img>
                </div>
                <div></div>
                <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                    <h5 className=" font-bold ">Token Name *</h5>
                    <input required type="text" onChange={
                        (e) => {
                            setData((prev) => ({ ...prev, name: e.target.value }))
                        }
                    } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter token name"></input>
                </div>
                <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                    <h5 className=" font-bold ">Symbol *</h5>
                    <input required type="text"  onChange={
                        (e) => {
                            setData((prev) => ({ ...prev, symbol: e.target.value }))
                        }
                    } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter Symbol"></input>
                </div>
                <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                    <h5 className=" font-bold ">Contract Address *</h5>
                    <input required type="email" onChange={
                        (e) => {
                            setData((prev) => ({ ...prev, address: e.target.value }))
                        }
                    } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter contract address"></input>
                </div>
                <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                    <h5 className=" font-bold ">Slug *</h5>
                    <input required type="text"  onChange={
                        (e) => {
                            setData((prev) => ({ ...prev, slug: e.target.value }))
                        }
                    } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter slug"></input>
                </div>
                <div className="flex flex-col px-2 pr-0 w-[200%] text-base md:text-xl 2xl:text-3xl justify-end">
                    <h5 className="flex font-bold ">Description *</h5>
                    <textarea required type="text" onChange={
                        (e) => {
                            setData((prev) => ({ ...prev, description: e.target.value }))
                        }
                    } className="w-full flex p-2 pr-0 px-8 bg-[#e5e5e5]" placeholder="Enter description"></textarea>
                </div>
                <div></div>
                <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-end">
                    <h5 className="flex font-bold ">Platform *</h5>
                    <input required type="text" onChange={
                        (e) => {
                            setData((prev) => ({ ...prev, platform: e.target.value }))
                        }
                    } className="w-full flex p-2 px-8 bg-[#e5e5e5]" placeholder="Enter Platform"></input>
                </div>
                <div className="flex flex-col mt-6 px-2 w-full text-base md:text-xl 2xl:text-3xl justify-end items-end">
                    <span onClick={submit} className="flex p-2 px-6 bg-black cursor-pointer text-white">Add token</span>
                </div>
            </form>
    )
}