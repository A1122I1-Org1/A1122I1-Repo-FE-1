import React, {useEffect, useState} from "react";
import * as GradeService from "../../service/GradeService"
import * as FacultyService from "../../service/FacultyService"
import * as StudentService from "../../service/StudentService"
import './StudentCSS.css'
import {NavLink} from "react-router-dom";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {storage} from "../../config/firebaseConfig";
import {PaginationNav} from "./PaginationNav";
import anh from "../image/default-avatar.png";

export const ViewSv = () => {
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKey, setSearchKey] = useState("");
    const [searchKeyTmp, setSearchKeyTmp] = useState("");
    const [avatarUrls, setAvatarUrls] = useState([]);
    const [avatar, setAvatar] = useState(null)
    const fetchApi = async () => {
        try {
            const result = await StudentService.findAll(pageNumber, searchKey)
            setStudents(result.content);
            setTotalPages(result.totalPages);
            const resultGrade = await GradeService.findAllGrade();
            setGrades(resultGrade);
            const resultFaculty = await FacultyService.findAllFaculty();
            setFaculties(resultFaculty)
        } catch (error) {
            console.error('Error fetching data:', error);
            setStudents([]);
            setTotalPages(0);
        }
    }
    useEffect(() => {
        fetchApi()
    }, [pageNumber, searchKey])
    const fetchAvatars = async () => {
        try {
            const avatarUrls = await Promise.all(students.map(async (s) => {
                if (s.avatar) {
                    const downloadUrl = await storage.ref(s.avatar).getDownloadURL();
                    console.log(downloadUrl)
                    return downloadUrl;
                } else {
                    return null;
                }
            }));
            setAvatarUrls(avatarUrls);
        } catch (error) {
            console.error("Error fetching avatars from Firebase:", error);
        }
    };
    useEffect(() => {
        fetchAvatars();
    }, [students]);
    const handleSearch = () => {
        setSearchKey(searchKeyTmp);
    };
    return (
        <div className="protect" style={{marginTop:"60px"}}>
        <div className="container">
        <h2 className="mt-4 mb-4">Danh sách sinh viên</h2>
        <div className="container-fluid">
            <div className="row">
                <div className="col-8 text-left">
                    <NavLink to={"/create-student"} className="btn btn-outline-success rounded-pill ">
                        Thêm sinh viên
                    </NavLink>
                </div>
                <div className="col-4">
                    <div className="input-group mb-3 rounded-pill border p-2">
                        <input type="text" className="form-control border-0"
                               placeholder="Tìm kiếm tên hoặc mã sinh viên "
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
        </div>
        <div className="row">
            {students.length === 0 ? <h1 className="text-center">Dữ liệu không tồn tại</h1> : <>
                {students.map((s, index) => (<div className="col-md-3 mb-4" key={index}>
                    <div className="card">
                        <LazyLoadImage
                            effect="blur" src={avatarUrls[index]|| (avatar ? URL.createObjectURL(avatar) : anh) } className="card-img-top img-fluid"
                            alt={`Sinh viên ${s.index}`} width="100%"
                        />
                        <div className="card-body">
                            <h5 className="card-title student-name">{s.name}</h5>
                            <p className="card-text"><b> <i className="bi bi-code-square"></i> Mã sinh
                                viên:</b> {"MSV".concat(s.studentId.toString().padStart(4, "0"))}</p>
                            <p className="card-text"><b><i className="bi bi-window-sidebar"></i> Lớp:
                            </b>{grades.find((g) => String(g.gradeId) === String(s.grade.gradeId))?.name}
                            </p>
                            <p className="card-text"><b><i
                                className="bi bi-envelope"></i> Email:</b> {s.email}</p>
                            <p className="card-text"><b><i className="bi bi-phone"></i> Điện thoại:
                            </b> {s.phone}
                            </p>
                            <p className="card-text"><b><i className="bi bi-collection"></i> Khoa:
                            </b> {faculties.find((f) => String(f.facultyId) === String(s.grade.gradeId))?.name}
                            </p>
                        </div>
                        <div className="card-footer">
                            <div style={{float: 'right'}}>
                                <button className="btn btn-danger rounded-circle"><i
                                    className="bi bi-trash"></i>
                                </button>
                                <NavLink to={`/edit-student/${s.studentId}`}
                                         className="btn btn-success rounded-circle"><i
                                    className="bi bi-pencil"></i>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>))}
                <PaginationNav pageNumber={pageNumber}
                               totalPages={totalPages}
                               setPageNumber={setPageNumber}
                />
            </>}
        </div>
    </div>
        </div>)

}