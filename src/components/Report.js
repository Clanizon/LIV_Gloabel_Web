import React, { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import constants from '../constants/constants';
import getHeaders from '../constants/Utils';

function Report() {

    const [isLoading, setIsLoading] = useState(false);

    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const fetchData = () => {
        setIsLoading(true);
        const formattedFromDate = formatDate(fromDate);
        const formattedToDate = formatDate(toDate);
        axios
            .get(constants.URL.EXCEL_DOWNLOAD + formattedFromDate + '&date_to=' + formattedToDate, {
                responseType: 'blob',
                headers: getHeaders(),
            })
            .then((resp) => {
                const fileName = 'report.xlsx';

                const blob = new Blob([resp.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            })
            .catch((e) => {
                console.error("API Error:", e);
            })
            .finally(() => {
                setIsLoading(false);
            });


    };

    const formatDate = (date) => {
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    };
    return (
        <div className='w-full mainBanner p-2'>
            <div className='db-wrapper'>
                <div className="grid mx-0">
                    <h4 className='plant-heading' style={{ width: '100%' }}>Report</h4>
                    <div className='flex dateBox '>
                        <div>
                            <label className='plantSize mr-2'>From Date:</label>
                            <Calendar
                                value={fromDate}
                                onChange={(e) => setFromDate(e.value)}
                                showIcon={true}
                                dateFormat="mm/dd/yy"
                            />
                        </div>

                        <div>
                            <label className='plantSize mr-2'>To Date:</label>
                            <Calendar
                                value={toDate}
                                onChange={(e) => setToDate(e.value)}
                                showIcon={true}
                                dateFormat="mm/dd/yy"
                            />
                        </div>

                        <button onClick={() => fetchData()} className=' p-button p-component AU-save-btn w-max p-button-rounded mr-4 mb-2'>Fetch Data</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Report;