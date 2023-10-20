import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";
import constants from "../constants/constants";
import { Dropdown } from "primereact/dropdown";
// import Header from "./Header";
import { MultiSelect } from 'primereact/multiselect';
import { useStoreActions, useStoreState } from "easy-peasy";
import { Dialog } from "primereact/dialog";
import getHeaders from "../constants/Utils";

const Plant = () => {
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [planData, setPlanData] = useState([]);
    const [planResData, setPlanResData] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    // const selectedData = useStoreState((state) => state.tabModel.selectedData);
    // // console.log(selectedData);
    const setPlanStoreData = useStoreActions((actions) => actions.tabModel.setPlanStoreData);
    // const planStoreData = useStoreState((state) => state.tabModel.planStoreData);
    useEffect(() => {
        setIsLoading(true);
        axios
            .get(constants.URL.ALL_PLANT + 'page=' + pageNo + '&limit=' + pageLimit, {
                headers: getHeaders(),
            })
            .then((resp) => {
                console.log("API Response:", resp.data);
                setPlanData(resp.data.results);
                setPlanStoreData(resp.data.results)
            })
            .catch((e) => {
                console.error("API Error:", e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [planResData]);


    const onSubmit = (data) => {
        const payload = {
            name: data.name,
            description: 'test234',
        }
        setIsLoading(true);
        axios.post(constants.URL.ADDUNIT, payload, {
            headers: getHeaders(),
        })
            .then((resp) => {
                // console.log(resp.data.results);
                setPlanResData(resp.data.results);
                console.log("data", data)
                toast.current.show({ severity: "success", summary: "Success", detail: "Added Successfully" });
            }).catch((e) => {
                toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                console.error(e);
            }).finally(() => {
                setIsLoading(false);
                setVisible(false)
            })
    }
    const defaultValues = { name: '' }
    // const defaultValues = { name: selectedData ? selectedData?.user_name : "", empId: selectedData ? selectedData?.emp_Id_no : "", mob: selectedData ? selectedData?.mobile_number : "", email: selectedData ? selectedData?.email_address : "", level: selectedData ? selectedData?.department_level?.replace(/^./, selectedData?.department_level[0].toUpperCase()) : "", department: selectedData ? selectedData?.department : "", password: "" };
    const form = useForm({ defaultValues });
    const errors = form.formState.errors;
    const { reset } = form;

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };


    return (
        <>
            {/* <div className="Trainee-wrapper card"> */}
            <div className='w-full'>
                <div className='db-wrapper'>
                    <Toast ref={toast} />
                    <div>
                        <h2 className="details-heading my-3 flex align-items-center justify-content-between">
                            <span>Plant</span>
                            <i class="pi pi-plus-circle cursor-pointer" onClick={() => setVisible(true)}></i>
                        </h2>
                        <div className="p-fluid grid mt-4 boxspace m-0">
                            {planData !== null && planData.map((item) => (
                                <div key={item.id} className="col-12 flex align-items-center justify-content-between">
                                    <div className="col-4">
                                        {item.name}
                                    </div>
                                    <div className="flex align-items-center">
                                        <i className="pi pi-pencil mx-4 cursor-pointer"></i>
                                        <i className="pi pi-trash cursor-pointer"></i>
                                    </div>
                                </div>
                            ))}

                            <div className="SS-line mt-2"></div>
                        </div>
                    </div>

                    <Dialog header="Add" visible={visible} style={{ width: "30vw" }} onHide={() => setVisible(false)}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="error_msg">
                            <div className="field flex flex-column">
                                <label htmlFor="plant">Plant</label>
                                <Controller
                                    name="name"
                                    control={form.control}
                                    rules={{ required: "Plant is required." }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <InputText
                                                id={field.name}
                                                value={field.value}
                                                className={classNames({ "p-invalid": fieldState.error })}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                            {fieldState.error && (
                                                <small className="p-error">{fieldState.error.message}</small>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            <div className="flex justify-content-end mt-5">
                                <Button icon="pi pi-check" size="small" className="AU-save-btn p-button-rounded" loading={isLoading} label="Save" />
                            </div>
                        </form>
                    </Dialog>
                </div>
            </div>
            {/* </div> */}
        </>
    );
};
export default Plant;