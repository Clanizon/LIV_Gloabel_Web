import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import constants from "../constants/constants";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import getHeaders from "../constants/Utils";

const ViewMember = () => {
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const setTraineesList = useStoreActions((actions) => actions.tabModel.setTraineesList);
    const traineesList = useStoreState((state) => state.tabModel.traineesList);
    const setSelectedData = useStoreActions((actions) => actions.tabModel.setSelectedData);
    const selectedUnitId = useStoreState((state) => state.tabModel.selectedUnitId);
    const [pageNo, setPageNo] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [morePage, setMorePage] = useState(true);

    const getUser = () => {
        setIsLoading(true);
        axios
            .get(constants.URL.ALL_Depart_USER + selectedUnitId + "?sort_by=email&page=" + pageNo + '&limit=' + pageLimit, {
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
        setSelectedData()
    }

    useEffect(() => {
        getUser()
    }, []);

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
                        <DataTable value={traineesList} responsiveLayout="scroll" >
                            <Column field="name" header="Name"></Column>
                            <Column field="email" header="Email ID" style={{ minWidth: '15rem' }}></Column>

                        </DataTable>
                    </div>
                </div>
                {traineesList.length > 0 && (
                    <div className="btnPos" style={{ width: '100%' }}>

                        {pageNo > 1 && <Button size="small" className="w-max prevBtn" label="Previous" onClick={handlePrevios} />}
                        {morePage && <Button size="small" className="w-max nextBtn ml-4" label="Next" onClick={handleNext} />}
                    </div>
                )}
            </div>

        </div>
    );
};

export default ViewMember;