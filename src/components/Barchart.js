
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import constants from '../constants/constants';
import axios from 'axios';
import { useStoreState } from 'easy-peasy';

export default function Barchart() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    // const [barData, setBarData] = useState();
    const barData = useStoreState((state) => state.tabModel.barData);

    // useEffect(() => {
    //     setIsLoading(true);
    //     axios
    //         .get(constants.URL.ALL_TICKET_LIST)
    //         .then((resp) => {
    //             setBarData(resp.data.results);
    //         })
    //         .catch((e) => console.error(e))
    //         .finally(() => {
    //             setIsLoading(false);
    //         });
    // }, []);


    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const monthData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const totalTickets = [];
        barData?.forEach((item) => {
            const createdAt = new Date(item.createdAt);
            const month = createdAt.getMonth();
            const assignedUserStatus = item.assigned_user_status;
            if (assignedUserStatus === "Open") {
                monthData[month]++;
            }
        });

        monthData?.forEach((count) => {
            totalTickets.push(count);
        });

        console.log(monthData);
        console.log(totalTickets);
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Open Ticket',
                    backgroundColor: "#0e0e0e",
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: totalTickets
                },
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [barData]);

    return (
        <div className="rightside mt-2 pl-0 pt-0">
            <h1 className='barhead'>Dashboard</h1>
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    )
}
