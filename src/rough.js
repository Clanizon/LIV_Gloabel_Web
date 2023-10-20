import React, { useEffect, useState } from 'react';
import greenC from "../images/green-card.png"
import pinkC from "../images/pink-card.png"
import blueC from "../images/blue-card.png"
import { InputText } from 'primereact/inputtext';
import "../assets/css/dashboard.css"
import { useStoreActions, useStoreState } from 'easy-peasy';
import axios from 'axios';
import constants from '../constants/constants';
import back from "../images/next-forward-right.png"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [viewScreen, setViewScreen] = useState(false);
    const [list, setList] = useState();
    const setTraineesList = useStoreActions((actions) => actions.tabModel.setTraineesList);
    const traineesList = useStoreState((state) => state.tabModel.traineesList);
    const setGameScoreStatus = useStoreActions((actions) => actions.tabModel.setGameScoreStatus);
    const gameScoreStatus = useStoreState((state) => state.tabModel.gameScoreStatus);

    useEffect(() => {
        setIsLoading(true);
        axios
            .get(constants.URL.ALL_TRAINEES_LIST)
            .then((resp) => {
                setTraineesList(resp.data.results);
            })
            .catch((e) => console.error(e))
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        setIsLoading(true);
        axios
            .get(constants.URL.Trainee_Game_Status)
            .then((resp) => {
                setGameScoreStatus(resp.data.results);
            })
            .catch((e) => console.error(e))
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const uniqueEmployees = {};

    gameScoreStatus?.forEach((employee) => {
    const { user_id, level, status } = employee;
    const empId = user_id?.employee_ID;

    if (level == "Level 6" && status == "Pass") {
        uniqueEmployees[empId] = employee;
    }
    });
    const filteredEmployeeRecords = Object.values(uniqueEmployees);
    // console.log(filteredEmployeeRecords);

    const handleAllTraineeList = ()=>{
        setViewScreen(true)
        const uniqueTrainees = {};
    
        gameScoreStatus?.forEach((employee) => {
        const { user_id, level } = employee;
        const empId = user_id?.employee_ID;
    
        if (!uniqueTrainees[empId] || uniqueTrainees[empId].level < level) {
            uniqueTrainees[empId] = employee;
        }
        });
        const filteredTrainees = Object.values(uniqueTrainees);
        setList(filteredTrainees)
    }

    const handleTraineeCompleteList = ()=>{
        setViewScreen(true)
        const uniqueCompleteEmployees = {};
    
        gameScoreStatus?.forEach((employee) => {
        const { user_id, level, status } = employee;
        const empId = user_id?.employee_ID;
    
        if (level == "Level 6" && status == "Pass") {
            uniqueCompleteEmployees[empId] = employee;
        }
        });
        const filteredEmployeeRecordsList = Object.values(uniqueCompleteEmployees);
        // console.log(filteredEmployeeRecordsList);
        setList(filteredEmployeeRecordsList)
    }

    const handleTraineeProgressList = ()=>{
        setViewScreen(true)
        const uniqueInProgessEmployees = {};
        const uniqueCompletedEmployees = {};
    
        gameScoreStatus?.forEach((employee) => {
        const { user_id, level, status } = employee;
        const empId = user_id?.employee_ID;

        if (level == "Level 6" && status == "Pass") {
            uniqueCompletedEmployees[empId] = employee;
        }
    
        if (level <= "Level 6") {
            uniqueInProgessEmployees[empId] = employee;
        }
        });
        const filteredEmployeeRecordsList = Object.values(uniqueCompletedEmployees);
        const filteredProgressList = Object.values(uniqueInProgessEmployees);
        // console.log(filteredProgressList);

        // Remove elements present in filteredEmployeeRecordsList from filteredProgressList
        const finalProgressList = filteredProgressList.filter(
            (employee) => !filteredEmployeeRecordsList.includes(employee)
        );

        console.log(finalProgressList);
        setList(finalProgressList);
    }

    const handleBack = () => {
        setViewScreen(false)
    }
    const downloadExcel = () => {
    
    // Extract selected properties for each data object
    const filteredData = list.map(({ user_id, level, step, game_name, status }) => ({
        "Employee ID": user_id.employee_ID,
        "First Name": user_id.first_name,
        "Last Name": user_id.last_name,
        "Department": user_id.department,
        "Joining Date": new Date(user_id.joining_date).toLocaleDateString(),
        "Game Name": game_name,
        "Level": level,
        "Step": step,
        "Status": status
      }));
  
      // Convert filtered data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
  
    
        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
        // Convert workbook to Excel file
        const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    
        // Create Blob from the Excel file
        const blob = new Blob([s2ab(excelFile)], { type: 'application/octet-stream' });
    
        // Download the file
        FileSaver.saveAs(blob, 'data.xlsx');
      };
    
      // Utility function to convert data to ArrayBuffer
      const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      };

    return (
        <>
        {
         !viewScreen ? (
            <div>
                <div className='flex md:flex-row flex-column justify-content-between align-items-center lg:mt-5 mb-3'>
                <div className='dash-hello-text'><span className='dash-hello-text-bold'>Hello</span> Admin!</div>
            </div>
            <div className="grid">
            <div className="col-12 sm:col-6 md:col-4 xl:col-3 relative" onClick={handleAllTraineeList} >
                <img src={greenC} className='w-full' />
                <div className='absolute top-0 text-white card-content'>
                    <h1>{traineesList?.length}</h1>
                    <p>Trainees Regist</p>
                </div>
            </div>
            <div className="col-12 sm:col-6 md:col-4 xl:col-3 relative" onClick={handleTraineeProgressList}>
                <img src={pinkC} className='w-full' />
                <div className='absolute top-0 text-white card-content'>
                    <h1>{traineesList?.length - filteredEmployeeRecords?.length}</h1>
                    <p>Trainees yet to take Trainings</p>
                </div>
            </div>
            <div className="col-12 sm:col-6 md:col-4 xl:col-3 relative" onClick={handleTraineeCompleteList}>
                <img src={blueC} className='w-full' />
                <div className='absolute top-0 text-white card-content'>
                    <h1>{filteredEmployeeRecords?.length}</h1>
                    <p>Training Completed</p>
                </div>
            </div>
            </div>
            </div>
         ) : 
         <div>
             <div className='flex align-items-center lg:mt-5 lg:pt-2 mb-3' onClick={handleBack} >
                 <img src={back} className='' alt='arrow-back' />
                 <h1 className='ts-heading my-0 ml-3'>Back</h1>
             </div>
            <button onClick={downloadExcel}>Download Excel</button>
             <div className="grid table-demo">
                    <div className="col-12">
                        <div className="card">
                            <DataTable className='' value={list} responsiveLayout="scroll">
                                <Column field="user_id.employee_ID" header="Employee ID"></Column>
                                <Column field="user_id.first_name" header="First Name"></Column>
                                <Column field="user_id.last_name" header="Last Name"></Column>
                                <Column field="user_id.department" header="Department"></Column>
                                <Column field="level" header="Training Level Completed"></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
        </div>
        }
        </>
        
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Dashboard, comparisonFn);
