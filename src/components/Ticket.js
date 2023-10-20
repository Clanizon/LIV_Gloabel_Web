import React from "react";
import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { Calendar } from "primereact/calendar";
import axios from "axios";
import constants from "../constants/constants";
import { Dropdown } from "primereact/dropdown";
// import Header from "./Header";
import { MultiSelect } from 'primereact/multiselect';
import { useStoreState } from "easy-peasy";

const Ticket = () => {
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const selectedData = useStoreState((state) => state.tabModel.selectedData);
    // console.log(selectedData);

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
                department_level: data.level.toLowerCase(),
                mobile_number: data.mob,
                emp_Id_no: data.empId,
            }
            axios.patch(constants.URL.ADD_USER + "/" + selectedData?._id, payload)
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
                user_name: data.name,
                email_address: data.email,
                password: data.password,
                department: convertToLowerCase(data.department),
                department_level: data.level.toLowerCase(),
                mobile_number: data.mob,
                emp_Id_no: data.empId,
            }
            axios.post(constants.URL.ADD_USER, payload)
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

    const dropdownItemDept = ['Guna', ];

    const dropdownItemLevel = ['a', 'b', 'c', 'd', 'e']

    return (
        <>
            <div className='w-full'>
                <div className='db-wrapper'>
                    <Toast ref={toast} />
                        <h2 className="details-heading my-3">Restriction</h2>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="error_msg">
                        <div className="p-fluid formgrid grid mt-4">
                            <div className="field col-12 md:col-4 lg:col-3">
                                <label htmlFor="name">
                                No.of. Days for Escalation<span className="p-error">*</span>
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
                            <div className="field col-12 md:col-4 lg:col-3">
                                <label htmlFor="empId">
                                Configure  Level User<span className="p-error">*</span>
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
                            </div>
                        </div>
                            
                        <h2 className="details-heading my-3">Department</h2>
                        <div className="p-fluid formgrid grid mt-4">
                            <div className="field col-12 md:col-4 lg:col-3">
                                <label htmlFor="department">
                                Human Resource
                                </label>
                                <Controller
                                    name="department"
                                    control={form.control}
                                    rules={{ required: "Department is required." }}
                                    render={({ field, fieldState }) => (
                                        <Dropdown id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} options={dropdownItemDept} />
                                    )}
                                />
                                {getFormErrorMessage("department")}
                            </div>
                            <div className="field col-12 md:col-4 lg:col-3">
                                <label htmlFor="level">
                                Finance
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
                            </div>
                        </div>

                        <div className="flex justify-content-end mt-5">
                            <Button icon="pi pi-check" size="small" className="AU-save-btn p-button-rounded" loading={isLoading} label="Save" />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
export default Ticket;