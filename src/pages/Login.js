import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useHistory } from "react-router-dom";
import amphe from "../images/BG.png"
import logo from "../images/amphe.png"
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useStoreActions } from "easy-peasy";
import constants from "../constants/constants";
import axios from "axios";
import Footer from "../components/Footer";

const Login = () => {
    let history = useHistory();
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const setUser = useStoreActions((action) => action.loginModel.setUser);


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const {
        register, handleSubmit,
        // reset,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const payload = {
            email: data?.email,
            password: data?.password
        }

        setIsLoading(true);
        axios.post(constants.URL.SIGNIN, payload)
            .then((resp) => {
                setUser(resp?.data?.results)

                goto("/app/defaultnav")
            }).catch((e) => {
                toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                console.error(e);
            }).finally(() => {
                setIsLoading(false);
            })
    }
    const goto = (to) => {
        history.replace(to);
    }

    return (
        <>
            <div className="flex login-wrapper md:flex-row">
                <Toast ref={toast} />
                <div className="md:col-6 col-12 hidden md:flex flex-column align-items-center justify-content-center">
                    <div className="logo w-full leftPos">

                        <img src={amphe} alt="logo" className="ls-logo" />
                    </div>
                </div>
                <div className="flex flex-column justify-content-center align-items-center md:col-6 col-12 ls-right-section">
                    <div className="form-wrapper w-11 sm:w-7">
                        {/* <h1 className="ls-right-heading">Control Center</h1> */}
                        <div className="logopos">  <img src={logo} alt="logo" className="ls-right-heading" /></div>
                        <form onSubmit={handleSubmit(onSubmit)} className="error_msg">
                            <h4 className="l-heading">Login</h4>
                            <div>
                                <div className="field">
                                    <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                                    <InputText id="email" type="text" className="w-full mb-3 custom-input"
                                        defaultValue={""}
                                        {...register("email", {
                                            required: true,
                                        })}
                                    />
                                    {errors?.email?.type === "required" && <p className="p-error">This field is required</p>}
                                </div>

                                <div className="field">
                                    <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                                    <div className="relative">
                                        <InputText id="password" type={showPassword ? "text" : "password"} className="w-full mb-3 custom-input"
                                            defaultValue={""}
                                            {...register("password", {
                                                required: true
                                            })}
                                        />
                                        <span className="absolute eye-icon-position cursor-pointer" onClick={togglePasswordVisibility}>
                                            {showPassword ? (
                                                <i className="pi pi-eye-slash" style={{ color: '#708090', fontSize: "16px" }}></i>
                                            ) : (
                                                <i className="pi pi-eye" style={{ color: '#708090', fontSize: "16px" }}></i>
                                            )}
                                        </span>
                                    </div>

                                    {errors?.password?.type === "required" && <p className="p-error">This field is required</p>}
                                </div>
                                <div className="mt-4">
                                    <Button label="Login" className="w-full ls-btn" />
                                </div>
                                <div className="signup-links mt-3">
                                    <span className="text-600 font-medium line-height-3">Dont have an account?</span>
                                    <span className="end text-600 font-bold" style={{ cursor: 'pointer' }} onClick={() => goto("/sign-up")}>
                                        {" "}
                                        Sign Up
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Footer></Footer></>
    );
};

export default Login;
