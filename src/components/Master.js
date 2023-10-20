import React, { useEffect } from "react";
import { TabMenu } from 'primereact/tabmenu';
import AllTrainee from "./AllTrainee";
import AddTrainee from "./AddTrainee";
import { useStoreActions, useStoreState } from "easy-peasy";

const Master = () => {
    const setActiveIndex = useStoreActions((actions) => actions.tabModel.setActiveIndex);
    const activeIndex = useStoreState((actions) => actions.tabModel.activeIndex);

    useEffect(() => {
        setActiveIndex(0)
    }, []);

    const items = [
        { label: 'All Members' },
        { label: 'Add Member' },
    ];

    return (
        <>
            <div className="Trainee-wrapper">
                <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                {activeIndex === 0 && <AllTrainee />}
                {activeIndex === 1 && <AddTrainee />}
            </div>
        </>
    )
}
export default Master;