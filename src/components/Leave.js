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
import { Dropdown } from "primereact/dropdown";

const Leave = () => {
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [limit, setLimit] = useState("Select");
    const [allowed, setAllowed] = useState("12");
    const [restriction, setRestriction] = useState("No.of.Continuous");
    const setTraineesList = useStoreActions((actions) => actions.tabModel.setTraineesList);
    const traineesList = useStoreState((state) => state.tabModel.traineesList);
    const setActiveIndex = useStoreActions((actions) => actions.tabModel.setActiveIndex);
    const setSelectedData = useStoreActions((actions) => actions.tabModel.setSelectedData);
    const selectedData = useStoreState((state) => state.tabModel.selectedData);

    const {
        register, handleSubmit, formState: { errors }, watch,
        // reset,
    } = useForm();

    const getUser = () => {
        setIsLoading(true);
        axios
            .get(constants.URL.ADD_USER)
            .then((resp) => {
                // setTraineesList(resp.data.results);
            })
            .catch((e) => console.error(e))
            .finally(() => {
                setIsLoading(false);
            });
        setSelectedData()
    }

    const data = [
        {a: "General", b: "Casual Leave"},
        {a: "Medical", b: "Sick Leave"}
    ]

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
            </div>
        );
    };
    const addTemplate = (item) => {
        return (
            <div className="flex align-items-center">
                <i className="pi pi-plus-circle cursor-pointer" onClick={() => setVisible(true)}></i>
            </div>
        );
    };

    const restrictionsTemplate = () => {
        return <InputText value={restriction} onChange={(e) => setRestriction(e.target.value)} className="w-full" />
    };

    const allowedTemplate = () => {
        return <InputText value={allowed} onChange={(e) => setAllowed(e.target.value)} className="w-full" />
    };

    const limitTemplate = () => {
        return <Dropdown value={limit} onChange={(e) => setLimit(e.target.value)} className="w-full" options={limitDropdown} />
    };

    const limitDropdown = ["Month", "Year"]

    return (
        <div>
            <Toast ref={toast} />
            <div className="grid table-demo">
                <div className="col-12">
                    <div className="">
                        <DataTable className='' value={data} responsiveLayout="scroll">
                            <Column field="a" header="Leave Category"></Column>
                            <Column field="b" header="Leave Type"></Column>
                            <Column field="Allowed" header="Allowed" body={allowedTemplate}></Column>
                            <Column field="Limit" header="Limit" body={limitTemplate}></Column>
                            <Column field="Restrictions" header="Restrictions" body={restrictionsTemplate}></Column>
                            <Column header={addTemplate} body={IconBodyTemplate}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <Dialog header="Add" visible={visible} style={{ width: "40vw" }} onHide={() => setVisible(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className="error_msg">
                    <div>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-6">
                                <label htmlFor="name2">Leave Category</label>
                                <Dropdown value={category} onChange={(e) => setCategory(e.target.value)} className="w-full " />
                            </div>

                            <div className="field col-6">
                                <label htmlFor="name2">Leave Type</label>
                                <Dropdown className="w-full" value={type} onChange={(e) => setType(e.target.value)} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-6">
                                <label htmlFor="name2">Allowed</label>
                                <InputText value={category} onChange={(e) => setCategory(e.target.value)} className="w-full " />
                            </div>

                            <div className="field col-6">
                                <label htmlFor="name2">Limit</label>
                                <Dropdown className="w-full" value={type} onChange={(e) => setType(e.target.value)} options={limitDropdown} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-6">
                                <label htmlFor="name2">Restrictions</label>
                                <InputText value={category} onChange={(e) => setCategory(e.target.value)} className="w-full" />
                            </div>
                        </div>
                        <div className="mt-3 flex justify-content-end">
                            <div className="ls-btn-wrapper">
                                <Button label="Save" className="AU-save-btn" />
                            </div>
                        </div>
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default Leave;