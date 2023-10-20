import React, { useEffect } from "react";
import { TabMenu } from 'primereact/tabmenu';
import { useStoreActions, useStoreState } from "easy-peasy";
import Department from "./Department";
import Leave from "./Leave";
import Ticket from "./Ticket";
import Plant from "./Plant";
import AllTrainee from "./AllTrainee";
import AddTrainee from "./AddTrainee";
const SettingTab = () => {
    const setActiveIndex = useStoreActions((actions) => actions.tabModel.setActiveIndex);
    const activeIndex = useStoreState((actions) => actions.tabModel.activeIndex);
    const departmentLength = useStoreState((state) => state.tabModel.departmentLength);

    useEffect(() => {
        setActiveIndex(0)
    }, []);

    const items = [
        // { label: 'Plant' },
        { label: 'Department' },
        { label: 'Add Member', disabled: departmentLength === 0 },
        { label: 'View Members', disabled: departmentLength === 0 },

    ];

    return (
        <>
            <div className="Trainee-wrapper" >
                <TabMenu style={{ marginTop: '0px' }} model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                {/* {activeIndex === 0 && <Plant />} */}
                {activeIndex === 0 && <Department />}
                {activeIndex === 1 && <AddTrainee />}
                {activeIndex === 2 && <AllTrainee />}


            </div>
        </>
    )
}
export default SettingTab;