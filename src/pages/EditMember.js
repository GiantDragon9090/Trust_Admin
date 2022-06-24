import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState, useEffect } from 'react'
import axios from "axios"
import { notification } from "antd"

export default function EditMember() {
    const { id } = useParams()
    const [ userData, setData ] = useState({})
    const logined = useSelector((state) => state.log_reducer.logined)

    const navigate = useNavigate()
    useEffect(() => {
        if(!logined) navigate("/")
        if (id > 0) {
            axios.post(global.backendserver + "/api/getUserInfoById", {
                payload: {
                    id
                }
            }).then((resp) => {
                setData(resp.data[0])
            })
        }else{
            setData({})
        }
    }, [id])

    const submit = (e) => {
        if(!userData.name || userData.name == ''){
            notification.warning({
                message : "Warning",
                description : "Please input Full Name.."
            })
            return
        }
        if(!userData.company || userData.company == ''){
            notification.warning({
                message : "Warning",
                description : "Please input Company Name.."
            })
            return
        }
        if(!userData.email || userData.email == ''){
            notification.warning({
                message : "Warning",
                description : "Please input Email Address.."
            })
            return
        }if(!userData.mobile || userData.mobile == ''){
            notification.warning({
                message : "Warning",
                description : "Please input Mobile.."
            })
            return
        }
        if(id == 0 && !userData.photoFile){
            notification.warning({
                message : "Warning",
                description : "Please Select Photo.."
            })
            return
        }
        if(userData.email.search('@') == -1){
            notification.warning({
                message : "Warning",
                description : "Invalid Email Address.."
            })
            return
        }
        const formData = new FormData()
        formData.append("photoFile", userData.photoFile)
        formData.append("payload", JSON.stringify({ ...userData, id }))
        axios.post(global.backendserver + '/api/saveUser', formData, { headers: { "Content-Type": 'multipart/form-data' } }).then((resp) => {
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
            navigate(`/detailMember/${id == 0? resp.data.insertId : id}`)
        })
    }

    const changePhoto = (e) => {
        const files = e.target.files
        setData((prev) => ({
            ...prev, photoFile: files[0]
        }))
        const objectUrl = URL.createObjectURL(files[0])
        setData((prev) => ({ ...prev, photo: objectUrl }))
    }
    return (
        <div className="p-4 md:w-[calc(100vw-330px)] w-[calc(100vw-280px)] 2xl:w-[calc(100vw-430px)]  bg-white h-full flex flex-col">
            <div className="w-full flex flex-col text-base md:text-xl 2xl:text-3xl items-center">
                <h4 className="font-bold p-4 w-full flex text-xl md:text-3xl 2xl:text-5xl justify-start">{id > 0 ? "Edit" : "Add"} Member</h4>
            </div>
            <form onSubmit={submit} className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 p-4 text-base md:text-xl 2xl:text-3xl items-center">
                <div className="flex justify-start mb-12">
                    <input type="file" accept = "image/*" required = {id == 0} onChange={
                        changePhoto
                    } className="rounded-[9999px]  w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] cursor-pointer "></input>
                    <img src={userData?.photo || "/default.webp"} className="rounded-[9999px] bg-[#e5e5e5] lg:-ml-[200px] -ml-[150px] w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] pointer-events-none"></img>
                </div>
                <div></div>
                <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                    <h5 className=" font-bold ">Full Name *</h5>
                    <input required type="text" defaultValue={userData?.name} onChange={
                        (e) => {
                            setData((prev) => ({ ...prev, name: e.target.value }))
                        }
                    } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter member name"></input>
                </div>
                <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                    <h5 className=" font-bold ">Company Name *</h5>
                    <input required type="text" defaultValue={userData?.company} onChange={
                        (e) => {
                            setData((prev) => ({ ...prev, company: e.target.value }))
                        }
                    } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter company name"></input>
                </div>
                <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                    <h5 className=" font-bold ">Email Address *</h5>
                    <input required type="email" defaultValue={userData?.email} onChange={
                        (e) => {
                            setData((prev) => ({ ...prev, email: e.target.value }))
                        }
                    } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter email address"></input>
                </div>
                <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                    <h5 className=" font-bold ">Mobile Number *</h5>
                    <input required type="text" defaultValue={userData?.mobile} onChange={
                        (e) => {
                            setData((prev) => ({ ...prev, mobile: e.target.value }))
                        }
                    } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter mobile number"></input>
                </div>
                <div></div>
                <div className="flex flex-col mt-6 px-2 w-full text-base md:text-xl 2xl:text-3xl justify-end items-end">
                    <span onClick={submit} className="flex p-2 px-6 bg-black cursor-pointer text-white">Save User</span>
                </div>
            </form>
        </div>
    )
}