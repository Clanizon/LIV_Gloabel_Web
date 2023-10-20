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

function Dashboard() {

    const [isLoading, setIsLoading] = useState(false);
    const setData = useStoreActions((actions) => actions.tabModel.setData);
    const data = useStoreState((state) => state.tabModel.data);
    const setBarData = useStoreActions((actions) => actions.tabModel.setBarData);
    const [selectedDept, setSelectedDept] = useState();

    const dropdownItemDept = ['msf production', 'quality (assy)', 'quality (msf)', 'npd', 'npd quality', 'customer quality',
        'marketing', 'project team', 'purchase/logistics', 'safety', 'hr/admin', 'training', 'store', 'wip', 'packing',
        'sales', '5s', 'despatch', 'maintenance', 'assy production'];

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

    // useEffect(() => {
    //     setIsLoading(true);
    //     axios
    //         .get(constants.URL.ALL_TICKET_LIST)
    //         .then((resp) => {
    //             setData(resp.data.results);
    //             setBarData(resp.data.results);
    //         })
    //         .catch((e) => console.error(e))
    //         .finally(() => {
    //             setIsLoading(false);
    //         });
    // }, []);

    // useEffect(() => {
    //     setIsLoading(true);
    //     axios
    //         .get(constants.URL.ALL_TICKET_LIST)
    //         .then((resp) => {
    //             if (selectedDept && selectedDept !== 'Clear All') {
    //                 setFilters({
    //                     global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    //                     created_user_status: { value: null, matchMode: FilterMatchMode.EQUALS },
    //                     department: { value: null, matchMode: FilterMatchMode.IN },
    //                 })
    //                 let filteredDepartmentData = resp?.data?.results?.filter((item) => {
    //                     return item.department == selectedDept?.toLowerCase()
    //                 })
    //                 setData(filteredDepartmentData);
    //                 setBarData(filteredDepartmentData);
    //             } else {
    //                 setData(resp?.data?.results);
    //                 setBarData(resp?.data?.results);
    //             }
    //         })
    //         .catch((e) => console.error(e))
    //         .finally(() => {
    //             setIsLoading(false);
    //         });
    // }, [selectedDept]);

    let OpenCount = 0;
    let ResolvedCount = 0;
    let ClosedCount = 0;

    data?.forEach((employee) => {
        const { assigned_user_status, created_user_status } = employee;

        if (assigned_user_status == "Open") {
            OpenCount++;
        }
        if (assigned_user_status == "resolved") {
            ResolvedCount++;
        }
        if (created_user_status == "closed") {
            ClosedCount++;
        }
    });
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
                    <div className="col-12 xl:col-9 db-chart ds-table-height mb-0">
                        <div className=''>
                            <div className='flex justify-content-between align-items-center'>
                                <h4 className='db-heading'>Tickets</h4>
                                <div>
                                    <Dropdown value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}
                                        className="filterclass"
                                        style={{ width: '12rem' }}
                                        placeholder="Department Search" options={dropdownItemDept} />
                                    {/* <div className="ls-btn-wrapper ml-3 inline">
                                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                                    </div> */}
                                </div>
                            </div>
                            <DataTable removableSort value={data} responsiveLayout="scroll" paginator rows={10}
                                dataKey="id" filters={filters}
                                globalFilterFields={['department']} emptyMessage="No Tickets found.">
                                <Column field="ticket_number" header="Ticket No" style={{ minWidth: '5rem' }}></Column>
                                <Column field="createdAt" header="Ticket Raised" body={(rowData) => {
                                    const date = new Date(rowData?.createdAt);
                                    return date?.toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    });
                                }} style={{ minWidth: '12rem' }}></Column>
                                <Column field="department" filterField="department" filter filterMenuStyle={{ width: '8rem' }} style={{ minWidth: '13.5rem' }} filterElement={depRowFilterTemplate} header="Ticket Department" showFilterMatchModes={false}></Column>
                                <Column field="created_user.user_name" header="Raised By" style={{ minWidth: '10rem' }}></Column>
                                <Column field="category" header="Category" style={{ minWidth: '12rem' }}></Column>
                                <Column field="timelineToSortOut" style={{ minWidth: '8rem' }} header="Resolution Time"></Column>
                                <Column field="assigned_user.user_name" style={{ minWidth: '9rem' }} header="Current Status"></Column>
                                <Column field="created_user_status" filterField="created_user_status" style={{ minWidth: '8rem' }} showFilterMatchModes={false}
                                    filter filterElement={representativeRowFilterTemplate} header="Status"></Column>
                                <Column field="closed_by" header="Closed By" style={{ minWidth: '10rem' }}></Column>
                                <Column field="updatedAt" header="Closed Time" style={{ minWidth: '12.4rem' }} body={closedBodyTemplate}></Column>
                                <Column field="description" header="Remarks(Description)" style={{ maxWidth: '25rem' }}></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="col-12 xl:col-3 pl-4 lg:overflow-auto" style={{ height: "calc(100vh - 9rem)" }}>
                        <div className='grid'>
                            <div className='col-6'>
                                <div className='db-card db-1stcard border-round'>
                                    <p className='dbHead'>Open</p> <p className='dbPar'>Tickets</p>
                                    <h1>{OpenCount}</h1>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className='db-card db-2ndcard border-round'>
                                    <p className='dbHead'>Resolved </p><p className='dbPar'>Tickets</p>
                                    <h1>{ResolvedCount}</h1>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className='db-card db-3rdcard border-round'>
                                    <p className='dbHead'>Closed </p><p className='dbPar'>Tickets</p>
                                    <h1>{ClosedCount}</h1>
                                </div>
                            </div>
                        </div>
                        <Barchart />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;