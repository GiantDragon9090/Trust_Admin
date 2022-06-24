import {useSelector} from 'react-redux'


export default function Label(){
    const logined = useSelector((state) => state.log_reducer.logined)

    return <>
    {
        logined ? <h1 className = "font-extrabold text-3xl md:text-5xl 2xl:text-7xl my-10 px-12">
            Admin Panel
        </h1>:<></>
    }
    </>
}