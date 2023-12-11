import './App.css';
import React, {useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import {CreateTeacher} from "./component/teacher/createTeacher";
import {ListStudentAd} from "./component/student/ListStudentAd";
import {ListStudentTeacher} from "./component/student/ListStudentTeacher";
import {ListTeacher} from "./component/teacher/listTeacher";
import {Login} from "./component/login/login";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import HomePage from "./pages/HomePage";
import TopicTable from "./component/topic/TopicTable";
import {Create} from "./component/student/Create-student";
import {RegisterTeacher} from "./component/registerTeacher/RegisterTeacher";
import UpdateTeacher from "./component/teacher/updateTeacher";
import {ResgiterGroupStudent} from "./component/groupstudent/ResgiterGroup";
import NotificationList from "./component/notification/NotificationList";
import ListGroupAccount from "./component/ListGroupAccount/ListGroupAccount";
import {Edit} from "./component/student/Edit-student";
import {ResgiterTopic} from "./component/topic/ResgiterTopic";
import ListTopicNotApproval from "./component/approvalTopic/ListTopicNotApproval";
import {PrivateRouter} from "./routers/PrivateRouter";
import NotFoundPage from "./component/error/NotFoundPage";
import {UserInfo} from "./component/userInfo/user-info";

function App() {
    const navigate = useNavigate();
    const roles = localStorage.getItem("roles");

    useEffect(() => {
        if (roles && window.location.pathname === "/login") {
            toast.info("Bạn đã đăng nhập", { autoClose: 3000 });
            // Redirect người dùng đến trang chính sau 3 giây
            setTimeout(() => {
                navigate('/');
            }, 3000);
        }
    }, [roles]);

    return (
        <>
            <Routes>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/" element={<HomePage/>}></Route>
                {
                    !roles ? (
                        ""
                    ) : roles.includes('ROLE_ADMIN') ? (
                        <>
                            <Route path="/list-teacher" element={
                                <PrivateRouter><ListTeacher/></PrivateRouter>
                            }/>
                            <Route path="/create-teacher" element={
                                <PrivateRouter><CreateTeacher/></PrivateRouter>
                            }/>
                            <Route path="/update-teacher/:id" element={
                                <PrivateRouter> <UpdateTeacher/></PrivateRouter>
                            }/>
                            <Route path="/list-student" element={
                                <PrivateRouter><ListStudentAd/></PrivateRouter>
                            }/>
                            <Route path="/edit-student/:studentId" element={
                                <PrivateRouter> <Edit/></PrivateRouter>
                            }/>
                            <Route path="/create-student" element={
                                <PrivateRouter><Create/></PrivateRouter>
                            }/>
                        </>
                    ) : roles.includes('ROLE_TEACHER') ? (
                        <>
                            <Route path="/user-info" element={
                                <PrivateRouter><UserInfo/></PrivateRouter>
                            }/>
                            <Route path="/list-group" element={
                                <PrivateRouter><ListGroupAccount/></PrivateRouter>
                            }/>
                            <Route path="/list-topic" element={
                                <PrivateRouter><TopicTable/></PrivateRouter>
                            }/>
                            <Route path="/list-student-group" element={
                                <PrivateRouter><ListStudentTeacher/></PrivateRouter>
                            }/>
                            {/*kiểm duyệt đề tài*/}
                            <Route path="/approval-topic" element={
                                <PrivateRouter><ListTopicNotApproval/></PrivateRouter>
                            }/>
                        </>
                    ) : (
                        <>
                            <Route path="/user-info" element={
                                <PrivateRouter><UserInfo/></PrivateRouter>
                            }/>
                            <Route path="/register-group-student" element={
                                <PrivateRouter><ResgiterGroupStudent/></PrivateRouter>
                            }/>
                            <Route path="/register-teacher" element={
                                <PrivateRouter><RegisterTeacher/></PrivateRouter>
                            }/>
                            <Route path="/register-topic" element={
                                <PrivateRouter><ResgiterTopic/></PrivateRouter>
                            }/>
                            <Route path="/notification" element={
                                <PrivateRouter><NotificationList/></PrivateRouter>
                            }/>
                        </>
                    )
                }
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
            <ToastContainer/>
        </>
    );
}

export default App;
