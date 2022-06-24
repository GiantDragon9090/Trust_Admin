import React from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, useLocation } from "react-router-dom"
import Home from './pages/Home'
import SidePanel from './pages/SidePanel'
import Label from './pages/Label'
import EditMember from './pages/EditMember'
import DetailMember from './pages/DetailMember'
import EditToken from './pages/EditToken'
import Tokens from './pages/Tokens'
import DetailToken from './pages/DetailToken'

function App() {
    const location = useLocation();
    const logined = useSelector((state) => state.log_reducer.logined)
    return (
        <div className="flex flex-col bg-[#e5e5e5] min-h-[100vh]">
            {logined && <Label />}
            <div className="flex flex-row">
                {logined &&
                    <SidePanel />
                }
                <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/editMember/:id" element={<EditMember></EditMember>}></Route>
                    <Route path="/detailMember/:id" element={<DetailMember></DetailMember>}></Route>
                    <Route path="/editToken" element={<EditToken></EditToken>}></Route>
                    <Route path="/detailToken/:id" element={<DetailToken></DetailToken>}></Route>
                    <Route path="/tokens" element={<Tokens></Tokens>}></Route>
                </Routes>
            </div>
        </div>
    )
}

export default React.memo(App)
