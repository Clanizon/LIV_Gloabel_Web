import React, { useEffect } from "react";
import { TabMenu } from 'primereact/tabmenu';
import ViewMember from "./ViewMember";
import AddMemeber from "./AddMemeber";
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
                {activeIndex === 0 && <ViewMember />}
                {activeIndex === 1 && <AddMemeber />}
            </div>
        </>
    )
}
export default Master;