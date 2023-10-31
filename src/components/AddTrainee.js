import React from "react";
import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";
import constants from "../constants/constants";
// import Header from "./Header";
import { MultiSelect } from 'primereact/multiselect';
import { useStoreState } from "easy-peasy";
import getHeaders from "../constants/Utils";

const AddUser = () => {
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const selectedData = useStoreState((state) => state.tabModel.selectedData);
    // console.log(selectedData);
    const selectedUnitId = useStoreState((state) => state.tabModel.selectedUnitId);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    function convertToLowerCase(arr) {
        return arr?.map(element => element.toLowerCase());
    }

    const onSubmit = (data) => {
        setIsLoading(true);
        if (selectedData) {
            const payload = {
                user_name: data.name,
                email_address: data.email,
                // password: data.password,
                department: convertToLowerCase(data.department),
                // department_level: '',
                mobile_number: data.mob,
                emp_Id_no: data.empId,
            }
            axios.patch(constants.URL.ADD_USER + "/" + selectedData?._id, payload, {
                headers: getHeaders(),
            })
                .then((resp) => {
                    // console.log(resp);
                    toast.current.show({ severity: "success", summary: "Success", detail: "User Updated Successfully" });
                }).catch((e) => {
                    toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                    console.error(e);
                }).finally(() => {
                    setIsLoading(false);
                })
        } else {
            const payload = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: 'User',
                unit: selectedUnitId,
                active: 'true'
                // department: convertToLowerCase(data.department),
                // // department_level: '',
                // mobile_number: data.mob,
                // emp_Id_no: data.empId,
            }
            axios.post(constants.URL.ADD_USER, payload, {
                headers: getHeaders(),
            })
                .then((resp) => {
                    // console.log(resp);
                    reset()
                    toast.current.show({ severity: "success", summary: "Success", detail: "User Addded Successfully" });
                }).catch((e) => {
                    toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                    console.error(e);
                }).finally(() => {
                    setIsLoading(false);
                })
        }
    };

    const defaultValues = { name: selectedData ? selectedData?.user_name : "", empId: selectedData ? selectedData?.emp_Id_no : "", mob: selectedData ? selectedData?.mobile_number : "", email: selectedData ? selectedData?.email_address : "", level: selectedData ? selectedData?.department_level?.replace(/^./, selectedData?.department_level[0].toUpperCase()) : "", department: selectedData ? selectedData?.department : "", password: "" };
    const form = useForm({ defaultValues });
    const errors = form.formState.errors;
    const { reset } = form;

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    const dropdownItemDept = [];


    return (
        <>
            <div className='w-full'>
                <div className='db-wrapper'>
                    <Toast ref={toast} />
                    <form onSubmit={form.handleSubmit(onSubmit)} className="error_msg">

                        <h2 className="details-heading my-3 flex align-items-center justify-content-between">
                            <span>Basic Details</span></h2>
                        <div className="p-fluid formgrid grid mt-4">
                            {/* <div className="field col-12 md:col-4 lg:col-3">
                                <label htmlFor="plant">
                                    Plant<span className="p-error">*</span>
                                </label>
                                <Controller
                                    name="plant"
                                    control={form.control}
                                    rules={{ required: "Plant is required." }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />

                                    )}
                                />
                                {getFormErrorMessage("name")}
                            </div> */}
                            <div className="field col-12 md:col-4 lg:col-3">
                                <label htmlFor="name">
                                    User Name<span className="p-error">*</span>
                                </label>
                                <Controller
                                    name="name"
                                    control={form.control}
                                    rules={{ required: "User Name is required." }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />

                                    )}
                                />
                                {getFormErrorMessage("name")}
                            </div>
                            {/* <div className="field col-12 md:col-4 lg:col-3">
                                <label htmlFor="empId">
                                    Employee ID<span className="p-error">*</span>
                                </label>
                                <Controller
                                    name="empId"
                                    control={form.control}
                                    // rules={{ required: "Employee ID is required." }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                    )}
                                />
                                {getFormErrorMessage("empId")}
                            </div> */}
                            {/* <div className="field col-12 md:col-4 lg:col-3">
                                <label htmlFor="mob">
                                    Mobile Number<span className="p-error">*</span>
                                </label>
                                <Controller
                                    name="mob"
                                    control={form.control}
                                    rules={{
                                        // required: "Mobile Number is required.",
                                        validate: (value) => {
                                            if (value && value.length < 10) {
                                                return "Mobile Number must be at least 10 digits.";
                                            }
                                            return true;
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText keyfilter={/^[0-9]+$/} maxLength={10} id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                    )}
                                />
                                {getFormErrorMessage("mob")}
                            </div> */}
                            <div className="field col-12 md:col-4 lg:col-3">
                                <label htmlFor="email">
                                    Email Id<span className="p-error">*</span>
                                </label>
                                <Controller
                                    name="email"
                                    control={form.control}
                                    rules={{
                                        required: "Email Id is required.",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address.",
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                    )}
                                />
                                {getFormErrorMessage("email")}
                            </div>
                            <div className="field col-12 md:col-4 lg:col-3">
                                <label htmlFor="password">
                                    Password<span className="p-error">*</span>
                                </label>
                                {selectedData ?
                                    <Controller
                                        name="password"
                                        control={form.control}
                                        // rules={{ required: "Password is required." }}
                                        render={({ field, fieldState }) => (
                                            <div className="relative">
                                                <InputText disabled id="password" type={showPassword ? "text" : "password"} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                                <span className="absolute eye-icon-position cursor-pointer" onClick={togglePasswordVisibility}>
                                                    {showPassword ? (
                                                        <i className="pi pi-eye-slash" style={{ color: '#708090', fontSize: "16px" }}></i>
                                                    ) : (
                                                        <i className="pi pi-eye" style={{ color: '#708090', fontSize: "16px" }}></i>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    />
                                    :
                                    <Controller
                                        name="password"
                                        control={form.control}
                                        rules={{ required: "Password is required." }}
                                        render={({ field, fieldState }) => (
                                            <div className="relative">
                                                <InputText id="password" type={showPassword ? "text" : "password"} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                                <span className="absolute eye-icon-position cursor-pointer" onClick={togglePasswordVisibility}>
                                                    {showPassword ? (
                                                        <i className="pi pi-eye-slash" style={{ color: '#708090', fontSize: "16px" }}></i>
                                                    ) : (
                                                        <i className="pi pi-eye" style={{ color: '#708090', fontSize: "16px" }}></i>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    />
                                }
                                {getFormErrorMessage("password")}
                            </div>
                            {/* <div className="field col-12 md:col-4 lg:col-3">
                                <label htmlFor="department">
                                    Department
                                </label>
                                <Controller
                                    name="department"
                                    control={form.control}
                                    rules={{ required: "Department is required." }}
                                    render={({ field, fieldState }) => (
                                        <MultiSelect id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} options={dropdownItemDept} />
                                    )}
                                />
                                {getFormErrorMessage("department")}
                            </div> */}
                            {/* <div className="field col-12 md:col-4 lg:col-3">
                                <label htmlFor="level">
                                    Department Leve
                                </label>
                                <Controller
                                    name="level"
                                    control={form.control}
                                    rules={{ required: "Department Level is required." }}
                                    render={({ field, fieldState }) => (
                                        <Dropdown id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} options={dropdownItemLevel} />
                                    )}
                                />
                                {getFormErrorMessage("level")}
                            </div> */}
                        </div>

                        <div className="flex justify-content-end mt-5" style={{ marginRight: '1.2rem' }}>
                            <Button size="small" className="AU-save-btn p-button-rounded" loading={isLoading} label="Save" />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
export default AddUser;