
import {Formik, Form, Field, useFormik, ErrorMessage} from 'formik'
import * as approvalTopicService from '../../service/ApprovalTopicService';
import {useParams} from "react-router";
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer, toast} from "react-toastify"
import '../approvalTopic/ListTopicNotApproval.css'
import {storage} from "../../config/firebaseConfig";
import * as Yup from 'yup'
import {useEffect, useState} from "react";

function ListTopicNotApproval() {
    const [topics, setTopics] = useState([])
    const [infoTopicsCancel, setInfoTopicsCancel] = useState([])
    const [infoTopicRegisterCancel, setInfoTopicRegisterCancel] = useState([])
    const [infoTopicsApproval, setInfoTopicsApproval] = useState([])
    const [infoTopicRegisterApproval, setInfoTopicRegisterApproval] = useState([])
    const [topicRegister, setTopicRegister] = useState()
    const [studentList, setStudentList] = useState([])
    // Add these states to your component
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(1); // Adjust the page size according to your backend
    const [totalPages, setTotalPages] = useState(1);
    const [documentUrls, setDocumentUrls] = useState([]);
    const validationSchema = Yup.object().shape({
        topicProcessList: Yup.array().of(
            Yup.object().shape({
                dateStart: Yup.string()
                    .required('Ngày bắt đầu là bắt buộc')
                    .nullable()
                    .test('isValidDateStart', 'Ngày bắt đầu phải bé hơn ngày kết thúc', function (value) {
                        const {dateEnd} = this.parent; // Access dateEnd from the parent object
                        if (value && dateEnd) {
                            return new Date(value) < new Date(dateEnd);
                        }
                        return true;
                    }),
                dateEnd: Yup.string()
                    .required('Ngày kết thúc là bắt buộc')
                    .nullable()
                    .test('isValidDateEnd', 'Ngày kết thúc phải lớn hơn ngày bắt đầu', function (value) {
                        const {dateStart} = this.parent; // Access dateStart from the parent object
                        if (value && dateStart) {
                            return new Date(value) > new Date(dateStart);
                        }
                        return true;
                    }),
            })
        ),
    });
    useEffect(() => {
        const fetchApi = async () => {
            const result = await approvalTopicService.getAllTopicNotApproval(currentPage, pageSize);
            console.log(result);
            if (result) {
                setTopics(result.content);
                setTotalPages(result.totalPages);
            } else {
                setTopics([]);
                setTotalPages(1);
            }
        };
        fetchApi();
    }, [currentPage, pageSize]);
    const fetchDocuments = async () => {
        console.log("fetch document log topics: ", topics);
        try {
            const documentUrls = await Promise.all(topics.map(async (s) => {
                if (s.descriptionURL) {
                    const downloadUrl = await storage.ref(s.descriptionURL).getDownloadURL();
                    return downloadUrl;
                } else {
                    return null;
                }
            }));
            setDocumentUrls(documentUrls);
        } catch (error) {
            console.error("Error fetching documents from Firebase:", error);
        }
    };
    useEffect(() => {
        fetchDocuments();
    }, [topics]);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleApproval = async (item) => {
        console.log(item);
        let arrTopic = [item.topic.name, item.topic.content, item.topic.topicId]
        let arrInfoTopic = [item.infoTopicRegisterId, item.descriptionUrl, item.status, item.statusComplete, item.topicCancel, item.groupAccount.groupAccountId, item.teacher.teacherId]
        let arrStudent = [...item.groupAccount.studentList]
        setTopicRegister(item)
        setInfoTopicsApproval((prevState) => ({...prevState, ...arrTopic}));
        setInfoTopicRegisterApproval((prevState) => ({...prevState, ...arrInfoTopic}));
        setStudentList((prevState) => ([...prevState, ...arrStudent]));
        displayApprovalForm()
    }
    const handleCancel = async (item) => {
        console.log(item);
        let arrTopic = [item.topic.name, item.topic.content, item.topic.topicId]
        let arrInfoTopic = [item.infoTopicRegisterId, item.status, item.topicCancel]
        let arrStudent = [...item.groupAccount.studentList]
        console.log(arrStudent);
        const setInfo = async () => {
            setInfoTopicsCancel((prevState) => ({...prevState, ...arrTopic}));
            setInfoTopicRegisterCancel((prevState) => ({...prevState, ...arrInfoTopic}));
            setStudentList((prevState) => ([...prevState, ...arrStudent]));
        }
        await setInfo()
        displayCancelForm()
    }
    const displayCancelForm = () => {
        var formsApproval = document.getElementsByClassName("approval-form");
        for (var i = 0; i < formsApproval.length; i++) {
            formsApproval[i].style.display = "none";
        }
        var formsCancel = document.getElementsByClassName("cancel-form");
        for (var i = 0; i < formsCancel.length; i++) {
            formsCancel[i].style.display = "none";
        }
        // Hiển thị form cho id tương ứng
        var cancelForm = document.getElementById("cancelForm");
        cancelForm.style.display = "block";
    }
    const displayApprovalForm = () => {
        var formsApproval = document.getElementsByClassName("approval-form");
        for (var i = 0; i < formsApproval.length; i++) {
            formsApproval[i].style.display = "none";
        }
        var formsCancel = document.getElementsByClassName("cancel-form");
        for (var i = 0; i < formsCancel.length; i++) {
            formsCancel[i].style.display = "none";
        }
        // Hiển thị form cho id tương ứng
        var approvalForm = document.getElementById("approvalForm");
        approvalForm.style.display = "block";
    }
    const turnOffFormApproval = () => {
        var approvalForm = document.getElementById("approvalForm");
        approvalForm.style.display = "none";
    }
    const turnOffFormCancel = () => {
        var cancelForm = document.getElementById("cancelForm");
        cancelForm.style.display = "none";
    }
    return topics.length !== 0 ? (
        <>
            <div className="headerTuanHA">
            <h2 className="titleTuanHA">KIỂM DUYỆT ĐỀ TÀI</h2>
            <div className='container'>
                <div className="content">
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-10">
                            <table className="form-table">
                                <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên nhóm</th>
                                    <th>Tên đề tài</th>
                                    <th>Mô tả</th>
                                    <th>Duyệt đề tài</th>
                                    <th>Hủy đề tài</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    topics.map((item, index) => (
                                        <tr key={item.infoTopicRegisterId}>
                                            <td>{index + 1}</td>
                                            <td>{item.groupAccount.name}</td>
                                            <td>{item.topic.name}</td>
                                            <td className='text-center'>
                                                {documentUrls[index] && (
                                                    <a href={documentUrls[index]} target="_blank"
                                                       rel="noopener noreferrer" type='button'
                                                       className="btn-document btn btn-outline-secondary"
                                                       style={{borderRadius: "50%"}}>
                                                        <i className="bi bi-file-earmark-bar-graph"></i>
                                                    </a>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <button className="btn btn-outline-success"
                                                        onClick={(e) => handleApproval(item)}>Duyệt
                                                </button>
                                            </td>
                                            <td className="text-center">
                                                <button className="btn btn-outline-danger"
                                                        onClick={(e) => handleCancel(item)}>Hủy
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                            <div className="pagination">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    Previous
                                </button>
                                <span>{currentPage}</span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                        <div className="col-1"></div>
                    </div>
                </div>
            </div>
            <div id="cancelForm" style={{padding: '20px', maxWidth: '600px', margin: 'auto'}} className="cancel-form">
                <Formik
                    initialValues={{
                        infoTopicRegisterId: infoTopicRegisterCancel[0],
                        status: 0,
                        topicCancel: 0,
                        topicId: infoTopicsCancel[2],
                        studentList: studentList,
                        messageCancel: ''
                    }}
                    enableReinitialize
                    validationSchema={Yup.object({
                        messageCancel: Yup.string().required('Yêu cầu nhập nguyên nhân hủy đề tài!')
                    })}
                    onSubmit={(values) => {
                        console.log(values);
                        const cancel = async () => {
                            await approvalTopicService.cancelTopic(values);
                        };
                        cancel();
                        document.getElementById("cancelForm").style.display = "none";
                        toast(':unicorn_face: Hủy thành công!!!!');
                    }}
                >
                    <div style={{marginTop: '20px'}}>
                        <div style={{border: '1px solid #ccc', borderRadius: '8px', padding: '20px'}}>
                            <div className="row">
                                <div className="col-sm">
                                    <h2 style={{color: '#DC3545', fontWeight: 'bold', marginBottom: '20px'}}>Hủy đề
                                        tài</h2>
                                    <label style={{fontWeight: 'bold', fontSize: '16px'}}>Đề
                                        tài: {infoTopicsCancel[0]}</label>
                                    <br/>
                                    <label style={{fontWeight: 'bold', fontSize: '14px', color: '#555'}}>Mô
                                        tả: {infoTopicsCancel[1]}</label>
                                </div>
                                <div className="col-sm">
                                    <Form>
                                        <div className="form-group">
                                            <div className="col-sm">
                                                <label htmlFor="contentTopic"
                                                       style={{fontWeight: 'bold', fontSize: '14px'}}>Nội dung nguyên
                                                    nhân hủy.</label>
                                                <Field
                                                    className="form-control"
                                                    as="textarea"
                                                    id="contentTopic"
                                                    name="messageCancel"
                                                    style={{minHeight: '100px', resize: 'vertical', marginTop: '8px'}}
                                                ></Field>
                                                <ErrorMessage name='messageCancel' component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '15px'}}>
                                            <button
                                                className="btn btn-secondary mx-2"
                                                type="button"
                                                onClick={turnOffFormCancel}
                                                style={{fontSize: '14px'}}
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                type="submit"
                                                style={{fontSize: '14px'}}
                                            >
                                                Gửi
                                            </button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Formik>
            </div>
            9:10
            <div id='approvalForm' style={{padding: '20px', backgroundColor: '#F8F9FA'}} className='approval-form'>
                <Formik
                    initialValues={{
                        infoTopicRegisterId: infoTopicRegisterApproval[0],
                        topicId: infoTopicsApproval[2],
                        topicProcessList: [
                            {
                                dateStart: '',
                                dateEnd: '',
                                status: 0,
                                processNumber: 1,
                                percentProcess: 0,
                                infoTopicRegister: infoTopicRegisterApproval[0]
                            },
                            {
                                dateStart: '',
                                dateEnd: '',
                                status: 0,
                                processNumber: 2,
                                percentProcess: 0,
                                infoTopicRegister: infoTopicRegisterApproval[0]
                            },
                            {
                                dateStart: '',
                                dateEnd: '',
                                status: 0,
                                processNumber: 3,
                                percentProcess: 0,
                                infoTopicRegister: infoTopicRegisterApproval[0]
                            }
                        ],
                        studentList: studentList,
                    }}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log(values);
                        const approval = async () => {
                            // await approvalTopicService.approvalTopic(values)
                            await approvalTopicService.createProcess(values)
                            document.getElementById("approvalForm").style.display = "none";
                            toast(':unicorn_face: Duyệt thành công!!!!');
                        }
                        approval()
                    }}
                >
                    <div>
                        <div className="card"
                             style={{maxWidth: '800px', margin: 'auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'}}>
                            <div className="row">
                                <div className="col-sm" style={{padding: '20px'}}>
                                    <Form>
                                        <div>
                                            <div>
                                                <div className="row g-2" data-date-format="dd-mm-yyyy">
                                                    <h5 style={{
                                                        fontWeight: 'bold',
                                                        marginBottom: '20px',
                                                        borderBottom: '2px solid #007BFF',
                                                        paddingBottom: '10px'
                                                    }}>Giai đoạn 1</h5>
                                                    <div className="col-sm">
                                                        <label htmlFor="start" style={{fontWeight: 'bold'}}>Ngày bắt
                                                            đầu</label>
                                                        <Field className="form-control"
                                                               name="topicProcessList[0].dateStart" id="start"
                                                               type="date"/>
                                                        <ErrorMessage name='topicProcessList[0].dateStart'
                                                                      component="div" className="text-danger"/>
                                                    </div>
                                                    <div className="col-sm">
                                                        <label htmlFor="end" style={{fontWeight: 'bold'}}>Ngày kết
                                                            thúc</label>
                                                        <Field className="form-control"
                                                               name="topicProcessList[0].dateEnd" id="end" type="date"/>
                                                        <ErrorMessage name='topicProcessList[0].dateEnd' component="div"
                                                                      className="text-danger"/>
                                                    </div>
                                                    <hr style={{margin: '20px 0'}}/>
                                                </div>
                                                <div className="row g-2" data-date-format="dd-mm-yyyy">
                                                    <h5 style={{
                                                        fontWeight: 'bold',
                                                        marginBottom: '20px',
                                                        borderBottom: '2px solid #007BFF',
                                                        paddingBottom: '10px'
                                                    }}>Giai đoạn 2</h5>
                                                    <div className="col-sm">
                                                        <label htmlFor="start" style={{fontWeight: 'bold'}}>Ngày bắt
                                                            đầu</label>
                                                        <Field className="form-control"
                                                               name="topicProcessList[1].dateStart" id="start"
                                                               type="date"/>
                                                        <ErrorMessage name='topicProcessList[1].dateStart'
                                                                      component="div" className="text-danger"/>
                                                    </div>
                                                    <div className="col-sm">
                                                        <label htmlFor="end" style={{fontWeight: 'bold'}}>Ngày kết
                                                            thúc</label>
                                                        <Field className="form-control"
                                                               name="topicProcessList[1].dateEnd" id="end" type="date"/>
                                                        <ErrorMessage name='topicProcessList[1].dateEnd' component="div"
                                                                      className="text-danger"/>
                                                    </div>
                                                    <hr style={{margin: '20px 0'}}/>
                                                </div>
                                                <div className="row g-2" data-date-format="dd-mm-yyyy">
                                                    <h5 style={{
                                                        fontWeight: 'bold',
                                                        marginBottom: '20px',
                                                        borderBottom: '2px solid #007BFF',
                                                        paddingBottom: '10px'
                                                    }}>Giai đoạn 3</h5>
                                                    <div className="col-sm">
                                                        <label htmlFor="start" style={{fontWeight: 'bold'}}>Ngày bắt
                                                            đầu</label>
                                                        <Field className="form-control"
                                                               name="topicProcessList[2].dateStart" id="start"
                                                               type="date"/>
                                                        <ErrorMessage name='topicProcessList[2].dateStart'
                                                                      component="div" className="text-danger"/>
                                                    </div>
                                                    <div className="col-sm">
                                                        <label htmlFor="end" style={{fontWeight: 'bold'}}>Ngày kết
                                                            thúc</label>
                                                        <Field className="form-control"
                                                               name="topicProcessList[2].dateEnd" id="end" type="date"/>
                                                        <ErrorMessage name='topicProcessList[2].dateEnd' component="div"
                                                                      className="text-danger"/>
                                                    </div>
                                                    <hr style={{margin: '20px 0'}}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-grid gap-2">
                                            <button type="button" className="btn btn-outline-secondary">Thêm mới giai
                                                đoạn
                                            </button>
                                            <button type="submit" className="btn btn-success">Duyệt</button>
                                            <button className="btn btn-outline-info" onClick={turnOffFormApproval}>Hủy
                                            </button>
                                        </div>
                                    </Form>
                                </div>
                                <div className="col-sm"
                                     style={{backgroundColor: '#C7F1AE', color: 'black', padding: '20px'}}>
                                    <div>
                                        <h4 style={{fontWeight: 'bold', marginBottom: '20px'}}>Thông tin đề tài</h4>
                                        <p style={{fontWeight: 'bold', marginBottom: '5px'}}>Đề tài:</p>
                                        <p>{infoTopicsApproval[0]}</p>
                                        <p style={{fontWeight: 'bold', marginBottom: '5px'}}>Mô tả:</p>
                                        <p>{infoTopicsApproval[1]}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Formik>
            </div>
            </div>
        </>
    ) : "Tất cả đề tài đã đươc phê duyệt!"
}
export default ListTopicNotApproval
