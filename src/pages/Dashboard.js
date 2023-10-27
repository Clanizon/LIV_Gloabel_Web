import React, { useEffect, useState } from 'react';
import Barchart from '../components/Barchart';
import Header from '../components/Header';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from 'axios';
import constants from '../constants/constants';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { useStoreActions, useStoreState } from 'easy-peasy';

function Dashboard() {

    const [isLoading, setIsLoading] = useState(false);
    // const [data, setData] = useState();
    const setData = useStoreActions((actions) => actions.tabModel.setData);
    const data = useStoreState((state) => state.tabModel.data);
    const setBarData = useStoreActions((actions) => actions.tabModel.setBarData);
    const [selectedDept, setSelectedDept] = useState();

    const dropdownItemDept = [];
    console.log(selectedDept);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        created_user_status: { value: null, matchMode: FilterMatchMode.EQUALS },
        department: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

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
    //             if(selectedDept && selectedDept !== 'Clear All'){
    //             let filteredDepartmentData = resp?.data?.results?.filter((item)=>{
    //                 return item.department == selectedDept?.toLowerCase()
    //             })
    //             setData(filteredDepartmentData);
    //             setBarData(filteredDepartmentData);
    //         }else {
    //             setData(resp?.data?.results);
    //             setBarData(resp?.data?.results);
    //         }
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
    console.log(OpenCount);
    const [statuses] = useState(['open']);



    const countryBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.department}`} style={{ width: '24px' }} />
                <span>{rowData.department}</span>
            </div>
        );
    };

    const [representatives] = useState(['open', 'closed', 'resolved', 'hold'])
    const representativeBodyTemplate = (rowData) => {
        const representative = rowData.created_user_status;

        return (
            <div className="flex align-items-center gap-2">
                <span>{representative}</span>
            </div>
        );
    };

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
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Any"
                className="p-column-filter"
                style={{ minWidth: '8rem' }}
            />
        );
    };

    return (
        <div className='w-full'>
            <Header />
            <div className='db-wrapper'>
                <div className='flex justify-content-between align-items-center'>
                    <h4 className=' db-heading'>Dashboard</h4>
                    <Dropdown value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} options={dropdownItemDept} />
                </div>
                <div className="grid mx-0">
                    <div className="col-12 lg:col-9 db-chart">
                        <Barchart />
                    </div>
                    <div className="col-12 lg:col-3 py-0 pl-4">
                        <div className='row'>
                            <div className='col db-card db-1stcard'>
                                <h1>{OpenCount}</h1>
                                <p>Open Tickets</p>
                            </div>
                            <div className="col db-card db-2ndcard">
                                <h1>{ResolvedCount}</h1>
                                <p>Resolved Tickets</p>
                            </div>
                            <div className="col db-card db-3rdcard">
                                <h1>{ClosedCount}</h1>
                                <p>Closed Tickets</p>
                            </div>
                        </div>
                    </div>
                </div>
                <h4 className='db-heading'>Tickets</h4>
                <DataTable className='' value={data} responsiveLayout="scroll" paginator rows={10}
                    dataKey="id" filters={filters} filterDisplay="row"
                    globalFilterFields={['department']} emptyMessage="No Tickets found.">
                    <Column field="ticket_number" header="Ticket No"></Column>
                    <Column field="createdAt" header="Time Ticket Raised" body={(rowData) => {
                        const date = new Date(rowData?.createdAt);
                        return date?.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        });
                    }}></Column>
                    <Column field="department" filterField="department" body={countryBodyTemplate} filter showFilterMenu={false} header="Ticket Department"></Column>
                    <Column field="created_user.user_name" header="Raised By"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="created_user_status" filterField="created_user_status" showFilterMenu={false} filterMenuStyle={{ width: '8rem' }} style={{ width: '8rem' }}
                        body={representativeBodyTemplate} filter filterElement={representativeRowFilterTemplate} header="Status"></Column>
                    <Column field="closed_by" header="Closed By"></Column>
                    <Column field="updatedAt" header="Closed Time"></Column>
                    <Column field="description" header="Remarks(Description)" style={{ width: "200px" }}></Column>
                </DataTable>
            </div>
        </div>
    )
}

export default Dashboard;