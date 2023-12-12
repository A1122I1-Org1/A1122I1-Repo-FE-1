import React, {useState, useEffect} from 'react';
import * as GroupService from '../../../src/service/GroupAccountService';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './css.css'

import {PaginationNav} from "./PaginationNav";
const ListGroupAccount = () => {
    const [groups, setGroup] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKey, setSearchKey] = useState("");
    const [searchKeyTmp, setSearchKeyTmp] = useState("");
    const [showAccept, setShowAccept] = useState(false);
    const [groupAcceptId,setGroupAcceptId]=useState("");
    const [groupDeleteId,setGroupDeleteId]=useState("");
    const [listStudentDeleteGroup,setListStudentDeleteGroup]=useState("");
    const [showDelete,setShowDelete]=useState('');
    const [showCreateDeadline,setShowCreateDeadline]=useState("");
    const [groupCreateDayId,setGroupCreateDayId]=useState("");
    const [deadline,setDeadline]=useState("");
    const [isValidDeadline, setIsValidDeadline] = useState(true);
    const [deadlineError, setDeadlineError] = useState("");
    const [nameGroup,setNameGroup]=useState("");

    const handleCloseAccept = () => setShowAccept(false);
    const handleShowAccept = (id,name) => {
        setGroupAcceptId(id)
        setNameGroup(name);
        setShowAccept(true)};
    const handleCloseDelete=()=>setShowDelete(false);
    const handleShowDelete=(id,students,name)=>{
        setGroupDeleteId(id)
        setListStudentDeleteGroup(students)
        setNameGroup(name)
        setShowDelete(true);};
    const handleShowCreateDeadline=(id,name)=>{
        setGroupCreateDayId(id)
        setNameGroup(name)
        setShowCreateDeadline(true)
    };
    const handleCloseCreateDeadline=()=>
    {setShowCreateDeadline(false);
        setDeadlineError("");}
    const handleDeadlineChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();
        // Kiểm tra nếu ngày nhập vào lớn hơn ngày hiện tại
        const isValid = selectedDate > currentDate;
        if (isValid) {
            setDeadline(e.target.value);
            setDeadlineError("");
        } else {
            setDeadlineError("Ngày phải lớn hơn ngày hiện tại");
        }
        setIsValidDeadline(isValid);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const data = await GroupService.findAll(pageNumber, searchKey)
                setGroup(data.content);
                setTotalPages(data.totalPages);

            } catch (error) {
                console.error('Error fetching data:', error);
                setGroup([]);
                setTotalPages(0);
            }
        };
        fetchApi()
    }, [pageNumber,searchKey,groups]) // Thực hiện một lần sau khi component được render

    const handleSearch = () => {
        setSearchKey(searchKeyTmp);
    };
    const handleAcceptGroup=(id)=>{
        try {
            GroupService.acceptGroup(id)
            handleCloseAccept()
        } catch (e){
            console.log(e);
        }
    }
    const handleDeleteGroup=(id,listStudent)=>{
        try {
            GroupService.deleteGroup(id,listStudent)
            handleCloseDelete()
            console.log(listStudentDeleteGroup)
        } catch (e){
            console.log(e);
        }
    }
    const handleCreateDeadLine=(id,deadline)=>{
        try {
            GroupService.createDeadLine(id,deadline)

            handleCloseCreateDeadline()

        } catch (e){
            console.log(e);
        }
    }
    return (
        < >
            <div>
                <Modal show={showAccept} onHide={handleCloseAccept} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận duyệt nhóm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có thực sự muốn duyệt nhóm {nameGroup} không?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAccept}>
                            Đóng
                        </Button>
                        <Button variant="btn btn-success"  onClick={e=>handleAcceptGroup(groupAcceptId)}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <div>
                <Modal show={showDelete} onHide={handleCloseDelete} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận xóa nhóm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có thực sự muốn xóa nhóm {nameGroup} không?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDelete}>
                            Đóng
                        </Button>
                        <Button variant="btn btn-success"  onClick={event=>handleDeleteGroup(groupDeleteId,listStudentDeleteGroup)}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <div>
                <Modal show={showCreateDeadline} onHide={handleCloseCreateDeadline}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tạo hạn chót nộp dự án</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Hãy nhập hạn chót nộp dự án của nhóm {nameGroup}:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    onChange={handleDeadlineChange}
                                    autoFocus
                                />

                                <Form.Control.Feedback type="invalid">
                                    {isValidDeadline ? "" : "Ngày phải lớn hơn ngày hiện tại"}
                                </Form.Control.Feedback>
                                <p className="text-danger">{deadlineError}</p>
                            </Form.Group>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseCreateDeadline}>
                            Đóng
                        </Button>
                        <Button variant="btn btn-success"
                                onClick={() => isValidDeadline && handleCreateDeadLine(groupCreateDayId, deadline)}
                                disabled={!isValidDeadline}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <head>
                <title>Quản lý đồ án</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
                      integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
                      crossOrigin="anonymous"></link>
                <link rel="stylesheet"
                      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"></link>
            </head>
            <body>
            <div className="header">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <a className="navbar-brand" href="#">Navbar</a>

                    <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            <li className="nav-item active">
                                <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled" href="#">Disabled</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div className="container">
                <div className="col-12">
                    <div className="title1"><h2>Quản lý nhóm sinh viên</h2></div>
                    <div className="d-flex justify-content-end">
                        <div className="col-4">
                            <div className="input-group mb-3 rounded-pill border p-2">
                                <input type="text" className="form-control border-0"
                                       placeholder="Tìm kiếm bằng tên nhóm "
                                       aria-label="Tìm kiếm" aria-describedby="button-addon2"
                                       value={searchKeyTmp}
                                       onChange={(e) => setSearchKeyTmp(e.target.value)}
                                       maxLength={30}
                                />
                                <button className="btn btn-outline-secondary border-0  btn-hover-none rounded-circle"
                                        type="button" id="button-addon2"
                                        onClick={handleSearch}
                                ><i className="bi bi-search"></i></button>
                            </div>
                        </div>
                    </div>
                    <div className="tabledata">

                        <table>
                            <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Tên nhóm</th>
                                <th scope="col">Số sinh viên</th>
                                <th scope="col">Thời hạn chót nộp đề tài</th>
                                <th scope="col">Kiểm duyệt</th>
                                <th scope="col" colSpan="2">Chức năng</th>
                                <th scope="col">Gửi yêu cầu</th>
                            </tr>
                            </thead>
                            <tbody>
                            {groups.length === 0 ?
                                <tr>
                                    <th scope="col" colSpan="8"><h1 className="text-center">Dữ liệu không tồn tại</h1></th>
                                </tr>
                                :
                                <>
                                    {groups.map((s,index)=>(
                                        <tr key={index}>
                                            <th scope="row">{index+1}</th>
                                            <td>{s.name}</td>
                                            <td>{s.studentList.length}</td>
                                            <td>{s.date}</td>
                                            <td>
                                                <button type="button" className="btn btn-outline-success" data-bs-toggle="modal"
                                                        data-bs-target="#exampleModal-1" disabled={s.status===true} onClick={event =>  handleShowAccept(s.groupAccountId,s.name)} >Duyệt
                                                </button>
                                            </td>
                                            <td className="btndelete no-border">
                                                <button type="button" className="btn btn-outline-danger" data-bs-toggle="modal"
                                                        data-bs-target="#exampleModal-2" onClick={event =>  handleShowDelete(s.groupAccountId,s.studentList.map(student => student.studentId),s.name)}>Xóa
                                                </button>
                                            </td>
                                            <td className="btnmember no-border">
                                                <button type="button" className="btn btn-outline-info">Thành viên</button>
                                            </td>
                                            <td>
                                                <button type="button" className="btn btn-outline-secondary" onClick={event =>  handleShowCreateDeadline(s.groupAccountId,s.name)}>Hạn
                                                    chót nộp dự án
                                                </button>

                                            </td>
                                        </tr>
                                    ))}
                                </>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </body>
            <div className="row" id="pagination">
                <PaginationNav pageNumber={pageNumber}
                               totalPages={totalPages}
                               setPageNumber={setPageNumber}
                />
            </div>

        </>
    );
};

export default ListGroupAccount;


