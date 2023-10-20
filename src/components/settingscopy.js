import React, { useEffect, useRef, useState } from "react";
import { TabMenu } from 'primereact/tabmenu';
import { useStoreActions, useStoreState } from "easy-peasy";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import Department from "./Department";
import Leave from "./Leave";
import Ticket from "./Ticket";
import Plant from "./Plant";
import AllTrainee from "./AllTrainee";
import AddTrainee from "./AddTrainee";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import getHeaders from "../constants/Utils";
import constants from "../constants/constants";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import classNames from "classnames";
const Settings = () => {
    const setActiveIndex = useStoreActions((actions) => actions.tabModel.setActiveIndex);
    const activeIndex = useStoreState((actions) => actions.tabModel.activeIndex);
    const [planData, setPlanData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [planResData, setPlanResData] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        setActiveIndex(0)
    }, []);
    const toast = useRef(null);

    const items = [
        { label: 'Plant' },
        { label: 'Department' },
        { label: 'Add Member' },
        { label: 'View Members' },

    ];
    const footer = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button label="Save" icon="pi pi-check" />
            <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-secondary" />
        </div>
    );
    useEffect(() => {
        setIsLoading(true);
        axios
            .get(constants.URL.ALL_PLANT + 'page=' + pageNo + '&limit=' + pageLimit, {
                headers: getHeaders(),
            })
            .then((resp) => {
                console.log("API Response:", resp.data);
                setPlanData(resp.data.results);
            })
            .catch((e) => {
                console.error("API Error:", e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);
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
    const customItemTemplate = (data) => {
        return (
            <div className="col-12 sm:col-3 lg:col-3 xl:col-3 p-2 ">
                <Toast ref={toast} />
                <div className="p-4 border-1 surface-border surface-card border-round pointCur">
                    <div className="flex flex-column align-items-center gap-3 py-6 posItem" >

                        <div className="flex align-items-center gap-2">

                            <p style={{ fontSize: '1.5rem', fontWeight: '500' }}>{data.name}</p>
                        </div>
                        <div className="flex iconPos ">
                            <i className="pi pi-pencil mx-4 cursor-pointer"></i>
                            <i className="pi pi-trash cursor-pointer"></i>
                        </div>

                    </div>
                </div>

            </div >
        );
    }; return (

        <div className="Trainee-wrapper">
            <div className="card row">
                <div className="iconBox">
                    <div className="col-12 sm:col-3 lg:col-3 xl:col-3 p-2 ">
                        <div className="p-4 border-1 surface-border surface-card border-round pointCur" onClick={() => setVisible(true)}>
                            <div className="flex flex-column align-items-center gap-3 py-6 posItem" >
                                <i class="pi pi-plus-circle cursor-pointer" style={{ fontSize: '2rem' }} ></i>
                                <p className="plantSize">Add Plant</p>
                            </div>
                        </div>
                    </div>
                </div>
                <DataView value={planData} itemTemplate={customItemTemplate} />

            </div>
            <Dialog header="Add" visible={visible} style={{ width: "30vw" }} onHide={() => setVisible(false)}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="error_msg">
                    <div className="field flex flex-column">
                        <label htmlFor="department">
                            Plant
                        </label>
                        <Controller
                            name="name"
                            control={form.control}
                            rules={{ required: "Plant is required." }}
                            render={({ field, fieldState }) => (
                                <InputText id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                            )}
                        />
                        {getFormErrorMessage("department")}
                    </div>

                    <div className="flex justify-content-end mt-5">
                        <Button icon="pi pi-check" size="small" className="AU-save-btn p-button-rounded" loading={isLoading} label="Save" />
                    </div>
                </form>
            </Dialog>
        </div>
    )
}
export default Settings;