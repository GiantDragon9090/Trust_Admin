import { useSelector, useDispatch } from 'react-redux'
import { actions } from "../redux"
import { useLocation, useNavigate } from 'react-router-dom'
import {BsListUl,BsListOl, BsPlusCircle,BsPatchPlus} from 'react-icons/bs'

export default function SidePanel() {
    const userinfo = useSelector((state) => state.log_reducer.userinfo)
    const logined = useSelector((state) => state.log_reducer.logined)
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const pathname = location.pathname.split("/")

    if(!logined) navigate("/")

    return <div className="flex flex-col mx-12 gap-4 md:gap-6 w-[150px] md:w-[200px] 2xl:w-[300px]">
        <div className="flex flex-col py-6 bg-white justify-center items-center w-full">
            <img src={userinfo?.photo || '/default.webp'} alt="no image" className="bg-[#e5e5e5] w-[50px] md:w-[100px] 2xl:w-[150px] 2xl:h-[150px] h-[50px] md:h-[100px] rounded-[9999px]"></img>
            <span className="pt-2 font-semibold text-sm md:text-lg 2xl:text-2xl">{userinfo?.name}</span>
            {userinfo.isAdmin && <span className="py-0 font-semibold text-gray-400 text-sm md:text-lg 2xl:text-2xl">Admin</span>}
            <span onClick={() => {
                dispatch(actions.logOut())
            }} className="py-0 font-semibold text-[red] cursor-pointer text-sm md:text-lg 2xl:text-2xl">Logout</span>
        </div>

        <div className="flex flex-col p-4 bg-white justify-start items-start w-full">
            <span className="font-bold text-lg md:text-2xl 2xl:text-4xl ">Members</span>
            <a onClick = {()=>{
                navigate("/")
            }} className = {(( !pathname[1] || pathname[1] == '' || pathname[1] == 'detailMember' ||pathname[1] == 'editMember' && pathname[2] *1 != 0) ? "font-bold ":" ") + "p-2 pt-4 text-black text-xs md:text-base 2xl:text-xl cursor-pointer flex flex-row items-center gap-2"}><BsListUl></BsListUl>Members List</a>
            <a onClick = {()=>{
                navigate("/editMember/0")
            }} className = {((pathname[1] == 'editMember' && pathname[2] *1 == 0) ? "font-bold ":" ") +"p-2 text-xs text-black md:text-base 2xl:text-xl cursor-pointer  flex flex-row items-center gap-2"}><BsPlusCircle></BsPlusCircle>Add Member</a>
        </div>

        <div className="flex flex-col p-4 bg-white justify-start items-start w-full">
            <span className="font-bold text-lg md:text-2xl 2xl:text-4xl ">Tokens</span>
            <a onClick = {()=>{
                navigate("/tokens")
            }} className = {((pathname[1] == 'tokens' || pathname[1] == 'detailToken') ? "font-bold ":" ") +"p-2 pt-4 text-black text-xs md:text-base 2xl:text-xl cursor-pointer flex flex-row items-center gap-2"}><BsListOl></BsListOl>Listed Tokens</a>
            <a onClick = {()=>{
                navigate("/editToken")
            }} className = {((pathname[1] == 'editToken') ? "font-bold ":" ") +"p-2 text-xs text-black md:text-base 2xl:text-xl cursor-pointer  flex flex-row items-center gap-2"}><BsPatchPlus></BsPatchPlus>Add Token</a>
        </div>
    </div>
}