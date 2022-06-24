import { Modal, notification, Select } from 'antd'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function InvInfo(props) {
    console.log(props)
    const { data } = props
    const { fetchInvData, userid } = props
    const [saveData, setData] = useState({})
    const [editable, setEditable] = useState(data ? false : true)
    const [tokenList, setTokenList] = useState([])
    const [isVisible, setModal] = useState(false)

    useEffect(() => {
        axios.post(global.backendserver + "/api/getTokenList", {
            payload: {
                limit: 10000,
                search: ""
            }
        }).then((res) => {
            setTokenList(res.data)
        })
    }, [])

    const deleteThis = () => {
        axios.post(global.backendserver + '/api/saveInvest', {
            payload: { id: -data?.id }
        }).then(() => {
            notification.success({message:"Success", description:"Save Success!!"})
            setModal(false)
            fetchInvData(1)
        })
    }

    const saveThis = () => {
        if (!saveData?.designation || saveData?.designation == '') {
            notification.warning({
                message: "Warning",
                description: "Please enter Designation.."
            })
            return
        }
        if (!saveData?.investcompany || saveData?.investcompany == '') {
            notification.warning({
                message: "Warning",
                description: "Please enter investment company.."
            })
            return
        }
        if (!saveData?.token_id || saveData?.token_id == '') {
            notification.warning({
                message: "Warning",
                description: "Please Select Token."
            })
            return
        }
        if (!saveData?.token_amount || saveData?.token_amount == '') {
            notification.warning({
                message: "Warning",
                description: "Please enter token amount.."
            })
            return
        }
        if (!saveData?.amount || saveData?.amount == '') {
            notification.warning({
                message: "Warning",
                description: "Please enter invest amount.."
            })
            return
        }

        axios.post(global.backendserver + '/api/saveInvest',{
            payload: {...saveData,"user_id":userid, id : (data?data.id:0)}
        }).then(() => {
            notification.success({message:"Success", description:"Save Success!!"})
            setData({ designation: '', investcompany: '', token_id: '', token_amount: '', amount: '' })
            fetchInvData(1)
        })

    }
        return <div className="w-5/6 grid gap-4 p-6 grid-cols-1 lg:grid-cols-2 justify-center border border-solid border-gray-900">
            <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                <h5 className=" font-bold ">Designation *</h5>
                <input required disabled={!editable} value={saveData?.designation} type="text" defaultValue={data?.designation} onChange={
                    (e) => {
                        setData((prev) => ({ ...prev, designation: e.target.value }))
                    }
                } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter your role"></input>
            </div>
            <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                <h5 className=" font-bold ">Investment Company *</h5>
                <input required disabled={!editable} type="text" value={saveData?.investcompany} defaultValue={data?.investcompany} onChange={
                    (e) => {
                        setData((prev) => ({ ...prev, investcompany: e.target.value }))
                    }
                } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Invested company name"></input>
            </div>
            <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                <h5 className=" font-bold ">Token *</h5>
                {!editable ? <span className="w-full p-2 px-8 bg-[#e5e5e5] flex flex-row h-[44px] gap-6" >
                    <img src={data?.logo} className="w-[30px] gap-6 h-[30px] rounded-[999px]"></img>{data?.name}({data?.symbol})
                </span> :
                    <Select className='h-[44px]' value={saveData?.token_id} defaultValue={data?.token_id} onChange={(e) => {
                        setData((prev) => ({ ...prev, token_id: e }))
                    }} showSearch={true} optionFilterProp="children" filterOption={(input, option) => option.children.join("").toLowerCase().search(input.toLocaleLowerCase()) != -1}
                    >
                        {tokenList.map((each) => <Select.Option key={each.id} className="flex flex-row" value={each.id}><img src={each.logo} className="w-[30px] gap-6 h-[30px] rounded-[999px]"></img>{each.name}({each.symbol})</Select.Option>)}
                    </Select>
                }
            </div>
            <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                <h5 className=" font-bold ">Token Amount *</h5>
                <input required disabled={!editable} type="text" value={saveData?.token_amount} defaultValue={data?.token_amount} onChange={
                    (e) => {
                        setData((prev) => ({ ...prev, token_amount: e.target.value }))
                    }
                } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter token amount"></input>
            </div>
            <div className="flex flex-col px-2 w-full text-base md:text-xl 2xl:text-3xl justify-start">
                <h5 className=" font-bold ">Invest Amount ($) *</h5>
                <input required disabled={!editable} type="text" value={saveData?.amount} defaultValue={data?.amount} onChange={
                    (e) => {
                        setData((prev) => ({ ...prev, amount: e.target.value }))
                    }
                } className="w-full p-2 px-8 bg-[#e5e5e5]" placeholder="Enter amount"></input>
            </div>
            <Modal visible={isVisible} title="Confirm" onOk={deleteThis} onCancel={() => {
                setModal(false)
            }}>
                <p className="text-xl md:text-3xl 2xl:text-5xl">Delete this information?</p>
            </Modal>
            <div className="flex flex-row gap-2 px-2 w-full text-base md:text-xl 2xl:text-3xl  items-end justify-end">
                {!editable && <>
                    <button className="flex p-2 px-6 bg-black border border-black cursor-pointer text-white"
                        onClick={() => { setEditable(true) }}
                    > Edit </button>
                    <button className="flex p-2 px-6 bg-white border border-black cursor-pointer text-black " onClick={() => {
                        setModal(true)
                    }}> Delete </button>
                </>
                }
                {editable && <>
                    <button className="flex p-2 px-6 bg-black border border-black cursor-pointer text-white" onClick={saveThis}> Save </button>
                    {data ? <button className="flex p-2 px-6 bg-white border border-black cursor-pointer text-black"
                        onClick={() => {
                            setEditable(false)
                            setData({ ...data })
                        }}
                    > Cancel </button> :
                        <button className="flex p-2 px-6 bg-white border border-black cursor-pointer text-black" onClick={() => {

                            setData({ designation: '', investcompany: '', token_id: '', token_amount: '', amount: '' })
                        }}> Reset </button>
                    }
                </>
                }
            </div>
        </div>
    }