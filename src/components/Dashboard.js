import React, { useEffect, useState } from 'react';
import Barchart from './Barchart';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from 'axios';
import constants from '../constants/constants';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Button } from 'primereact/button';
import getHeaders from "../constants/Utils";
function Dashboard() {

    const [isLoading, setIsLoading] = useState(false);
    const setData = useStoreActions((actions) => actions.tabModel.setData);
    const data = useStoreState((state) => state.tabModel.data);
    const setBarData = useStoreActions((actions) => actions.tabModel.setBarData);
    const [selectedDept, setSelectedDept] = useState('All');
    const [planData, setPlanData] = useState([]);
    const [OpenCount, setOpenCount] = useState(0);
    const [ResolvedCount, setResolvedCount] = useState(0);
    const [ClosedCount, setClosedCount] = useState(0);
    const [selectedUnit, setSelectedUint] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [tableData, setTableData] = useState([]);
    console.log("tableData", tableData)
    const dropdownItemDept = [];
    const [pageNo, setPageNo] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        created_user_status: { value: null, matchMode: FilterMatchMode.EQUALS },
        department: { value: null, matchMode: FilterMatchMode.IN },
    });

    const clearFilter = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            created_user_status: { value: null, matchMode: FilterMatchMode.EQUALS },
            department: { value: null, matchMode: FilterMatchMode.IN },
        })
        setSelectedDept('Clear All');
    }
    useEffect(() => {

        getUnit();
        getUnitCount();
    }, []);
    useEffect(() => {

        getTableData();
    }, [selectedUnit, pageNo, pageLimit]);

    const getTableData = () => {
        setIsLoading(true);
        axios

            .get(constants.URL.DASH_TABLE + selectedStatus + "&department=" + selectedDept + "&unit=" + selectedUnit + '&page=' + pageNo + '&limit=' + pageLimit + '&sort_by=-createdAt', {
                headers: getHeaders(),
            })
            .then((resp) => {

                setTableData(resp.data.results);
                // getLastStatusEvent(resp.data.results?.statusEvents)
            })
            .catch((e) => {
                console.error("API Error:", e);
            })
            .finally(() => {
                setIsLoading(false);
            });

    }
    const handleNext = () => {
        setPageNo(pageNo + 1);
    };

    const handlePrevious = () => {
        if (pageNo > 1) {
            setPageNo(pageNo - 1);
        }
    };
    const getLastStatusEvent = (statusEvents) => {
        if (statusEvents && statusEvents.length > 0) {
            const lastStatusEvent = statusEvents[statusEvents.length - 1];
            return {
                // status: lastStatusEvent.status,
                by: lastStatusEvent.by.name,
                // description: lastStatusEvent.description,
                // timestamp: lastStatusEvent.timestamp
            };
        } else {
            return null;
        }
    };
    const getLastClosedStatusEvent = (statusEvents) => {
        if (statusEvents && statusEvents.length > 0) {
            for (let i = statusEvents.length - 1; i >= 0; i--) {
                if (statusEvents[i].status === "Closed") {
                    return {
                        index: i,
                        by: statusEvents[i].by.name,
                        timestamp: statusEvents[i].timestamp
                    };
                }
            }
        }
        return null;
    };
    const getUnit = () => {
        setIsLoading(true);
        axios
            .get(constants.URL.ALL_PLANT + 'page=' + pageNo + '&limit=' + pageLimit, {
                headers: getHeaders(),
            })
            .then((resp) => {
                console.log("API Response:", resp.data);
                // const newData = [
                //     {
                //         name: 'All',
                //     },
                //     ...resp.data.results
                // ];
                // setPlanData(newData);
                setPlanData(resp.data.results);
                if (resp.data.results.length > 0) {
                    setSelectedUint(resp.data.results[0]._id);
                }

            })
            .catch((e) => {
                console.error("API Error:", e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
    const getUnitCount = () => {
        setIsLoading(true);
        axios
            .get(constants.URL.DASH_COUNT, {
                headers: getHeaders(),
            })
            .then((resp) => {
                console.log("API Response:", resp.data);
                setOpenCount(resp.data?.results?.Open);
                setResolvedCount(resp.data?.results?.Resolved);
                setClosedCount(resp.data?.results?.Closed);
                setBarData();

            })
            .catch((e) => {
                console.error("API Error:", e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
    // let OpenCount = 0;
    // let ResolvedCount = 0;
    // let ClosedCount = 0;

    // data?.forEach((employee) => {
    //     const { assigned_user_status, created_user_status } = employee;

    //     if (assigned_user_status == "Open") {
    //         OpenCount++;
    //     }
    //     if (assigned_user_status == "resolved") {
    //         ResolvedCount++;
    //     }
    //     if (created_user_status == "closed") {
    //         ClosedCount++;
    //     }
    // });
    // console.log(OpenCount);
    const [statuses] = useState(['open']);

    const [representatives] = useState(['open', 'closed', 'resolved', 'hold'])

    const representativesItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{option}</span>
            </div>
        );
    };


    const representativeRowFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={representatives}
                itemTemplate={representativesItemTemplate}
                onChange={(e) => options.filterCallback(e.value)}
                placeholder="status"
                className="p-column-filter"
            // style={{ maxWidth: '9rem' }}
            />
        );
    };

    const depRowFilterTemplate = (options) => {
        return (
            <MultiSelect
                options={dropdownItemDept}
                value={options.value}
                onChange={(e) => options.filterCallback(e.target.value)}
                placeholder="Search Department"
                className="p-column-filter"
            />
        );
    };

    const closedBodyTemplate = (rowData) => {
        if (rowData?.created_user_status == "closed") {
            return rowData?.updatedAt;
        }
    };

    return (
        <div className='w-full'>
            <div className='db-wrapper'>
                <div className="grid mx-0">
                    <div className="col-12 xl:col-9 db-chart ds-table-height mb-0 leftside">
                        <div className=''>
                            <div className='flex justify-content-between align-items-center'>
                                <h4 className='db-heading'>Tickets</h4>
                                <div>
                                    {!isLoading && planData.length > 1 && (

                                        <Dropdown
                                            value={selectedUnit}
                                            style={{ width: '12rem' }}
                                            className='dropBox'
                                            onChange={(e) => setSelectedUint(e.value)}
                                            placeholder={selectedUnit}
                                            options={planData}

                                            optionLabel="name"
                                            optionValue="_id"
                                        />
                                    )}
                                    {!isLoading && planData.length === 1 && (
                                        <div className='PlantBox'>{planData[0].name}</div>
                                    )}
                                </div>
                            </div>
                            <DataTable removableSort value={tableData} responsiveLayout="scroll" rows={20}
                                dataKey="id" filters={filters}
                                globalFilterFields={['department']} emptyMessage="No Tickets found.">
                                {/* <Column field="_id" header="Ticket No" style={{ minWidth: '5rem' }}></Column> */}
                                <Column field="createdAt" header="Ticket Raised" body={(rowData) => {
                                    const date = new Date(rowData?.createdAt);
                                    return date?.toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    });
                                }} style={{ minWidth: '12rem' }}></Column>
                                <Column field="department.name" style={{ minWidth: '13.5rem' }} filterElement={depRowFilterTemplate} header="Ticket Department" showFilterMatchModes={false}></Column>
                                <Column field="assignor.name" header="Raised By" style={{ minWidth: '10rem' }}></Column>
                                <Column field="issue_type" header="Category" style={{ minWidth: '12rem' }}></Column>
                                <Column field="escalation_settings.duration" style={{ minWidth: '8rem' }} header="Resolution Time"></Column>
                                <Column
                                    body={(rowData) => {
                                        const lastStatusEvent = getLastStatusEvent(rowData?.status_events);
                                        return lastStatusEvent ? lastStatusEvent.by : 'N/A';
                                    }}
                                    style={{ minWidth: '9rem' }}
                                    header="Current Status"
                                ></Column>
                                <Column field="status" style={{ minWidth: '8rem' }}
                                    header="Status"></Column>
                                <Column
                                    body={(rowData) => {
                                        const lastClosedStatusEvent = getLastClosedStatusEvent(rowData?.status_events);
                                        return lastClosedStatusEvent
                                            ? lastClosedStatusEvent.by
                                            : 'N/A';
                                    }}
                                    style={{ minWidth: '10rem' }}
                                    header="Closed By"
                                ></Column>
                                <Column
                                    body={(rowData) => {
                                        const lastClosedStatusEvent = getLastClosedStatusEvent(rowData?.status_events);
                                        return lastClosedStatusEvent
                                            ? new Date(lastClosedStatusEvent.timestamp).toLocaleDateString("en-US", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                second: "numeric"
                                            })
                                            : 'N/A';
                                    }}
                                    style={{ minWidth: '12.4rem' }}
                                    header="Closed Time"
                                ></Column>

                                {/* <Column field="closed_by" header="Closed By" style={{ minWidth: '10rem' }}></Column> */}
                                {/* <Column field="updatedAt" header="Closed Time" style={{ minWidth: '12.4rem' }} body={closedBodyTemplate}></Column> */}
                                <Column field="description" header="Remarks(Description)" style={{ maxWidth: '25rem' }}></Column>
                            </DataTable>
                            <div className="btnPos">
                                <Button size="small" className="w-max prevBtn" label="Previous" onClick={handlePrevious} />
                                <Button size="small" className="w-max nextBtn ml-4" label="Next" onClick={handleNext} />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 xl:col-3 pl-4 lg:overflow-auto " style={{ height: "calc(100vh - 9rem)" }}>


                        <div className='grid '>
                            <div className='col-6 pt-0 pl-0'>
                                <div className='db-card db-1stcard '>
                                    <p className='dbHead'>Open</p> <p className='dbPar'>Tickets</p>
                                    <h1>{OpenCount}</h1>
                                </div>
                            </div>
                            <div className="col-6 pt-0 pl-0">
                                <div className='db-card db-2ndcard '>
                                    <p className='dbHead'>Resolved </p><p className='dbPar'>Tickets</p>
                                    <h1>{ResolvedCount}</h1>
                                </div>
                            </div>
                            <div className="col-12 pl-0 ">
                                <div className='db-card db-3rdcard '>
                                    <p className='dbHead'>Closed </p><p className='dbPar'>Tickets</p>
                                    <h1>{ClosedCount}</h1>
                                </div>
                            </div>
                        </div>
                        <Barchart />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Dashboard;