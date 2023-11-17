import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import constants from '../constants/constants';
import getHeaders from '../constants/Utils';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Controller, useForm } from 'react-hook-form';
import { Toast } from "primereact/toast";
import classNames from "classnames";
import deleteicon from '../images/trash.svg';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
function Tools() {

    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const defaultValues = { department: '' };
    const form = useForm({ defaultValues });
    const [toolData, setToolData] = useState([]);
    const errors = form.formState.errors;
    const toast = useRef(null);
    const [refresh, setRefresh] = useState(false);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState('');
    useEffect(() => {
        setIsLoading(true);
        axios
            .get(constants.URL.GET_TOOLS, {
                headers: getHeaders(),
            })
            .then((resp) => {
                console.log("API Response:", resp.data);
                setToolData(resp.data.results)

            })
            .catch((e) => {
                console.error("API Error:", e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [refresh]);
    const handleAdd = (data) => {

        const payload = {
            name: data.tool,
        }
        setIsLoading(true);


        axios.post(constants.URL.ADD_TOOLS, payload, {
            headers: getHeaders(),
        })
            .then((resp) => {
                form.setValue('tool', '');
                setRefresh(true);
                if (toast.current) {
                    toast.current.show({ severity: "success", summary: "Success", detail: "Added Successfully" });
                }
            }).catch((e) => {
                if (toast.current) {
                    toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                }
                console.error(e);
            }).finally(() => {
                setIsLoading(false);
                setRefresh(false);
                setVisible(false);
            })

    }
    const handleToolDelete = (name) => {
        setIsDeleteDialogVisible(true);
        setItemIdToDelete(name);
    }
    const handleDelete = () => {
        const payload = {
            name: itemIdToDelete,
        }


        setIsLoading(true);
        axios.post(constants.URL.DELETE_TOOLS, payload, {
            headers: getHeaders(),
        })
            .then((resp) => {
                console.log(resp.data.results);
                setIsDeleteDialogVisible(false);
                setRefresh(true);
                toast.current.show({ severity: "success", summary: "Success", detail: "Deleted Successfully" });
            }).catch((e) => {
                toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                console.error(e);
            }).finally(() => {
                setIsLoading(false);
                setVisible(false);
                setRefresh(false);
                setIsDeleteDialogVisible(false);
            })
    }
    const customItemTemplate = (data) => {

        return (
            <div className="mt-3">
                <div className="pointCur" onClick={() => setVisible(true)}>
                    <div className="flex align-items-center mr-4 posItemtool">
                        <p className="plantSize">{data}</p>

                        <img src={deleteicon} alt="deleteicon" className="deleteSize" onClick={(e) => { e.stopPropagation(); handleToolDelete(data); }} />

                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className='w-full mainBanner p-2'>
            <div className='db-wrapper'>
                <Toast ref={toast} />
                <div className="grid mx-0">
                    <div className='flex align-items-center justify-content-between tool-heading' style={{ width: '100%' }}>
                        <h4 className='' >Tools</h4>
                        <i class="pi pi-plus-circle cursor-pointer" style={{ fontWeight: '600', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setVisible(true)}></i>
                    </div>

                    <DataView value={toolData} style={{ padding: '0px 10px' }} itemTemplate={customItemTemplate} />


                    <Dialog header="Add Tool" visible={visible} style={{ width: "30vw" }} onHide={() => setVisible(false)}>
                        <form onSubmit={form.handleSubmit(handleAdd)} className="error_msg">

                            <div className=" align-items-center col-12">

                                <div className="field col-12" style={{ display: 'inline-grid', marginTop: '10px', padding: '0px' }}>
                                    <label htmlFor="name">
                                        Tool<span className="p-error">*</span>
                                    </label>

                                    <Controller
                                        name="tool"
                                        control={form.control}
                                        rules={{ required: "Tool List is required." }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <InputText id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />

                                                {fieldState.error && (
                                                    <small className="p-error">{fieldState.error.message}</small>
                                                )}
                                            </>
                                        )}
                                    />

                                </div>

                                <div className="flex justify-content-end">
                                    <Button size="small" className="AU-save-btn p-button-rounded ml-3" loading={isLoading} label="Add" />
                                </div>
                            </div>
                        </form>
                    </Dialog>

                    <Dialog header="Confirm Deletion" visible={isDeleteDialogVisible} style={{ width: "30vw" }} onHide={() => setIsDeleteDialogVisible(false)}>
                        <h1 className="diaHead">Are you sure you want to delete this tool?</h1>
                        <div className="flex justify-content-end mt-5" style={{ padding: '0rem 1.2rems' }} >


                            <Button type="submit" size="small" className="AU-save-btn p-button-rounded mr-2 " style={{ cursor: 'pointer' }} onClick={() => setIsDeleteDialogVisible(false)} loading={isLoading} label="Cancel" />
                            <Button type="submit" size="small" className="AU-save-btn p-button-rounded " style={{ cursor: 'pointer' }} onClick={handleDelete} loading={isLoading} label="Yes" />

                        </div>

                    </Dialog>
                </div>
            </div>
        </div >
    )
}

export default Tools;