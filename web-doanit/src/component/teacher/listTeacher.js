import './listTeacher.css'
import {NavLink} from "react-router-dom";
import {storage} from "../../config/firebaseConfig";
import {PaginationNav} from "../student/PaginationNav";
import React, {useEffect, useState} from "react";
import * as TeacherService from "../../service/TeacherService";
import {toast} from "react-toastify";
import {LazyLoadImage} from "react-lazy-load-image-component";
import DeleteConfirmation from "./DeleteConfirmation";

export const ListTeacher = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [find, setFind] = useState("");
    const [searchValue, setSearchValue] = useState('')
    const [teachers, setTeachers] = useState([]);
    const [avatarUrls, setAvatarUrls] = useState([]);
    const [delId, setDelId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);

    const fetchApi = async () => {
        try {
            const result = await TeacherService.getAllTeacher(find, pageNumber)
            setTeachers(result.content);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
            setTeachers([])
            setTotalPages(0);
        }
    };
    useEffect(() => {
        fetchApi()
    }, [find, pageNumber])

    const fetchAvatar = async () => {
        try {
            const avatarUrls = await Promise.all(teachers.map(async (t) => {
                if (t.avatar) {
                    const downloadUrl = await storage.ref(t.avatar).getDownloadURL();
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
        fetchAvatar();
    }, [teachers]);

    const showDeleteModal = (delId) => {
        setDelId(delId);
        setDeleteMessage(
            `Bạn chắc chắn xóa giảng viên : '${
                teachers.find((x) => x.teacherId === delId).teacherName
            }' không?`
        );
        setDisplayConfirmationModal(true);
        fetchApi();
    }
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    const submitDelete = async (delId) => {
        await TeacherService.deleteTeacher(delId);
        toast.success(`Xóa giảng viên '${teachers.find((x) => x.teacherId === delId).teacherName}' thành công.`)
        await fetchApi();
        setDisplayConfirmationModal(false);
    };
    const handleSearch = () => {
        setFind(searchValue);
    };


    return (<>

            <div className="huy title">
                <h1>Quản lý giáo viên</h1>
            </div>
            <div className="huy d-flex justify-content-around" style={{marginTop: '25px', marginBottom: '12px'}}>
                <NavLink to={"/create-teacher"} type="button" className="huy get-started-btn" style={{border: '0'}}>
                    Thêm mới giáo viên
                </NavLink>
                <div className="d-flex">
                    <input
                        className="form-control"
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Tìm kiếm giáo viên"
                        style={{borderRadius: '30px', border: '1px solid #d6c9bb', height: '37px', width: '300px'}}
                    />
                    <button type="button" className="huy get-started-btn" style={{border: '0'}} onClick={handleSearch}>
                        Tìm kiếm
                    </button>
                </div>
            </div>
            <div className='container'>
                <div className="row" style={{marginTop: '20px'}}>
                    {teachers.length === 0 ? <h1 className='huy text-center'>Không có dữ liệu</h1> : <>
                        {teachers.map((t, index) => (
                            <div className="huy card col-m-3" key={t}>
                                <LazyLoadImage
                                    effect="blur" src={avatarUrls[index]} className="huy img"
                                    alt={`Giảng viên ${t.avatar}`}
                                />
                                <hr/>
                                <div className='huy card-body'>
                                    <h5 className="huy card-title">{t.teacherName}</h5>
                                    <p className="huy card-text"><i className="bi bi-code-square"></i> Mã giảng viên
                                        : {"MGV-".concat(t.teacherId.toString())}</p>
                                    <p className="huy card-text"><i className="bi bi-envelope-at"></i> Email
                                        : {t.email.length > 22 ? `${t.email.substring(0, 22)}...` : t.email}</p>
                                    <p className="huy card-text"><i className="bi bi-telephone"></i> Sdt : {t.phone}</p>
                                    <p className="huy card-text"><i className="bi bi-signpost-2"></i> Khoa: {t.facultyName}
                                    </p>
                                </div>
                                <hr/>
                                <div className="huy action" style={{float: 'right'}}>
                                    <NavLink to={`/update-teacher/${t.teacherId}`}>
                                        <button className="huy btn btn-success rounded-circle">
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                    </NavLink>
                                    {/*<button className="huy btn btn-success rounded-circle"><i className="bi bi-pencil-square"></i></button>*/}
                                    <button className="huy btn btn-danger rounded-circle"
                                            onClick={() => showDeleteModal(t.teacherId)}><i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                        }

                    </>
                    }
                </div>

                <div className="row" style={{marginTop: '20px'}}>
                    <div>
                        <PaginationNav pageNumber={pageNumber}
                                       totalPages={totalPages}
                                       setPageNumber={setPageNumber}/>
                    </div>
                </div>
            </div>

            <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={submitDelete}
                                hideModal={hideConfirmationModal} id={delId} message={deleteMessage}/>
        </>
    )
}



