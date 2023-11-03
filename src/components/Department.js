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
import { useStoreActions, useStoreState } from "easy-peasy";
import { Dialog } from "primereact/dialog";
import getHeaders from "../constants/Utils";
import deleteicon from '../images/trash.svg';
import pencil from '../images/Pencil.svg';
import closeicon from '../images/close-small.svg';
const Department = () => {
    const [departmentRes, setDepartmentRes] = useState([]);
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleConfig, setVisibleConfig] = useState(false);
    const [visibleIssueList, setVisibleIssueList] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    // const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedDepartId, setSelectedDepartId] = useState(null);
    const [issueResponse, setIssueResponse] = useState([]);
    const [ticketMapRes, setTicketMapRes] = useState([]);
    const [resData, setResData] = useState("");
    const selectedUnitId = useStoreState((state) => state.tabModel.selectedUnitId);
    const planStoreData = useStoreState((state) => state.tabModel.planStoreData);
    const setTraineesList = useStoreActions((actions) => actions.tabModel.setTraineesList);
    const traineesList = useStoreState((state) => state.tabModel.traineesList);
    const [selectedValues, setSelectedValues] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [morePage, setMorePage] = useState(true);
    const [esclationList, setEsclationList] = useState([]);
    const setDepartmentLength = useStoreActions((actions) => actions.tabModel.setDepartmentLength);
    const [refresh, setRefresh] = useState(false);

    const handlePrevios = () => {
        if (pageNo > 1) {
            setPageNo(pageNo - 1);
        }
    };

    const handleNext = () => {
        setPageNo(pageNo + 1);
    };

    const handleRemoveClick = (index) => {
        const updatedValues = [...selectedValues];
        updatedValues.splice(index, 1);
        setSelectedValues(updatedValues);
    };

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

    }

    useEffect(() => {
        getUser();
        getEsculation();
    }, []);

    const getEsculation = () => {
        setIsLoading(true);
        axios
            .get(constants.URL.META)
            .then((resp) => {
                setEsclationList(resp.data.results?.escalation_time_options);
            })
            .catch((e) => console.error(e))
            .finally(() => {
                setIsLoading(false);
            });

    }

    console.log('planStoreData', planStoreData);
    const handleAdd = (data) => {

        const payload = {
            name: data.department,
        }
        setIsLoading(true);

        if (selectedItemId) {
            axios.patch(constants.URL.ADD_DEPARTMENT + selectedItemId, payload, {
                headers: getHeaders(),
            })
                .then((resp) => {
                    console.log(resp.data.results);
                    setResData(resp.data.results);
                    form.setValue('department', '');
                    toast.current.show({ severity: "success", summary: "Success", detail: "Updated Successfully" });
                })
                .catch((e) => {
                    toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                    console.error(e);
                })
                .finally(() => {
                    setIsLoading(false);
                    setVisible(false);
                    setSelectedItemId('');
                });
        }
        else {
            axios.post(constants.URL.ADD_DEPARTMENT + selectedUnitId, payload, {
                headers: getHeaders(),
            })
                .then((resp) => {
                    console.log(resp.data.results);
                    setResData(resp.data.results);
                    form.setValue('department', '');
                    toast.current.show({ severity: "success", summary: "Success", detail: "Added Successfully" });
                }).catch((e) => {
                    toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                    console.error(e);
                }).finally(() => {
                    setIsLoading(false);
                    setVisible(false)
                })
        }
    }
    const handleDepartDelete = (departmentId) => {
        setIsLoading(true);
        axios.delete(constants.URL.ADD_DEPARTMENT + departmentId, {
            headers: getHeaders(),
        })
            .then((resp) => {
                console.log(resp.data);
                toast.current.show({ severity: "success", summary: "Success", detail: "Deleted Successfully" });
                setRefresh(true);
                form.setValue("department", '');
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
                setVisible(false);
            });
    };
    const handleIssueListClick = (id) => {

        getAllIssues(id);
        setVisibleIssueList(true);
        setSelectedDepartId(id);
        console.log("Selected ID:", id);

    };
    const handleTicketClick = (id) => {
        getAllUser(id);
        setVisibleConfig(true);
        setSelectedDepartId(id);

    }
    const getAllIssues = (id) => {

        setIsLoading(true);
        axios.get(constants.URL.ATTACH_DEPARTMENT + id + '/issue', {
            headers: getHeaders(),
        })
            .then((resp) => {
                console.log(resp.data.results);
                setIssueResponse(resp.data.results);
                // toast.current.show({ severity: "success", summary: "Success", detail: "Added Successfully" });
            }).catch((e) => {
                // toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                console.error(e);
            }).finally(() => {
                setIsLoading(false);
                setVisible(false)
            })

    }

    const getAllUser = (id) => {

        setIsLoading(true);
        axios.get(constants.URL.GET_DEPARTMENT + id, {
            headers: getHeaders(),
        })
            .then((resp) => {
                setTicketMapRes(resp.data.results);

                if (resp.data.results && resp.data.results.escalation_settings) {
                    const { escalation_settings } = resp.data.results;
                    form.setValue('esclation', escalation_settings.duration || '1 day');
                    form.setValue('level1', escalation_settings.hierarchy[0]?._id || 'No');
                    form.setValue('level2', escalation_settings.hierarchy[1]?._id || 'No');
                    form.setValue('level3', escalation_settings.hierarchy[2]?._id || 'No');
                    form.setValue('level4', escalation_settings.hierarchy[3]?._id || 'No');
                }

            }).catch((e) => {
                console.error(e);
            }).finally(() => {
                setIsLoading(false);
                setVisible(false)
            })

    }


    const handleDelete = (name) => {
        const payload = {
            name: name,
        }


        setIsLoading(true);
        axios.post(constants.URL.ATTACH_DEPARTMENT + selectedDepartId + '/issue/detach', payload, {
            headers: getHeaders(),
        })
            .then((resp) => {
                console.log(resp.data.results);

                getAllIssues(resp.data.results._id);

                toast.current.show({ severity: "success", summary: "Success", detail: "Added Successfully" });
            }).catch((e) => {
                toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                console.error(e);
            }).finally(() => {
                setIsLoading(false);
                setVisible(false)
            })
    }
    const handleAddList = (data) => {

        const payload = {
            name: data.issue,
        }
        setIsLoading(true);
        axios.post(constants.URL.ATTACH_DEPARTMENT + selectedDepartId + '/issue/attach', payload, {
            headers: getHeaders(),
        })
            .then((resp) => {
                console.log(resp.data.results);
                setResData(resp.data.results);
                form.setValue('issue', '');
                form.clearErrors();
                form.reset();
                getAllIssues(resp.data.results._id);

                toast.current.show({ severity: "success", summary: "Success", detail: "Added Successfully" });
            }).catch((e) => {
                toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                console.error(e);
            }).finally(() => {
                setIsLoading(false);
                setVisible(false)
            })
    }
    // function convertToLowerCase(arr) {
    //     return arr?.map(element => element.toLowerCase());
    // }
    const [isSaveClicked, setIsSaveClicked] = useState(false);

    const handleSaveClick = () => {
        setIsSaveClicked(true);
    };
    const handleAddUser = (data) => {

        if (!data.level1 || data.level1 === 'No') {
            toast.current.show({
                severity: "error",
                summary: "Validation Error",
                detail: "Please select Level 1 User.",
            });
            return;
        }
        const levelsArray = [
            data.level1,
            data.level2,
            data.level3,
            data.level4

        ].filter(level => level !== 'No');

        if (isSaveClicked) {
            const payload = {
                duration: data.esclation,
                hierarchy: levelsArray,
            }
            setIsLoading(true);
            axios.post(constants.URL.ATTACH_DEPARTMENT + selectedDepartId + '/escalation-setting', payload, {
                headers: getHeaders(),
            })
                .then((resp) => {
                    console.log(resp.data.results);
                    // setResData(resp.data.results);
                    form.setValue('user', '');
                    setSelectedValues([]);
                    // form.clearErrors();
                    form.reset();

                    setVisibleConfig(false);
                    toast.current.show({ severity: "success", summary: "Success", detail: "Added Successfully" });
                }).catch((e) => {
                    toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                    console.error(e);
                }).finally(() => {
                    setIsLoading(false);
                    setVisible(false)
                })
        }
        setIsSaveClicked(false);
    }
    const defaultValues = { name: '' };
    const form = useForm({ defaultValues });
    const errors = form.formState.errors;
    const { reset } = form;
    const handleEdit = (id, name) => {
        setSelectedItemId(id);
        form.setValue('department', name);
        // setSomeOtherStateVariable(name);
        setVisible(true);
    };

    // const esclationList = ["2 minutes",
    //     "4 minutes",
    //     "30 minutes",
    //     "1 hour",
    //     "6 hours",
    //     "12 hours",
    //     "24 hours",
    //     "2 days",
    //     "7 days",
    //     "1 month"]
    useEffect(() => {
        setIsLoading(true);
        axios
            .get(constants.URL.ALL_DEPARTMENT + selectedUnitId + '?sort_by=name&page=' + pageNo + '&limit=' + pageLimit, {
                headers: getHeaders(),
            })
            .then((resp) => {
                console.log("API Response:", resp.data);
                setDepartmentRes(resp.data.results)
                setDepartmentLength(resp.data.results.length);
                setMorePage(resp.data.results.length === pageLimit);
            })
            .catch((e) => {
                console.error("API Error:", e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [resData, pageNo, refresh]);

    return (
        <>

            <div className='w-full'>
                <div className='db-wrapper'>
                    <Toast ref={toast} />

                    <div>
                        <h2 className="details-heading my-3 flex align-items-center justify-content-between">
                            <span>Department</span>
                            <i class="pi pi-plus-circle cursor-pointer" style={{ fontWeight: '600' }} onClick={() => setVisible(true)}></i>
                        </h2>
                        <div style={{ padding: '0rem 1rem' }}>
                            {departmentRes.map(department => (
                                <div className="col-12 flex align-items-center justify-content-between boxBorder" key={department.id}>
                                    <div className="col-4">
                                        {department.name}
                                    </div>
                                    <div className="flex align-items-center">
                                        {traineesList.length > 0 && (
                                            <div>
                                                <Button
                                                    size="small"
                                                    className="AU-save-btn w-max p-button-rounded mr-4 mb-2"
                                                    loading={isLoading}
                                                    label="Issue List Configuration"
                                                    onClick={() => handleIssueListClick(department._id)}
                                                />
                                                <Button
                                                    size="small"
                                                    className="AU-save-btn w-max p-button-rounded mb-2"
                                                    loading={isLoading}
                                                    label="Ticket User Mapping"
                                                    onClick={() => handleTicketClick(department._id)}

                                                />
                                            </div>
                                        )}

                                        <div className="flex " style={{ marginLeft: '20px ' }}>
                                            <img src={pencil} alt="pencil" className="editSize" onClick={() => handleEdit(department._id, department.name)} />
                                            <img src={deleteicon} alt="deleteicon" className="deleteSize" onClick={() => handleDepartDelete(department._id)} />


                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* <div className="SS-line"></div> */}


                            <div className="btnPos">
                                {pageNo > 1 && <Button size="small" className=" w-max prevBtn" label="Previos" onClick={handlePrevios} />}
                                {morePage && <Button size="small" className=" w-max nextBtn ml-4" label="Next" onClick={handleNext} />}
                            </div>

                        </div>
                    </div>
                    <Dialog header="Issue List Configuration" visible={visibleIssueList} style={{ width: "40vw" }} onHide={() => setVisibleIssueList(false)}>
                        <form onSubmit={form.handleSubmit(handleAddList)} className="error_msg" >

                            <div className=" align-items-center col-12">

                                <div className="field col-12" style={{ display: 'inline-grid', marginTop: '10px', padding: '0px' }}>
                                    <label htmlFor="name">
                                        Issue List<span className="p-error">*</span>
                                    </label>

                                    <Controller
                                        name="issue"
                                        control={form.control}
                                        rules={{ required: "Issue List is required." }}
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
                            <div className="SS-line"></div>
                            <div className="col-12 mt-3">
                                {issueResponse.map(issue => (
                                    <div className="flex align-items-center justify-content-between" key={issue._id}>
                                        <div className="issueFont">
                                            {issue}
                                        </div>

                                        <div className="flex align-items-center">
                                            <img src={deleteicon} alt="deleteicon" className="deleteSize" onClick={() => handleDelete(issue)} />
                                        </div>
                                    </div>
                                ))}
                            </div>


                        </form>
                    </Dialog>

                    <Dialog header="Ticket User Mapping" visible={visibleConfig} style={{ width: "30vw" }} onHide={() => setVisibleConfig(false)}>
                        <form onSubmit={form.handleSubmit(handleAddUser)} className="error_msg" style={{ marginTop: '10px', padding: '0rem 0.5rem' }}>

                            <div className="field flex flex-column">
                                <label htmlFor="name">
                                    No.of. Days for Escalation<span className="p-error">*</span>
                                </label>

                                <Controller
                                    name="esclation"
                                    control={form.control}
                                    rules={{ required: "Esclation is required." }}
                                    render={({ field, fieldState }) => (
                                        <>  <Dropdown id={field.name} value={field.value} style={{ width: '100%' }} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} options={esclationList} />
                                            {fieldState.error && (
                                                <small className="p-error">{fieldState.error.message}</small>
                                            )}
                                        </>

                                    )}
                                />

                            </div>
                            <div className="field flex flex-column">
                                <label htmlFor="department">
                                    Select User For Escalation. <br></br>
                                    <span style={{ color: '#495057', fontSize: '10px' }}>(Ticket will be escalated by below order)</span>
                                </label>
                                <div className=" align-items-center" style={{ borderBottom: '1px solid rgba(242, 242, 242, 1)', paddingBottom: '15px ' }}>
                                    <div style={{ width: '100%' }}>
                                        <label htmlFor="level1">
                                            Level 1
                                        </label>
                                        <Controller
                                            name="level1"
                                            control={form.control}
                                            rules={{ required: "Level 1 User is required." }}
                                            render={({ field, fieldState }) => (
                                                <div className="column boxTop" >
                                                    <Dropdown
                                                        id={field.name}
                                                        value={field.value}
                                                        className={classNames({ "p-invalid": fieldState.error })}
                                                        style={{ width: '100%' }}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        options={[{ label: 'No', value: 'No' }, ...traineesList.map(item => ({ label: item.name, value: item._id }))]}

                                                        optionLabel="label"
                                                        optionValue="value"
                                                    />
                                                    <div style={{ marginTop: '5px' }}>
                                                        {fieldState.error && (
                                                            <small className="p-error">{fieldState.error.message}</small>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <label htmlFor="level2">
                                            Level 2
                                        </label>
                                        <Controller
                                            name="level2"
                                            control={form.control}
                                            // rules={{ required: "level2 User is required." }}
                                            render={({ field, fieldState }) => (
                                                <div className="column boxTop" >
                                                    <Dropdown
                                                        id={field.name}
                                                        value={field.value}
                                                        className={classNames({ "p-invalid": fieldState.error })}
                                                        style={{ width: '100%' }}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        options={[{ label: 'No', value: 'No' }, ...traineesList.map(item => ({ label: item.name, value: item._id }))]}

                                                        optionLabel="label"
                                                        optionValue="value"
                                                    />
                                                    <div style={{ marginTop: '5px' }}>
                                                        {fieldState.error && (
                                                            <small className="p-error">{fieldState.error.message}</small>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <label htmlFor="department">
                                            Level 3
                                        </label>
                                        <Controller
                                            name="level3"
                                            control={form.control}
                                            // rules={{ required: "Level3 User is required." }}
                                            render={({ field, fieldState }) => (
                                                <div className="column boxTop" >
                                                    <Dropdown
                                                        id={field.name}
                                                        value={field.value}
                                                        className={classNames({ "p-invalid": fieldState.error })}
                                                        style={{ width: '100%' }}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        options={[{ label: 'No', value: 'No' }, ...traineesList.map(item => ({ label: item.name, value: item._id }))]}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                    />
                                                    <div style={{ marginTop: '5px' }}>
                                                        {fieldState.error && (
                                                            <small className="p-error">{fieldState.error.message}</small>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <label htmlFor="department">
                                            Level 4
                                        </label>
                                        <Controller
                                            name="level4"
                                            control={form.control}
                                            // rules={{ required: "Level4 User is required." }}
                                            render={({ field, fieldState }) => (
                                                <div className="column boxTop" >
                                                    <Dropdown
                                                        id={field.name}
                                                        value={field.value}
                                                        className={classNames({ "p-invalid": fieldState.error })}
                                                        style={{ width: '100%' }}
                                                        onChange={(e) => field.onChange(e.target.value)}

                                                        options={[{ label: 'No', value: 'No' }, ...traineesList.map(item => ({ label: item.name, value: item._id }))]}

                                                        optionLabel="label"
                                                        optionValue="value"
                                                    />
                                                    <div style={{ marginTop: '5px' }}>
                                                        {fieldState.error && (
                                                            <small className="p-error">{fieldState.error.message}</small>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>

                                </div>

                                {selectedValues.map((value, index) => (
                                    <div key={index} className="flex" style={{ marginTop: '15px' }} >
                                        <div style={{ marginTop: '10px', width: '100%' }}>
                                            {value.name}
                                        </div>
                                        <div>
                                            <img src={closeicon} alt="backarrow" className="closeicon" onClick={() => handleRemoveClick(index)} />

                                        </div>
                                    </div>
                                ))}

                            </div>


                            <div className="flex justify-content-end mt-5" style={{ padding: '0rem 1.2rems' }} >
                                <Button type="submit" size="small" className="AU-save-btn p-button-rounded" onClick={handleSaveClick} loading={isLoading} label="Save" />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog header="Add Department" visible={visible} style={{ width: "30vw" }} onHide={() => setVisible(false)}>
                        <form onSubmit={form.handleSubmit(handleAdd)} className="error_msg">

                            <div className="field flex flex-column">
                                <Controller
                                    name="department"
                                    control={form.control}
                                    rules={{ required: "Department is required." }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <InputText id={field.name} style={{ margin: '15px 5px 0px' }} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />

                                            {fieldState.error && (
                                                <small className="p-error">{fieldState.error.message}</small>
                                            )}</>
                                    )}
                                />

                            </div>

                            <div className="flex justify-content-end mt-5">
                                <Button size="small" className="AU-save-btn p-button-rounded" loading={isLoading} label="Save" />
                            </div>
                        </form>
                    </Dialog>
                </div >
            </div >
            {/* </div> */}
        </>
    );
};
export default Department;