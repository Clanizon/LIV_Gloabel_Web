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
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Carousel } from 'primereact/carousel';

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
    const [HoldCount, setHoldCount] = useState(0);
    const [selectedUnit, setSelectedUint] = useState('All');
    const [statusEvents, setStatusEvents] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [tableData, setTableData] = useState([]);
    const [morePage, setMorePage] = useState(true);
    const [departmentRes, setDepartmentRes] = useState([]);
    console.log("tableData", tableData)
    const dropdownItemDept = [];
    const [pageNo, setPageNo] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [pageUnitLimit, setPageUnitLimit] = useState(15);
    const [pageUnitNo, setPageUnitNo] = useState(1);
    const [pageDeptLimit, setPageDeptLimit] = useState(20);
    const [pageDeptNo, setPageDeptNo] = useState(1);
    const [visibleDetailPop, setVisibleDetailPop] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const ticketStatus = [
        { name: 'All', _id: 'All' },
        { name: 'Open', _id: 'Open' },
        { name: 'Hold', _id: 'Hold' },
        { name: 'Resolved', _id: 'Resolved' },
        { name: 'Closed', _id: 'Closed' },

    ];

    useEffect(() => {

        getUnit();

    }, []);

    useEffect(() => {
        getUnitCount();
    }, [selectedUnit, selectedDept, selectedStatus]);
    useEffect(() => {

        getTableData();
    }, [selectedUnit, pageNo, pageLimit, selectedDept, selectedStatus]);

    const getTableData = () => {
        setIsLoading(true);
        axios

            .get(constants.URL.DASH_TABLE + selectedStatus + "&department=" + selectedDept + "&unit=" + selectedUnit + '&page=' + pageNo + '&limit=' + pageLimit + '&sort_by=-createdAt', {
                headers: getHeaders(),
            })
            .then((resp) => {

                setTableData(resp.data.results);
                // getLastStatusEvent(resp.data.results?.statusEvents)
                setMorePage(resp.data.results.length === pageLimit);

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
            .get(constants.URL.ALL_PLANT + 'page=' + pageUnitNo + '&limit=' + pageUnitLimit, {
                headers: getHeaders(),
            })
            .then((resp) => {
                console.log("API Response:", resp.data);
                const newData = [
                    {

                        _id: 'All',
                        name: 'All'
                    },
                    ...resp.data.results
                ];
                setPlanData(newData);
                setSelectedUint('All');

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
            .get(constants.URL.DASH_COUNT + selectedStatus + "&unit=" + selectedUnit + "&department=" + selectedDept, {
                headers: getHeaders(),
            })
            .then((resp) => {
                console.log("API Response:", resp.data);
                setOpenCount(resp.data?.results?.Open);
                setResolvedCount(resp.data?.results?.Resolved);
                setHoldCount(resp.data?.results?.Hold);
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
    const handleStatusChange = (e) => {
        setSelectedStatus(e.value);
        setPageNo(1);
    };
    const handleUnitChange = (e) => {
        setSelectedUint(e.value);
        setPageNo(1);
    };

    const handleDeptChange = (e) => {
        setSelectedDept(e.value);
        setPageNo(1);
    };
    useEffect(() => {
        setIsLoading(true);
        axios
            .get(constants.URL.ALL_DEPARTMENT + selectedUnit + '?sort_by=name&page=' + pageDeptNo + '&limit=' + pageDeptLimit, {
                headers: getHeaders(),
            })
            .then((resp) => {
                console.log("API Response:", resp.data);
                const newData = [
                    {
                        name: 'All',
                        _id: 'All'
                    },
                    ...resp.data.results
                ];
                setDepartmentRes(newData);
                setSelectedDept('All')
            })
            .catch((e) => {
                console.error("API Error:", e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [selectedUnit]);
    const handleViewClick = (ticketId) => {
        setIsLoading(true);
        axios
            .get(constants.URL.GET_TIKET_DETAIL + ticketId, {
                headers: getHeaders(),
            })
            .then((resp) => {
                console.log("API Response:", resp.data);
                setSelectedTicket(resp.data?.results);
                setVisibleDetailPop(true);
            })
            .catch((e) => {
                console.error("API Error:", e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    const gallTemplate = (item) => {
        return (
            <div className="">
                <div className="mb-3">
                    <img src={item} alt='img' style={{ width: '100%' }} />
                </div>

            </div>
        );
    };

    const renderTimelineContent = (event) => {
        return (
            <Card title={event.status} subTitle={new Date(event.timestamp).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            })}>
                {event.pictures && event.pictures.length > 0 && (
                    // <img src={event.pictures[0]} alt={event.status} width={200} className="shadow-1" />

                    <Carousel value={event.pictures} numVisible={1} numScroll={1} orientation="horizontal"
                        style={{ width: '100%' }}
                        itemTemplate={gallTemplate} />
                )}


                <p className='cardPara'>Name: <span>{event?.by?.name ? event?.by?.name : 'N/A'}</span></p>
                <p className='cardPara'>Description:  <span>{event?.description ? event?.description : 'N/A'}</span></p>
            </Card>
        );
    };


    const customizedMarker = (item) => {
        let color;
        switch (item.status) {
            case 'Open':
                color = 'rgb(217,230,255)';
                break;
            case 'Resolved':
                color = 'rgb(207,255,221)';
                break;
            case 'Closed':
                color = 'rgb(255,243,214)';
                break;

            case 'Hold':
                color = 'rgb(220,214,255)';
                break;

            default:
                color = '#000000';
        }

        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" style={{ backgroundColor: color }}>
                <i className={item.icon}></i>
            </span>
        );
    };
    return (
        <div className='w-full'>
            <div className='db-wrapper'>
                <div className="grid mx-0">
                    <div className="col-12 xl:col-9 db-chart ds-table-height mb-0 leftside">
                        <div className=''>
                            <div className='flex justify-content-between align-items-center'>
                                <h4 className='db-heading'>Tickets</h4>
                                <div className='flex'>
                                    {!isLoading && planData.length > 0 && (
                                        <div className='dropDesign'>
                                            <label>Plant</label>
                                            <Dropdown
                                                value={selectedUnit}
                                                style={{ width: '12rem', margin: '0.3rem' }}
                                                className='dropBox'
                                                onChange={handleUnitChange}
                                                placeholder={selectedUnit}
                                                options={planData}
                                                optionLabel="name"
                                                optionValue="_id"
                                            />
                                        </div>
                                    )}


                                    {!isLoading && departmentRes.length > 0 && (
                                        <div className='dropDesign'>
                                            <label>Department</label>
                                            <Dropdown
                                                value={selectedDept}
                                                style={{ width: '12rem', margin: '0.3rem' }}
                                                className='dropBox'
                                                onChange={handleDeptChange}
                                                placeholder='All'
                                                options={departmentRes}
                                                optionLabel="name"
                                                optionValue="_id"
                                            />
                                        </div>
                                    )}


                                    {/* {!isLoading && departmentRes.length === 1 && (
                                        <div className='PlantBox'>{departmentRes[0].name}</div>
                                    )} */}
                                    {!isLoading && (
                                        <div className='dropDesign'>
                                            <label>Status</label>
                                            <Dropdown
                                                value={selectedStatus}
                                                style={{ width: '12rem', margin: '0.3rem' }}
                                                className='dropBox'
                                                onChange={handleStatusChange}

                                                placeholder='All'
                                                options={ticketStatus}

                                                optionLabel="name"
                                                optionValue="_id"
                                            />
                                        </div>
                                    )}


                                    {/* {!isLoading && departmentRes.length === 1 && (
                                        <div className='PlantBox'>{departmentRes[0].name}</div>
                                    )} */}


                                </div>
                            </div>
                            <DataTable removableSort value={tableData} responsiveLayout="scroll" rows={20}
                                dataKey="id"
                                globalFilterFields={['department']} emptyMessage="No Tickets found.">
                                <Column field="hash_id" header="Ticket Id" style={{ minWidth: '4rem' }}></Column>
                                <Column field="createdAt" header="Raised On" body={(rowData) => {
                                    const date = new Date(rowData?.createdAt);
                                    return date?.toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    });
                                }} ></Column>
                                <Column field="department.name" header="Department" showFilterMatchModes={false}></Column>
                                <Column field="assignor.name" header="Raised By" ></Column>

                                <Column field="issue_severity" header="Severity" ></Column>
                                <Column field="issue_type" header="Category" ></Column>
                                <Column field="escalation_settings.duration" header="Escation Duration"></Column>
                                <Column
                                    field="current_assignee.name"

                                    header="Current Assignee"
                                ></Column>
                                <Column field="status"
                                    header="Status"></Column>
                                <Column
                                    body={(rowData) => {
                                        const lastClosedStatusEvent = getLastClosedStatusEvent(rowData?.status_events);
                                        return lastClosedStatusEvent
                                            ? lastClosedStatusEvent.by
                                            : 'N/A';
                                    }}

                                    header="Closed By"
                                ></Column>
                                <Column
                                    body={(rowData) => {
                                        const lastClosedStatusEvent = rowData?.status_events?.length > 0 ? getLastClosedStatusEvent(rowData.status_events) : null;
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

                                    header="Closed On"
                                ></Column>

                                {/* <Column field="closed_by" header="Closed By" style={{ minWidth: '10rem' }}></Column> */}
                                {/* <Column field="updatedAt" header="Closed Time" style={{ minWidth: '12.4rem' }} body={closedBodyTemplate}></Column> */}
                                <Column field="description" header="Description" ></Column>
                                <Column
                                    header="Ticket Detail"
                                    body={(rowData) => (
                                        <Button
                                            label="View"
                                            // icon="pi pi-eye"
                                            className='p-button p-component w-max viewBtn'
                                            onClick={() => handleViewClick(rowData._id)}
                                        />
                                    )}
                                    style={{ textAlign: 'center', width: '6rem' }}
                                ></Column>

                            </DataTable>
                            <div className="btnPos">
                                {pageNo > 1 && <Button size="small" className="w-max prevBtn" label="Previous" onClick={handlePrevious} />}
                                {morePage && <Button size="small" className="w-max nextBtn ml-4" label="Next" onClick={handleNext} />}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 xl:col-3 diahead dashbox lg:overflow-auto " style={{ background: '#fff', height: "calc(100vh - 9rem)" }}>


                        <div className='grid '>
                            <div className='col-12 pl-0'>
                                <div className='db-card db-1stcard '>
                                    <p className='dbHead'>Open</p> <p className='dbPar'>Tickets</p>
                                    <h1>{OpenCount}</h1>
                                </div>
                            </div>
                            <div className="col-12 pl-0">
                                <div className='db-card db-2ndcard '>
                                    <p className='dbHead'>Hold </p><p className='dbPar'>Tickets</p>
                                    <h1>{HoldCount}</h1>
                                </div>
                            </div>
                            <div className="col-12 pl-0">
                                <div className='db-card db-3rdcard '>
                                    <p className='dbHead'>Resolved </p><p className='dbPar'>Tickets</p>
                                    <h1>{ResolvedCount}</h1>
                                </div>
                            </div>
                            <div className="col-12 pl-0 ">
                                <div className='db-card db-4thcard '>
                                    <p className='dbHead'>Closed </p><p className='dbPar'>Tickets</p>
                                    <h1>{ClosedCount}</h1>
                                </div>
                            </div>
                        </div>
                        {/* <Barchart /> */}
                    </div>
                </div>
            </div>
            <Dialog
                header="Ticket Detail"
                visible={visibleDetailPop}
                style={{ width: "65vw" }}
                onHide={() => setVisibleDetailPop(false)}
            >
                <div className='boxpart'>

                    {selectedTicket && (
                        <>
                            <div className='flex'>
                                <div className='diahead col-3'>
                                    <h4>Ticket ID</h4>
                                    <p>{selectedTicket?.hash_id}</p>
                                </div>
                                <div className='diahead col-3'>
                                    <h4>Assigner Name</h4>
                                    <p>{selectedTicket?.assignor.name}</p>
                                </div>
                                <div className='diahead col-3'>
                                    <h4>Created On</h4>
                                    <p>{new Date(selectedTicket?.createdAt).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        second: "numeric"
                                    })}</p>
                                </div>
                                <div className='diahead col-3'>
                                    <h4>Department </h4>
                                    <p>{selectedTicket?.department?.name}</p>
                                </div>

                            </div>

                            <div className='flex'>
                                <div className='diahead col-3'>
                                    <h4>Category</h4>
                                    <p>{selectedTicket?.issue_type}</p>
                                </div>
                                <div className='diahead col-3'>
                                    <h4>Severity</h4>
                                    <p>{selectedTicket?.issue_severity}</p>
                                </div>

                                <div className='diahead col-3'>
                                    <h4>Description </h4>
                                    <p>{selectedTicket?.description}</p>
                                </div>
                                <div className='diahead col-3'>
                                    <h4>Ticket Status </h4>
                                    <p>{selectedTicket?.status}</p>
                                </div>
                            </div></>
                    )}
                </div>
                <h1 className='timeHead'>Ticket Status Event</h1>
                <Timeline
                    value={selectedTicket?.status_events}
                    align="alternate"
                    className="customized-timeline"
                    marker={customizedMarker}
                    content={renderTimelineContent}
                />



            </Dialog>

        </div >


    )
}

export default Dashboard;