import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import constants from "../constants/constants";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import getHeaders from "../constants/Utils";

const AllTrainee = () => {
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const setTraineesList = useStoreActions((actions) => actions.tabModel.setTraineesList);
    const traineesList = useStoreState((state) => state.tabModel.traineesList);
    const setActiveIndex = useStoreActions((actions) => actions.tabModel.setActiveIndex);
    const setSelectedData = useStoreActions((actions) => actions.tabModel.setSelectedData);
    const selectedData = useStoreState((state) => state.tabModel.selectedData);
    const selectedUnitId = useStoreState((state) => state.tabModel.selectedUnitId);
    const [pageNo, setPageNo] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const {
        register, handleSubmit, formState: { errors }, watch,
        // reset,
    } = useForm();

    const getUser = () => {
        setIsLoading(true);
        axios
            .get(constants.URL.ALL_Depart_USER + selectedUnitId + "?sort_by=email&page=" + pageNo + '&limit=' + pageLimit, {
                headers: getHeaders(),
            })
            .then((resp) => {
                setTraineesList(resp.data.results);
            })
            .catch((e) => console.error(e))
            .finally(() => {
                setIsLoading(false);
            });
        setSelectedData()
    }

    useEffect(() => {
        getUser()
    }, []);

    const handleDelete = (item) => {
        console.log(item);
        setIsLoading(true);
        axios
            .delete(constants.URL.ADD_USER + "/" + item?._id)
            .then((resp) => {
                // console.log(resp);
                getUser()
                toast.current.show({ severity: "success", summary: "Success", detail: "User Deleted successfully" });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.error });
                console.error(e)
            })
            .finally(() => {
                setIsLoading(false);
            });
    }


    const handleUpdate = (item) => {
        // setVisible(true)
        setActiveIndex(1)
        setSelectedData(item)
    }

    const handleResetPassword = (item) => {
        setVisible(true)
        setSelectedData(item)
    }

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const togglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };

    const password = watch("password");
    const handlePrevios = () => {
        if (pageNo > 1) {
            setPageNo(pageNo - 1);
        }
    };

    const handleNext = () => {
        setPageNo(pageNo + 1);
    };
    const onSubmit = (data) => {
        const payload = {
            password: data?.password,
        }

        setIsLoading(true);
        axios.patch(constants.URL.ADD_USER + "/" + selectedData?._id, payload)
            .then((resp) => {
                // console.log(resp);
                toast.current.show({ severity: "success", summary: "Success", detail: "Password changed successfully" });
                setVisible(false)
            }).catch((e) => {
                toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.error });
                console.error(e);
            }).finally(() => {
                setIsLoading(false);
            })
    }

    const IconBodyTemplate = (item) => {
        return (
            <div className="flex align-items-center">
                <i className="pi pi-pencil mr-5 cursor-pointer" onClick={() => handleUpdate(item)}></i>
                <i className="pi pi-refresh mr-5 cursor-pointer" onClick={() => handleResetPassword(item)}></i>
                <i class="pi pi-trash cursor-pointer" onClick={() => handleDelete(item)}></i>
            </div>
        );
    };


    const formatDepartments = (departmentArray) => {
        return departmentArray.join(', ');
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="grid table-demo">
                <div className="col-12">
                    <div style={{ marginTop: '1rem' }}>
                        <DataTable value={traineesList} responsiveLayout="scroll" >
                            <Column field="name" header="Name"></Column>
                            {/* <Column field="emp_Id_no" header="Employee ID"></Column> */}
                            <Column field="email" header="Email ID" style={{ minWidth: '15rem' }}></Column>
                            {/* <Column field="Deparment" header="Deparment" style={{ minWidth: '15rem' }}></Column> */}
                            {/* <Column field="mobile_number" header="Mobile Number" style={{ minWidth: '12rem' }}></Column>
                            <Column field="department" header="Departments" style={{ maxWidth: '20rem' }} body={(rowData) => formatDepartments(rowData.department)}></Column>
                            <Column field="department_level" header="Department Level" style={{ minWidth: '12rem' }}></Column>
                            <Column header="" body={IconBodyTemplate}></Column> */}
                        </DataTable>
                    </div>
                </div>
                {traineesList.length > 0 && (
                    <div className="btnPos" style={{ width: '100%' }}>
                        <Button size="small" className=" w-max prevBtn" label="Previos" onClick={handlePrevios} />
                        <Button size="small" className=" w-max nextBtn ml-4" label="Next" onClick={handleNext} />
                    </div>
                )}
            </div>
            <Dialog header="Reset Password" visible={visible} style={{ width: "40vw" }} onHide={() => setVisible(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className="error_msg">
                    <div>
                        <div className="field">
                            <label htmlFor="password" className="block text-900 font-medium mb-2">New Password</label>
                            <div className="relative">
                                <InputText id="password" className="w-full" type={showPassword ? "text" : "password"}
                                    defaultValue={""}
                                    {...register("password", {
                                        required: true,
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

                        <div className="field mb-2 mt-1">
                            <label htmlFor="confirmPassword" className="block text-900 font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <InputText id="confirmPassword" type={showPassword1 ? "text" : "password"} className="w-full"
                                    defaultValue={""}
                                    {...register("confirmPassword", {
                                        required: true,
                                        validate: (value) => value === password, // Validate if the value matches the password field
                                    })}
                                />
                                <span className="absolute eye-icon-position cursor-pointer" onClick={togglePasswordVisibility1}>
                                    {showPassword1 ? (
                                        <i className="pi pi-eye-slash" style={{ color: '#708090', fontSize: "16px" }}></i>
                                    ) : (
                                        <i className="pi pi-eye" style={{ color: '#708090', fontSize: "16px" }}></i>
                                    )}
                                </span>
                            </div>

                            {errors?.confirmPassword?.type === "required" && <p className="p-error">This field is required</p>}
                            {errors.confirmPassword?.type === "validate" && (
                                <p className="p-error">Passwords do not match</p>
                            )}
                        </div>
                        <div className="mt-3 flex justify-content-center">
                            <div className="ls-btn-wrapper">
                                <Button label="Update" className="AU-save-btn" />
                            </div>
                        </div>
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default AllTrainee;