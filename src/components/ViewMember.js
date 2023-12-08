import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import constants from "../constants/constants";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Dialog } from "primereact/dialog";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import getHeaders from "../constants/Utils";
import deleteicon from '../images/trash.svg';
import pencil from '../images/Pencil.svg';
import classNames from "classnames";

const ViewMember = () => {
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const setTraineesList = useStoreActions((actions) => actions.tabModel.setTraineesList);
    const traineesList = useStoreState((state) => state.tabModel.traineesList);
    const setSelectedData = useStoreActions((actions) => actions.tabModel.setSelectedData);
    const selectedUnitId = useStoreState((state) => state.tabModel.selectedUnitId);
    const [pageNo, setPageNo] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [morePage, setMorePage] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isChangePasswordDialogVisible, setIsChangePasswordDialogVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const defaultValues = { name: '' }
    const form = useForm({ defaultValues });
    const errors = form.formState.errors;
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        getUser();
    }, [refresh, pageNo]);

    const getUser = () => {
        setIsLoading(true);
        axios
            .get(constants.URL.ALL_Depart_USER + selectedUnitId + "?sort_by=-createdAt&page=" + pageNo + '&limit=' + pageLimit, {
                headers: getHeaders(),
            })
            .then((resp) => {
                setTraineesList(resp.data.results);
                setMorePage(resp.data.results.length === pageLimit);
            })
            .catch((e) => console.error(e))
            .finally(() => {
                setIsLoading(false);
            });
        setSelectedData();
    }

    const handleEdit = (id) => {
        setSelectedUserId(id);
        setIsChangePasswordDialogVisible(true);
    }

    const onSubmit = (data) => {
        setIsLoading(true);
        const payload = {
            password: data.name,
        };

        axios.patch(constants.URL.EDIT_USER + selectedUserId, payload, {
            headers: getHeaders(),
        })
            .then((resp) => {
                if (toast.current) {
                    toast.current.show({ severity: "success", summary: "Success", detail: "Item updated successfully" });
                }
                form.reset();
                setIsChangePasswordDialogVisible(false);
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
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const confirmDelete = () => {
        setIsLoading(true);

        axios.delete(constants.URL.DELETE_USER + '/' + deleteId, {
            headers: getHeaders(),
        })
            .then((resp) => {
                console.log(resp.data);
                toast.current.show({ severity: "success", summary: "Success", detail: "Deleted Successfully" });
                setRefresh(true);
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
                setRefresh(false);
                setDeleteId(null);
            });
    };

    const deleteButtonTemplate = (rowData) => {
        return (
            <div className="flex">
                <img src={pencil} alt="pencil" style={{ cursor: 'pointer' }} className="editSize" onClick={() => handleEdit(rowData._id)} />

                <img
                    src={deleteicon}
                    alt="deleteicon"
                    style={{ cursor: 'pointer' }}
                    className="deleteSize"
                    onClick={() => handleDeleteClick(rowData._id)}
                />

                <Dialog
                    header="Confirm Deletion"
                    visible={deleteId === rowData._id}
                    style={{ width: "30vw" }}
                    onHide={() => setDeleteId(null)}
                >
                    <h1 className="diaHead">Are you sure you want to delete this record?</h1>
                    <div className="flex justify-content-end mt-5" style={{ padding: '0rem 1.2rems' }}>
                        <Button
                            type="submit"
                            size="small"
                            className="AU-save-btn p-button-rounded mr-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setDeleteId(null)}
                            loading={isLoading}
                            label="Cancel"
                        />
                        <Button
                            type="submit"
                            size="small"
                            className="AU-save-btn p-button-rounded"
                            style={{ cursor: 'pointer' }}
                            onClick={() => confirmDelete(rowData._id)}
                            loading={isLoading}
                            label="Yes"
                        />
                    </div>
                </Dialog>

                <Dialog
                    header="Change Password"
                    visible={isChangePasswordDialogVisible}
                    style={{ width: "30vw" }}
                    onHide={() => setIsChangePasswordDialogVisible(false)}
                >
                    {/* ... (existing dialog content) */}
                </Dialog>
            </div>
        );
    };


    const handlePrevios = () => {
        if (pageNo > 1) {
            setPageNo(pageNo - 1);
        }
    };

    const handleNext = () => {
        setPageNo(pageNo + 1);
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="grid table-demo">
                <div className="col-12">
                    <div style={{ marginTop: '1rem' }}>
                        <DataTable value={traineesList} responsiveLayout="scroll">
                            <Column field="name" header="Name"></Column>
                            <Column field="email" header="Email Id" style={{ minWidth: '15rem' }}></Column>
                            <Column header="Actions" body={(rowData, rowIndex) => deleteButtonTemplate(rowData, rowIndex)}></Column>
                        </DataTable>
                    </div>
                </div>
                <div className="btnPos" style={{ width: '100%' }}>
                    {(pageNo > 1) && <Button size="small" className="w-max prevBtn" label="Previous" onClick={handlePrevios} />}
                    {morePage && <Button size="small" className="w-max nextBtn ml-4" label="Next" onClick={handleNext} />}
                </div>
            </div>
        </div>
    );
};

export default ViewMember;
