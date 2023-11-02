import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useHistory } from "react-router-dom";
import amphe from "../images/BG.png"
import logo from "../images/amphe.png"
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import constants from "../constants/constants";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import TermsModal from "./TermsModal "
import { useStoreState } from "easy-peasy";
import Footer from "../components/Footer";
import { Checkbox } from "primereact/checkbox";

const SignIn = () => {
    let history = useHistory();
    const toast = useRef(null);
    const [checked, setChecked] = useState(false);
    const [visible, setVisible] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsStatus, setTermsStatus] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleCheckboxChange = (e) => {
        setChecked(e.target.checked);

        if (e.target.checked) {
            setShowTermsModal(true);
        } else {
            setShowTermsModal(false);
        }
    };

    const handleCancel = () => {
        setChecked(false);
        onClose();
        setTermsStatus(false);
    }
    const handleYes = () => {
        setTermsStatus(true);
        onClose();
    }

    const onClose = () => {
        setShowTermsModal(false)
    }
    const goto = (to) => {
        history.replace(to);
    }

    const [signUpResp, setSignUpResp] = useState();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        if (!data.agreeToTerms || !termsStatus) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please agree to the Terms and Conditions" });
            return;
        }



        // const websiteUrl = new URL(data.websiteUrl);
        // const websiteDomain = websiteUrl.searchParams.get("domain") || websiteUrl.hostname;
        // const emailDomain = data.email.split("@")[1];
        // // alert("");
        // // if (emailDomain.endsWith(websiteDomain)) {

        if (data.agreeToTerms && termsStatus) {
            const payload = {
                organization: {
                    name: data.orgname,
                    website: data.website,
                    // domains: [websiteDomain],

                    country: data.country,
                    city: data.city,
                    timezone: "Asia/Kolkata",
                },
                user: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    terms_agreed: termsStatus,
                    // mobile_no: data.mobNumber,
                },
            };
            console.log('payload', payload);

            setIsLoading(true);
            axios
                .post(constants.URL.SIGNUP, payload)
                .then((resp) => {
                    console.log(resp.data.results);
                    setSignUpResp(resp.data.results);
                    // setVisible(true);
                    goto("/")
                })
                .catch((e) => {
                    console.error(e);
                    toast.current.show({ severity: "error", summary: "Error", detail: e.response.data.message });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
        // } else {
        //     toast.current.show({ severity: "error", summary: "Error", detail: "Website url and mail id is not same" });
        // }
    };

    const gotoSignIn = (to) => {
        history.replace(to);
    };



    const handleOTP = () => {
        // alert("hai")
        const payload = {
            id: signUpResp?.otp?._id,
            otp_code: "123456",
        };
        axios
            .post(constants.URL.VERIFY_OTP, payload)
            .then((resp) => {
                console.log(resp.data.results);
                toast.current.show({ severity: "success", summary: "Success", detail: "Success" });
                gotoSignIn("/");
            })
            .catch((e) => {
                console.error(e);
                toast.current.show({ severity: "error", summary: "Error", detail: "OTP Verification Failed" });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="coloumn">
            <div className="flex login-wrapper md:flex-row">
                <Toast ref={toast} />
                <div className="md:col-6 col-12 hidden md:flex flex-column align-items-center justify-content-center">
                    <div className="logo w-full leftPos">

                        <img src={amphe} alt="logo" className="ls-logo" />
                    </div>
                </div>
                <div className="flex flex-column align-self-start justify-content-center align-items-center md:col-6 col-12 ls-right-section">
                    <div className="form-wrapper w-11 sm:w-7">
                        {/* <h1 className="ls-right-heading">Control Center</h1> */}
                        {/* <img src={logo} alt="logo" className="ls-right-heading" /> */}
                        <div className="logopos" style={{ marginTop: '30px', marginBottom: '3.1rem' }}>  <img src={logo} alt="logo" className="ls-heading" /></div>

                        {/* <form onSubmit={handleSubmit(onSubmit)} className="error_msg"> */}
                        <h4 className="l-heading">Sign Up</h4>

                        <form onSubmit={handleSubmit(onSubmit)} className="error_msg">
                            {/* <h5 className="formTitle">Organization</h5> */}
                            <div className="p-fluid  grid" style={{ padding: '0px !important' }}>
                                <div className="field col-12 md:col-6 msgerror">
                                    <label htmlFor="orgname">
                                        Organization Name<span className="p-error">*</span>
                                    </label>
                                    <InputText
                                        type="text"
                                        {...register("orgname", {
                                            required: true,
                                            maxLength: 20, // set the maximum length to 20 characters
                                            pattern: /^[A-Za-z]+$/,
                                        })}
                                    />
                                    {errors?.orgname?.type === "required" && <p>This field is required</p>}
                                    {errors?.orgname?.type === "maxLength" && <p>The name cannot be longer than 20 characters</p>}
                                    {errors?.orgname?.type === "pattern" && <p>Only letters are allowed</p>}
                                </div>
                                <div className="field col-12 md:col-6 msgerror">
                                    <label htmlFor="wesite">
                                        Website Url<span className="p-error">*</span>
                                    </label>
                                    <InputText
                                        {...register("website", {
                                            required: true,
                                            pattern: /^((https?|ftp):\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i,
                                            maxLength: 20, // set the maximum length to 20 characters
                                            message: "Please enter a valid URL",
                                        })}
                                    />
                                    {errors?.website?.type === "required" && <p>This field is required</p>}
                                    {errors.website?.type === "pattern" && <p>Please enter a valid URL</p>}
                                </div>
                                <div className="field col-12 md:col-6 msgerror">
                                    <label htmlFor="country">
                                        Country<span className="p-error">*</span>
                                    </label>
                                    <InputText
                                        type="text"
                                        {...register("country", {
                                            required: true,
                                            maxLength: 20, // set the maximum length to 20 characters
                                            pattern: /^[A-Za-z]+$/,
                                        })}
                                    />
                                    {errors?.country?.type === "required" && <p>This field is required</p>}
                                    {errors?.country?.type === "maxLength" && <p>The country name cannot be longer than 20 characters</p>}
                                    {errors?.country?.type === "pattern" && <p>Only letters are allowed</p>}
                                </div>
                                <div className="field col-12 md:col-6 msgerror">
                                    <label htmlFor="city">
                                        City<span className="p-error">*</span>
                                    </label>
                                    <InputText
                                        type="text"
                                        {...register("city", {
                                            required: true,
                                            maxLength: 20, // set the maximum length to 20 characters
                                            pattern: /^[A-Za-z]+$/,
                                        })}
                                    />
                                    {errors?.city?.type === "required" && <p>This field is required</p>}
                                    {errors?.city?.type === "maxLength" && <p>The city name cannot be longer than 20 characters</p>}
                                    {errors?.city?.type === "pattern" && <p>Only letters are allowed</p>}
                                </div>

                            </div>

                            {/* <h5 className="formTitle">Personal Details</h5> */}
                            <div className="p-fluid  grid" style={{ padding: '0px !important' }}>
                                <div className="field col-12 md:col-6 msgerror">
                                    <label htmlFor="name1">
                                        User Name<span className="p-error">*</span>
                                    </label>
                                    <InputText
                                        id="firstname2"
                                        type="text"
                                        {...register("name", {
                                            required: true,
                                            maxLength: 15, // set the maximum length to 15 characters
                                            pattern: /^[A-Za-z]+$/,
                                        })}
                                    />
                                    {errors?.name?.type === "required" && <p>This field is required</p>}
                                    {errors?.name?.type === "maxLength" && <p>The name cannot be longer than 15 characters</p>}
                                    {errors?.name?.type === "pattern" && <p>Only letters are allowed</p>}
                                </div>
                                {/* <div className="field col-12 md:col-6">
                                    <label htmlFor="lastname2">
                                        Lastname<span className="p-error">*</span>
                                    </label>
                                    <InputText
                                        id="lastname2"
                                        type="text"
                                        {...register("lastName", {
                                            required: true,
                                            maxLength: 15, // set the maximum length to 15 characters
                                            pattern: /^[A-Za-z]+$/,
                                        })}
                                    />
                                    {errors?.lastName?.type === "required" && <p>This field is required</p>}
                                    {errors?.lastName?.type === "maxLength" && <p>The name cannot be longer than 15 characters</p>}
                                    {errors?.lastName?.type === "pattern" && <p>Only letters are allowed</p>}
                                </div> */}
                                <div className="field col-12 md:col-6 msgerror">
                                    <label htmlFor="BusinessEmail">
                                        Business Email Id<span className="p-error">*</span>
                                    </label>
                                    <InputText
                                        id="BusinessEmail"
                                        type="text"
                                        {...register("email", {
                                            required: true,
                                            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            maxLength: 30, // set the maximum length to 20 characters
                                            message: "Please enter a valid email address",
                                        })}
                                    />
                                    {errors.email && errors.email.type === "required" && <p>This field is required</p>}
                                    {errors?.email?.type === "maxLength" && <p>The email address cannot be longer than 30 characters</p>}
                                    {errors.email && errors.email.type === "pattern" && <p>Please enter a valid email address</p>}
                                </div>

                                <div className="field col-12 md:col-6 msgerror">
                                    <label htmlFor="password">
                                        Password<span className="p-error">*</span>
                                    </label>
                                    <div className="password-input-wrapper" style={{ background: "#ffffff", display: "flex" }}>
                                        <InputText
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            {...register("password", {
                                                required: true,
                                                minLength: 8, // set minimum password length to 8 characters
                                                maxLength: 20, // set maximum password length to 20 characters
                                                // pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/, // include at least one lowercase letter, one uppercase letter, and one digit
                                            })}
                                        />

                                        <Button type="button" className="eybtn" onClick={togglePasswordVisibility} icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"} />
                                    </div>
                                    {errors?.password?.type === "required" && <p>This field is required</p>}
                                    {errors?.password?.type === "minLength" && <p>Password should be at least 8 characters long</p>}
                                    {errors?.password?.type === "maxLength" && <p>Password should not exceed 20 characters</p>}
                                    {errors?.password?.type === "pattern" && <p>Password should include at least one lowercase letter, one uppercase letter, and one digit</p>}
                                </div>

                                {/* <div className="field col-12 md:col-6">
                                    <label htmlFor="lastname2">
                                        Phone Number<span className="p-error">*</span>
                                    </label>
                                    <InputText
                                        id="lastname2"
                                        type="text"
                                        {...register("mobNumber", {
                                            required: true,
                                            pattern: {
                                                value: /^\d{10}$/, // regex pattern to match 10 digit phone numbers
                                                message: "Invalid phone number format",
                                            },
                                        })}
                                    />
                                    {errors?.mobNumber?.type === "required" && <p>This field is required</p>}
                                    {errors?.mobNumber?.type === "pattern" && <p>{errors.mobNumber.message}</p>}
                                </div> */}
                                <div className="field col-12 md:col-12 checkPos">
                                    <label style={{ display: 'flex', alignItems: 'center' }}>
                                        {/* <Checkbox onChange={handleCheckboxChange} {...register("agreeToTerms")} checked={checked}></Checkbox> */}

                                        <input type="checkbox" {...register("agreeToTerms")} onChange={handleCheckboxChange} checked={checked} />
                                        <span style={{ marginLeft: '2px' }}>
                                            I accept the
                                            <span> Privacy Policy</span>
                                            <span> and the</span>
                                            <span> Terms of Service</span>
                                        </span>                                </label>
                                    {errors?.agreeToTerms?.type === "required" && <p>You must accept the Privacy Policy,Terms and Conditions</p>}
                                </div>
                                {/* <TermsModal visible={showTermsModal} onClose={() => setShowTermsModal(false)} /> */}

                                <Dialog header="Privacy Policy & Terms of Service" visible={showTermsModal} onHide={handleCancel} style={{ width: "80vw" }}>
                                    <div className="custom-modal-content">
                                        <iframe
                                            className="custom-iframe"
                                            src="https://policies.razolve.com/terms-privacy-policy.html"
                                            title="External Content"
                                        />

                                    </div>
                                    <div className="flex justify-content-end">
                                        <Button size="small" className="AU-save-btn p-button-rounded ml-3" onClick={handleCancel} label="Cancel" />
                                        <Button size="small" className="AU-save-btn p-button-rounded ml-3" onClick={handleYes} label="Yes" />
                                    </div>
                                </Dialog></div>


                            <Button label="Create Account" className="w-full ls-btn mt-1" />
                            <Dialog header="Verify Your Email" visible={visible} style={{ width: "40vw", fontSize: "35px" }} onHide={() => setVisible(false)}>
                                <p className="parag">
                                    We send to the e-mail <span className="mail">{signUpResp?.user?.email}</span>
                                </p>
                                <div className="verify-input1">
                                    <InputText keyfilter="int" className="verify-input" minLength={1} maxLength={1} />
                                    <InputText keyfilter="int" className="verify-input" minLength={1} maxLength={1} />
                                    <InputText keyfilter="int" className="verify-input" minLength={1} maxLength={1} />
                                    <InputText keyfilter="int" className="verify-input" minLength={1} maxLength={1} />
                                    <InputText keyfilter="int" className="verify-input" minLength={1} maxLength={1} />
                                    <InputText keyfilter="int" className="verify-input" minLength={1} maxLength={1} />
                                </div>
                                <Button className="verify_btn" label="Verify Code" onClick={handleOTP} />
                                {/* <p className="read">Resend Otp</p> */}
                            </Dialog>
                            <div className="signup-links mt-3 mb-4">
                                <span className="text-600 font-medium line-height-3">Already have an account?</span>
                                <span className="text-600 font-bold" style={{ cursor: 'pointer' }} onClick={() => gotoSignIn("/")}>
                                    {" "}
                                    Login
                                </span>
                            </div>
                        </form>

                    </div>
                </div >

            </div >
            <Footer></Footer>
        </div >
    );
};

export default SignIn;
