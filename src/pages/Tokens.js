import { BsPlus } from "react-icons/bs"
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Input } from "antd"
import axios from "axios"
import Token from './Token'
import InfiniteScroll from "react-infinite-scroll-component"


export default function Tokens() {
    const [searchIndex, setSearch] = useState('')
    const [hasmore, setHasMore] = useState(true)
    const [tokenList, settokenList] = useState([])
    const logined = useSelector((state) => state.log_reducer.logined)
    const navigate = useNavigate()
    if(!logined) navigate("/")

    const fetchtokenList = async (value) => {
        const resp = await axios.post(global.backendserver + "/api/getTokenList", {
            payload: {
                page: (value != undefined ? 1 : (tokenList.length / 24 + 1)),
                search: searchIndex
            }
        })
        const { data } = resp
        if (data.length < 24) setHasMore(false)
        settokenList((prev) => [...prev, ...data])
    }

    useEffect(() => {
        fetchtokenList()
    }, [])

    return <div className="p-4 md:w-[calc(100vw-330px)] w-[calc(100vw-280px)] 2xl:w-[calc(100vw-430px)]  bg-white h-full flex flex-col">
        <div className="w-full flex xl:flex-row flex-col text-base md:text-xl 2xl:text-3xl items-center">
            <h4 className="font-bold p-4 w-full flex xl:w-2/6 text-xl md:text-3xl 2xl:text-5xl justify-start">Tokens</h4>
            <Input onPressEnter={
                () => {
                    settokenList([])
                    fetchtokenList("search")
                }
            } onChange={(e) => {
                setSearch(e.target.value)
            }} size="large" className="flex w-full xl:!w-2/6 border-gray border-solid border p-2 focus:!border-gray active:!border-gray" placeholder="Search Name..."></Input>
            <a onClick={()=>{navigate("/editToken")}} className="text-gray-400 w-full font-semibold xl:w-2/6 justify-end flex flex-row items-center"><BsPlus></BsPlus>Add New Token</a>
        </div>
        <InfiniteScroll
            className={"mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 xl:grid-cols-5 2xl:grids-col6"}
            dataLength={tokenList.length}
            next={fetchtokenList}
            height={"calc(100vh - 200px)"}
            hasMore={hasmore}
            loader={<div className='flex text-3xl w-full h-[150px] items-center justify-center'>
                Loading...
            </div>}
        >
            {tokenList.map((each) => (
                <Token key={each.id} each = {each}></Token>
            ))}
        </InfiniteScroll>

    </div>
}
