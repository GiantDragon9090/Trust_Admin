import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState, useEffect } from 'react'
import axios from "axios"
import { Modal, notification } from "antd"
import { BsBuilding, BsEnvelope, BsPencil, BsPersonSquare, BsPhone, BsTrash } from "react-icons/bs"
import InfiniteScroll from "react-infinite-scroll-component"
import InvInfo from "./InvInfo"

export default function DetailMember() {
    const { id } = useParams()
    const logined = useSelector((state) => state.log_reducer.logined)
    const [invList, setInvList] = useState([])
    const [hasmore, setHasMore] = useState(true)
    const [userData, setUserData] = useState()
    const [visible, setModal] = useState(false)

    const navigate = useNavigate()
    useEffect(() => {
        if (!logined) navigate("/")
        if (id > 0) {
            axios.post(global.backendserver + "/api/getUserInfoById", {
                payload: {
                    id
                }
            }).then((resp) => {
                setUserData(resp.data[0])
            })
            fetchInvData()
        }
    }, [id])

    const fetchInvData = async (page) => {
        const resp = await axios.post(global.backendserver + "/api/getInvestList", {
            payload: {
                page: page?page:(invList.length / 24 + 1),
                user_id: id
            }
        })
        const { data } = resp
        if (data.length < 24) setHasMore(false)
        if(page == 1) setInvList(data)
        else setInvList((prev) => [...prev, ...data])

    }

    const deleteThis = () => {
        axios.post(global.backendserver + "/api/saveUser", {
            payload: JSON.stringify({
                id: -id
            })
        }).then((resp) => {
            notification.success({
                message: "Success"
                , description: "Delete Success!"
            })
            navigate("/")
        })
    }
    return <div className="p-4 md:w-[calc(100vw-330px)] w-[calc(100vw-280px)] 2xl:w-[calc(100vw-430px)]  bg-white h-full flex flex-col">
        <div className="w-full flex flex-col lg:flex-row text-base md:text-xl 2xl:text-3xl items-center">
            <h4 className="font-bold p-4 pb-0 xl:pb-4 w-full flex text-xl md:text-3xl 2xl:text-5xl justify-start">Member View</h4>
            <a onClick={() => {
                setModal(true)
            }} className="text-gray-400 w-full lg:w-3/6 font-semibold justify-end flex flex-row items-center"><BsTrash></BsTrash>Delete Member</a>
            <a onClick={() => { navigate("/editMember/" + id) }} className="text-gray-400 w-full lg:w-3/6 font-semibold justify-end flex flex-row items-center"><BsPencil></BsPencil>Edit Member</a>
        </div>
        <Modal visible={visible} title="Confirm" onOk={deleteThis} onCancel={() => {
            setModal(false)
        }}>
            <p className="text-xl md:text-3xl 2xl:text-5xl">Delete this user?</p>
        </Modal>
        <div className="w-full flex flex-col lg:flex-row text-base md:text-xl 2xl:text-3xl items-center">
            <div className="flex justify-start w-full mb-12 mx-10 max-w-[200px]">
                <img src={userData?.photo || "/default.webp"} className="rounded-[9999px] bg-[#e5e5e5] w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] pointer-events-none"></img>
            </div>
            <div className="flex flex-col justify-start items-start px-2 w-full h-[150px] lg:h-[200px]">
                <span className="flex w-full font-bold flex-row text-lg md:text-2xl 2xl:text-4xl justify-start items-center"><BsPersonSquare className="mr-4"></BsPersonSquare>{userData?.name}</span>
                <span className="flex w-full mt-2 flex-row text-lg md:text-2xl 2xl:text-4xl justify-start items-center"><BsBuilding className="mr-4"></BsBuilding>{userData?.company}</span>
                <span className="flex w-full mt-2 flex-row text-lg md:text-2xl 2xl:text-4xl justify-start items-center"><BsEnvelope className="mr-4"></BsEnvelope>{userData?.email}</span>
                <span className="flex w-full mt-2 flex-row text-lg md:text-2xl 2xl:text-4xl justify-start items-center"><BsPhone className="mr-4"></BsPhone>{userData?.mobile}</span>
            </div>
        </div>
        <div className="w-full flex flex-col text-base md:text-xl 2xl:text-3xl items-center">
            <h4 className="font-semibold px-8 w-full flex text-xl md:text-3xl 2xl:text-5xl justify-start">Investments</h4>
        </div>
        <InfiniteScroll
            className={"mt-2 flex flex-col w-full gap-10 items-center"}
            dataLength={invList.length}
            next={fetchInvData}
            height={"calc(100vh - 200px)"}
            hasMore={hasmore}
            loader={<div className='flex text-3xl w-full h-[150px] items-center justify-center'>
                Loading...
            </div>}
        >
            {
                invList.map((each) => (
                    <InvInfo key={each.id} data={each} fetchInvData = {fetchInvData} userid={id}></InvInfo>
                ))
            }
            <InvInfo key={0} data={null}  fetchInvData = {fetchInvData} userid={id}></InvInfo>
        </InfiniteScroll>
    </div>
}