import React, { useEffect } from "react";
import { TabMenu } from 'primereact/tabmenu';
import { useStoreActions, useStoreState } from "easy-peasy";
import Department from "./Department";
import ViewMember from "./ViewMember";
import AddMemeber from "./AddMemeber";
const SettingTab = () => {
    const setActiveIndex = useStoreActions((actions) => actions.tabModel.setActiveIndex);
    const activeIndex = useStoreState((actions) => actions.tabModel.activeIndex);
    const departmentLength = useStoreState((state) => state.tabModel.departmentLength);

    useEffect(() => {
        setActiveIndex(0)
    }, []);

    const items = [
        { label: 'Department' },
        { label: 'Add Member', disabled: departmentLength === 0 },
        { label: 'View Members', disabled: departmentLength === 0 },

    ];

    return (
        <>
            <div className="Trainee-wrapper" >
                <TabMenu style={{ marginTop: '0px' }} model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                {activeIndex === 0 && <Department />}
                {activeIndex === 1 && <AddMemeber />}
                {activeIndex === 2 && <ViewMember />}


            </div>
        </>
    )
}
export default SettingTab;