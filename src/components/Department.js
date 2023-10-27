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
import deleteicon from '../images/trash.svg';
import addicon from '../images/Plus-Circle.svg';
import pencil from '../images/Pencil.svg';
import closeicon from '../images/close-small.svg';
const Department = () => {
    const [department, setDepartment] = useState(null);
    const [departmentRes, setDepartmentRes] = useState([]);
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleConfig, setVisibleConfig] = useState(false);
    const [visibleIssueList, setVisibleIssueList] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [dropdownItemUnit, setDropDownItemUnit] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const selectedData = useStoreState((state) => state.tabModel.selectedData);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedDepartId, setSelectedDepartId] = useState(null);
    const [issueResponse, setIssueResponse] = useState([]);
    const [resData, setResData] = useState("");
    const selectedUnitId = useStoreState((state) => state.tabModel.selectedUnitId);
    console.log("issueResponse", issueResponse)
    const planStoreData = useStoreState((state) => state.tabModel.planStoreData);
    const setTraineesList = useStoreActions((actions) => actions.tabModel.setTraineesList);
    const traineesList = useStoreState((state) => state.tabModel.traineesList);
    const [selectedValues, setSelectedValues] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const setDepartmentLength = useStoreActions((actions) => actions.tabModel.setDepartmentLength);
    const [refresh, setRefresh] = useState(false);
    const handleAddClick = (value) => {
        const selectedTrainee = traineesList.find((trainee) => trainee._id === value);

        if (selectedTrainee) {
            setSelectedValues([...selectedValues, selectedTrainee]);
            setSelectedUserId([...selectedUserId, selectedTrainee._id]);
        }
    };
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
    const dropdownOptions = planStoreData.map((item) => ({
        label: item.name,
        value: item._id, // Set the value to the _id
    }));
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
    }, []);



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
        console.log("selectedUserId", selectedUserId)
        if (isSaveClicked) {
            const payload = {
                duration: data.esclation,
                hierarchy: selectedUserId,
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
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    }
    // const dropdownItemDept = ['msf production', 'quality (assy)', 'quality (msf)', 'npd', 'npd quality', 'customer quality',
    //     'marketing', 'project team', 'purchase/logistics', 'safety', 'hr/admin', 'training', 'store', 'wip', 'packing',
    //     'sales', '5s', 'despatch', 'maintenance', 'assy production'];

    // const dropdownItemLevel = ['Level-0', 'Level-1', 'Level-2', 'Level-3', 'Level-4']
    const esclationList = ["2 minutes",
        "4 minutes",
        "30 minutes",
        "1 hour",
        "6 hours",
        "12 hours",
        "24 hours",
        "2 days",
        "7 days",
        "1 month"]
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
            {/* <div className="Trainee-wrapper card"> */}
            <div className='w-full'>
                <div className='db-wrapper'>
                    <Toast ref={toast} />
                    {/* <div className="flex justify-content-end">

                        <Dropdown placeholder="Select Plant" className="" />
                    </div> */}
                    <div>
                        <h2 className="details-heading my-3 flex align-items-center justify-content-between">
                            <span>Department Name</span>
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
                                                    onClick={() => setVisibleConfig(true)}
                                                />
                                            </div>
                                        )}

                                        {/* <i className="pi pi-pencil mx-4 cursor-pointer"></i>
                                        <i className="pi pi-trash cursor-pointer"></i> */}

                                        <div className="flex " style={{ marginLeft: '20px ' }}>
                                            <img src={pencil} alt="pencil" className="editSize" onClick={() => handleEdit(department._id, department.name)} />
                                            <img src={deleteicon} alt="deleteicon" className="deleteSize" onClick={() => handleDepartDelete(department._id)} />


                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* <div className="SS-line"></div> */}

                            {departmentRes.length > 0 && (
                                <div className="btnPos">
                                    <Button size="small" className=" w-max prevBtn" label="Previos" onClick={handlePrevios} />
                                    <Button size="small" className=" w-max nextBtn ml-4" label="Next" onClick={handleNext} />
                                </div>
                            )}
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

                                    {/* {getFormErrorMessage("name")} */}
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

                                            {/* <i className="pi pi-trash cursor-pointer" onClick={() => handleDelete(issue)}></i> */}
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
                                    Select User For Escalation.
                                </label>
                                <div className="flex align-items-center" style={{ borderBottom: '1px solid rgba(242, 242, 242, 1)', paddingBottom: '15px ' }}>
                                    <Controller
                                        name="user"
                                        control={form.control}
                                        rules={{ required: "User is required." }}
                                        render={({ field, fieldState }) => (
                                            <div className="column" style={{ width: '100%' }}>
                                                <Dropdown
                                                    id={field.name}
                                                    value={field.value}
                                                    className={classNames({ "p-invalid": fieldState.error })}
                                                    style={{ width: '90%', marginRight: '5px' }}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    options={traineesList}
                                                    optionLabel="name"
                                                    optionValue="_id"
                                                />
                                                <div style={{ marginTop: '5px' }}>
                                                    {fieldState.error && (
                                                        <small className="p-error">{fieldState.error.message}</small>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <Button
                                        size="small"
                                        className="AU-save-btn p-button-rounded"
                                        label="Add"
                                        style={{ with: '10%' }}
                                        onClick={() => handleAddClick(form.getValues('user'))}
                                    />
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

                                {/* {planStoreData.length > 0 ? (
                                    <Controller
                                        name="plant"
                                        control={form.control}
                                        rules={{ required: "Plant is required." }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Dropdown
                                                    value={selectedUnit} // Use selectedPlant to set the selected value
                                                    options={dropdownOptions}
                                                    onChange={(e) => {
                                                        setSelectedUnit(e.value); // Update selectedPlant when the value changes
                                                        field.onChange(e.value); // Update the form field value
                                                    }}
                                                    placeholder="Select a plant"
                                                />
                                                {fieldState.error && (
                                                    <small className="p-error">{fieldState.error.message}</small>
                                                )}
                                            </>
                                        )}
                                    />

                                ) : (
                                    <Controller
                                        name="plant"
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
                                )} */}

                                {/* {getFormErrorMessage("plant")} */}

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
                                {/* 
                                {getFormErrorMessage("department")} */}


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