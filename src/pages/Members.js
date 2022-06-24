import { BsPlus, BsSearch } from "react-icons/bs"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from "antd"
import axios from "axios"
import InfiniteScroll from "react-infinite-scroll-component"


export default function Members() {
    const [searchIndex, setSearch] = useState('')
    const [hasmore, setHasMore] = useState(true)
    const [userList, setUserList] = useState([])

    const navigate = useNavigate()

    const fetchUserList = async (value) => {
        const resp = await axios.post(global.backendserver + "/api/getUserList", {
            payload: {
                page: (value != undefined ? 1 : (userList.length / 24 + 1)),
                search: searchIndex
            }
        })
        const { data } = resp
        if (data.length < 24) setHasMore(false)
        setUserList((prev) => [...prev, ...data])
    }

    useEffect(() => {
        fetchUserList()
    }, [])

    return <div className="p-4 md:w-[calc(100vw-330px)] w-[calc(100vw-280px)] 2xl:w-[calc(100vw-430px)]  bg-white h-full flex flex-col">
        <div className="w-full flex xl:flex-row flex-col text-base md:text-xl 2xl:text-3xl items-center">
            <h4 className="font-bold p-4 w-full flex xl:w-2/6 text-xl md:text-3xl 2xl:text-5xl justify-start">Members</h4>
            <Input onPressEnter={
                () => {
                    setUserList([])
                    fetchUserList("search")
                }
            } onChange={(e) => {
                setSearch(e.target.value)
            }} size="large" className="flex w-full xl:!w-2/6 border-gray border-solid border p-2 focus:!border-gray active:!border-gray" placeholder="Search Name..."></Input>
            <a onClick={()=>{navigate("/editMember/0")}} className="text-gray-400 w-full font-semibold xl:w-2/6 justify-end flex flex-row items-center"><BsPlus></BsPlus>Add New Member</a>
        </div>
        <InfiniteScroll
            className={"mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 xl:grid-cols-5 2xl:grids-col6"}
            dataLength={userList.length}
            next={fetchUserList}
            height={"calc(100vh - 200px)"}
            hasMore={hasmore}
            loader={<div className='flex text-3xl w-full h-[150px] items-center justify-center'>
                Loading...
            </div>}
        >
            {userList.map((each) => (
                <div key={each.id} className="w-full  hover:bg-[#d4d4d4] bg-[#e5e5e5]  h-[200px] flex flex-col justify-center items-center cursor-pointer" onClick={() => {
                    navigate(`/detailMember/${each.id}`)
                }}>
                    <img src={each.photo || "/default.webp"} className="bg-[#e5e5e5] w-[50px] md:w-[100px] 2xl:w-[150px] 2xl:h-[150px] h-[50px] md:h-[100px] rounded-[9999px]"></img>
                    <span className="pt-2 font-semibold text-sm md:text-lg 2xl:text-2xl">{each?.name}</span>
                    <span className="pt-2 font-semibold text-gray-400 text-sm md:text-lg 2xl:text-2xl">{each?.company}</span>
                </div>
            ))}
        </InfiniteScroll>

    </div>
}
