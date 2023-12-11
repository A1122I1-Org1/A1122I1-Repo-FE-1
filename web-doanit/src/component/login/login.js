import './login.css';
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as LoginService from "../../service/LoginService";
import logo from '../../assets/images/logo.png';
import {useLocation, useNavigate} from "react-router-dom";
import * as Yup from "yup";
import {toast} from "react-toastify";

export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <div className="login">
            <div className="body">
                <div className="container">
                    <div className="card shadow">
                        <div className="row">
                            <div className="col-6">
                                <div className="item" style={{paddingTop: '30px', paddingRight: 0}}>
                                    <div className="avatar-container">
                                        <img src={logo} alt="Avatar" className="avatar"/>
                                    </div>
                                    {/*<assets src="../assets/logo.png" alt=""/>*/}
                                    <div className="text-item" style={{paddingLeft: '20px'}}>
                                        <h3>ĐỒ ÁN<br/><span>CÔNG NGHỆ THÔNG TIN</span></h3>
                                        <p>Chào mừng bạn tới với trang web của chúng tôi !</p>
                                        <div className="social-icon">
                                            <a href="#"><i className='bx bxl-facebook'></i></a>
                                            <a href="#"><i className='bx bxl-twitter'></i></a>
                                            <a href="#"><i className='bx bxl-youtube'></i></a>
                                            <a href="#"><i className='bx bxl-instagram'></i></a>
                                            <a href="#"><i className='bx bxl-linkedin'></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="login-section">
                                    <div className="form-box login">
                                        <Formik
                                            initialValues={{
                                                userName: '',
                                                password: ''
                                                // rememberPassword:''
                                            }}
                                            validationSchema={Yup.object({
                                                userName: Yup.string().required("Vui lòng nhập tên nguời dùng"),
                                                password: Yup.string().required("Vui lòng nhập mật khẩu"),
                                            })}
                                            onSubmit={async (values) => {
                                                try {
                                                    // debugger;
                                                    await LoginService.login(values);
                                                    toast("Đăng nhập thành công");
                                                    navigate("/");
                                                    // console.log(location.state?.from)
                                                    // const isPreviousLogin = location.state?.from === '/login' || location.state?.from === '/' || !location.state?.from;
                                                    // if (isPreviousLogin) {
                                                    //     navigate('/');
                                                    // } else {
                                                    //     // Nếu không, chuyển hướng đến URL trước đó
                                                    //     navigate(location.state.from);
                                                    // }


                                                } catch (error) {
                                                    const errorMessage = error.response && error.response.status === 401
                                                        ? error.response.data : "Có lỗi xảy ra khi đăng nhập";
                                                    toast(errorMessage);
                                                }
                                            }}>
                                            <div>
                                                <Form>
                                                    <h2>Đăng nhập</h2>
                                                    <div className="input-box">
                                                        <span className="icon"><i className='bx bxs-paint'></i></span>
                                                        <Field name="userName" type="text" id="username"/>
                                                        <label htmlFor="userName">Tên đăng nhập</label>
                                                        <ErrorMessage name="userName" component="span"
                                                                      className="text-danger error-message"/>
                                                    </div>
                                                    <div className="input-box">
                                                        <span className="icon"><i
                                                            className='bx bxs-lock-alt'></i></span>
                                                        <Field name="password" type="password" id="password"/>
                                                        <label htmlFor="password">Mật khẩu</label>
                                                        <ErrorMessage name="password" component="span"
                                                                      className="text-danger error-message"/>
                                                    </div>
                                                    <button type="submit" className="btn btn-outline-success">Đăng nhập
                                                    </button>
                                                </Form>
                                            </div>
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
