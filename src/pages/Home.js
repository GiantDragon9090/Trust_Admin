import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from "../redux"
import md5 from 'md5'
import { notification } from 'antd'
import axios from 'axios'
import Members from './Members'

export default function Home() {
    const [loginData, setData] = useState({ mode: 1 })
    const logined = useSelector((state) => state.log_reducer.logined)
    const dispatch = useDispatch()

    const login = (e) => {
        e.preventDefault()
        const postData = { ...loginData, password: md5(loginData.password) }
        axios.post(global.backendserver + "/api/login", {
            payload: postData
        }).then((resp) => {
            if (resp.data.type == 'success') {
                dispatch(actions.logIn({ userinfo: resp.data.userinfo }))
            } else {
                notification[resp.data.type]({
                    message: resp.data.msg,
                    description: resp.data.description
                })
            }
        }).catch((e) => {
            notification.error({
                message: "Error",
                description: "Network Error"
            })
        })
    }

    return <>{
        logined ? <Members /> :
            <div className="flex flex-row w-full min-h-[100vh] justify-center items-center bg-[#e5e5e5]">
                <div className="flex flex-col w-full sm:w-3/6 justify-center items-center">
                    <div className="flex flex-col w-5/6">
                        <h1 className="font-extrabold text-3xl xl:text-5xl 2xl:text-7xl">Login</h1>
                        <h4 className="font-semibold text-lg xl:text-2xl 2xl:text-4xl tracking-tight">Enter your valid credential for the access</h4>
                        <form onSubmit={login} className="flex flex-col w-full bg-white py-6 justify-center items-center text-md xl:text-xl 2xl:text-3xl">
                            <span className="w-5/6 font-bold my-4">Email Address</span>
                            <input type="email" onChange={(e) => {
                                setData((prev) => ({ ...prev, email: e.target.value }))
                            }} required className="w-5/6 bg-[#e5e5e5] p-4" placeholder="Enter your email"></input>
                            <span className="w-5/6 font-bold my-4">Password</span>
                            <input type="password" required onChange={(e) => {
                                setData((prev) => ({ ...prev, password: e.target.value }))
                            }} className="w-5/6 bg-[#e5e5e5] p-4" placeholder="Enter your password"></input>
                            <span className="flex flex-row w-5/6 my-4">
                                <button className="flex p-2 px-6 bg-black cursor-pointer text-white">Login</button>
                                <div className="relative flex flex-col w-full items-end group justify-center cursor-pointer">
                                    <span className="justify-end">Do you login at first?</span>
                                    <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex">
                                        <span className="relative z-10 p-2 leading-none text-white whitespace-no-wrap bg-gray-600 shadow-lg rounded-md">Please use "trust" as password and change it after login...</span>
                                        <div className="w-3 h-3 -mt-2 rotate-45 bg-gray-600"></div>
                                    </div>
                                </div>
                            </span>
                        </form>
                    </div>
                </div>
                <div className="sm:flex h-full hidden w-3/6 justify-center items-center">
                    <img src="/login.png" alt="no exist" className=" h-5/6"></img>
                </div>
            </div>
    }
    </>
}