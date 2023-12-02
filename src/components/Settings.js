import React, { useEffect, useRef, useState } from "react";
import { TabMenu } from 'primereact/tabmenu';
import { useStoreActions, useStoreState } from "easy-peasy";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import getHeaders from "../constants/Utils";
import constants from "../constants/constants";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import classNames from "classnames";
import SettingTab from "./SettingTab";
import deleteicon from '../images/trash.svg';
import addicon from '../images/Plus-Circle.svg';
import pencil from '../images/Pencil.svg';
import backarrow from '../images/back_arrow_svg.svg';
const Settings = () => {
    const setActiveIndex = useStoreActions((actions) => actions.tabModel.setActiveIndex);
    const setSelectedUnitId = useStoreActions((actions) => actions.tabModel.setSelectedUnitId);
    const [planData, setPlanData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [planResData, setPlanResData] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [pageLimit, setPageLimit] = useState(100);
    const [visible, setVisible] = useState(false);
    const [showTabComponent, setShowTabComponent] = useState(false);
    const toast = useRef(null);
    const [refresh, setRefresh] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState('');
    const [selectedItemId, setSelectedItemId] = useState('');

    useEffect(() => {
        setActiveIndex(0)
    }, []);

    const handleCardClick = (id) => {
        setSelectedUnitId(id);
        setShowTabComponent(true);
    };
    const handlePrevios = () => {
        if (pageNo > 1) {
            setPageNo(pageNo - 1);
        }
    };

    const handleNext = () => {
        setPageNo(pageNo + 1);
    };
    useEffect(() => {
        setIsLoading(true);
        axios
            .get(constants.URL.ALL_PLANT + 'page=' + pageNo + '&limit=' + pageLimit, {
                headers: getHeaders(),
            })
            .then((resp) => {

                const newData = [
                    {
                        id: 'add-plant',
                        name: 'Add Plant',
                        icon: 'pi pi-plus-circle',
                    },
                    ...resp.data.results,
                ];
                setPlanData(newData);

            })
            .catch((e) => {
                console.error("API Error:", e);
            })
            .finally(() => {
                setIsLoading(false);
                setRefresh(false);
            });
    }, [planResData, refresh, selectedItemId]);
    const onSubmit = (data) => {
        setIsLoading(true);
        const payload = {
            name: data.name,
            description: 'dummy',
        };

        if (selectedItemId) {

            axios.patch(constants.URL.ADDUNIT + "/" + selectedItemId, payload, {
                headers: getHeaders(),
            })
                .then((resp) => {

                    if (toast.current) {
                        toast.current.show({ severity: "success", summary: "Success", detail: "Item updated successfully" });
                    }
                    setSelectedItemId('');
                    form.reset();
                    setVisible(false);
                    setRefresh(true);


                })
                .catch((e) => {

                    if (toast.current) {
                        toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                    }
                    console.error(e);
                })
                .finally(() => {
                    setIsLoading(false);
                    setSelectedItemId('');
                });
        } else {

            axios.post(constants.URL.ADDUNIT, payload, {
                headers: getHeaders(),
            })
                .then((resp) => {

                    setPlanResData(resp.data.results);
                    form.reset();
                    setVisible(false);
                    if (toast.current) {
                        toast.current.show({ severity: "success", summary: "Success", detail: "Added Successfully" });
                    }
                })
                .catch((e) => {
                    if (toast.current) {
                        toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                    }
                    console.error(e);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const defaultValues = { name: '' }
    // const defaultValues = { name: selectedData ? selectedData?.user_name : "", empId: selectedData ? selectedData?.emp_Id_no : "", mob: selectedData ? selectedData?.mobile_number : "", email: selectedData ? selectedData?.email_address : "", level: selectedData ? selectedData?.department_level?.replace(/^./, selectedData?.department_level[0].toUpperCase()) : "", department: selectedData ? selectedData?.department : "", password: "" };
    const form = useForm({ defaultValues });
    const errors = form.formState.errors;
    const { reset } = form;
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const handleDelete = (id) => {
        setConfirmationVisible(true);
        setItemIdToDelete(id);
    }
    const handleDeleteConfirmed = (id) => {

        axios.delete(constants.URL.ADDUNIT + "/" + id, {
            headers: getHeaders(),
        })
            .then((resp) => {
                if (toast.current) {
                    toast.current.show({ severity: "success", summary: "Success", detail: "Item deleted successfully" });
                }
                setRefresh(true);
            })
            .catch((e) => {
                setRefresh(true);
                if (toast.current) {
                    toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                }
            });
    }

    const handleEdit = (id, name) => {
        setSelectedItemId(id);
        form.setValue('name', name);
        // setSomeOtherStateVariable(name);
        setVisible(true);
    };
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };
    const customItemTemplate = (data) => {
        if (data.id === 'add-plant') {
            return (
                <div className="col-12 sm:col-3 lg:col-3 xl:col-3 p-2 ">
                    <div className="pointCur" onClick={() => setVisible(true)}>
                        <div className="flex align-items-center gap-3 posItem">
                            <p className="plantSize">{data.name}</p>
                            {/* <i className={data.icon + ' cursor-pointer'} style={{ fontSize: '2rem' }}></i> */}

                            <img src={addicon} alt="addicon" className="iconSize" />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="col-12 sm:col-3 lg:col-3 xl:col-3 p-2 boxCard ">
                <Toast ref={toast} />
                <div className="pointCur" onClick={() => handleCardClick(data._id)}>
                    <div className="flex align-items-center gap-3 posItem1">
                        <p className='plantSize'>{data.name}</p>
                        <div className="flex">
                            <img src={pencil} alt="pencil" className="editSize" onClick={(e) => { e.stopPropagation(); handleEdit(data._id, data.name); }} />
                            <img src={deleteicon} alt="deleteicon" className="deleteSize" onClick={(e) => { e.stopPropagation(); handleDelete(data._id); }} />
                        </div>
                    </div>
                </div>



                <Dialog header="Confirm Deletion" visible={confirmationVisible} style={{ width: "30vw" }} onHide={() => setConfirmationVisible(false)}>
                    <h1 className="diaHead">Are you sure you want to delete this plan?</h1>
                    <div className="flex justify-content-end mt-5" style={{ padding: '0rem 1.2rems' }} >

                        <Button type="submit" size="small" className="AU-save-btn p-button-rounded mr-2" style={{ cursor: 'pointer' }} onClick={() => setConfirmationVisible(false)} loading={isLoading} label="Cancel" />

                        <Button type="submit" size="small" className="AU-save-btn p-button-rounded mr-2 " style={{ cursor: 'pointer' }} onClick={() => {
                            handleDeleteConfirmed(itemIdToDelete);
                            setConfirmationVisible(false);
                        }}
                            loading={isLoading} label="Yes" />

                    </div>

                </Dialog>
            </div >
        );
    }; return (
        <div style={{ position: 'relative' }} className="mainBanner">

            {showTabComponent ?
                <>
                    <div className="backarrow">
                        <img src={backarrow} alt="backarrow" className="backSize" onClick={() => setShowTabComponent(false)} />
                        <span className="imgBack" onClick={() => setShowTabComponent(false)}>Back</span></div>
                    <SettingTab ></SettingTab>
                </> : (
                    <div className="Trainee-wrapper" >

                        <div className=" row boxcard">
                            <h2 className="plant-heading" >Plants</h2>

                            {/* <div className="iconBox">
                                <div className="col-12 sm:col-3 lg:col-3 xl:col-3 p-2 ">
                                    <div className="p-4 border-1 surface-border surface-card border-round pointCur" onClick={() => setVisible(true)}>
                                        <div className="flex flex-column align-items-center gap-3 py-6 posItem" >
                                            <i class="pi pi-plus-circle cursor-pointer" style={{ fontSize: '2rem' }} ></i>
                                            <p className="plantSize">Add Plant</p>
                                        </div>
                                    </div>
                                </div> xc
                            </div> */}
                            <DataView value={planData} style={{ padding: '0px 10px' }} itemTemplate={customItemTemplate} />
                            {planData.length > 1 && (
                                <div className="btnPos">
                                    {/* <Button size="small" className="w-max prevBtn" label="Previous" onClick={handlePrevios} />
                                    <Button size="small" className="w-max nextBtn ml-4" label="Next" onClick={handleNext} /> */}
                                </div>
                            )}
                        </div>
                        <Dialog header="Add" visible={visible} style={{ width: "30vw" }} onHide={() => setVisible(false)}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="error_msg">
                                <div className="field flex flex-column" style={{ marginTop: '20px', padding: '0.3rem 0.5rem' }}>
                                    <label htmlFor="department">
                                        Plant
                                    </label>
                                    <Controller
                                        name="name"
                                        control={form.control}
                                        rules={{ required: "Plant is required." }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <InputText id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />

                                                {fieldState.error && (
                                                    <small className="p-error">{fieldState.error.message}</small>)}
                                            </>
                                        )}
                                    />

                                </div>

                                <div className="flex justify-content-end mt-5">
                                    <Button size="small" className="AU-save-btn p-button-rounded" loading={isLoading} label="Save" />
                                </div>
                            </form>
                        </Dialog>
                    </div>)
            }

        </div >

    )
}
export default Settings;