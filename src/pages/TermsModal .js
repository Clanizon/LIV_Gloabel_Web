import { useStoreActions, useStoreState } from "easy-peasy";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";

const TermsModal = ({ visible, onClose }) => {


    const setTermsStatus = useStoreActions((actions) => actions.tabModel.setTermsStatus);
    const termsStatus = useStoreState((state) => state.tabModel.termsStatus);


    const handleCancel = () => {
        onClose();
    }
    const handleYes = () => {
        setTermsStatus(true);
        onClose();
    }
    return (
        <Dialog header="Terms and Conditions" visible={visible} onHide={onClose} style={{ width: "80vw" }}>
            <div className="custom-modal-content">
                <iframe
                    className="custom-iframe"
                    src="https://policies.razolve.com/terms-conditions.html"
                    title="External Content"
                />
                <iframe
                    className="custom-iframe"
                    src="https://policies.razolve.com/privacy-policy.html"
                    title="External Content"
                />
            </div>
            <div className="flex justify-content-end">
                <Button size="small" className="AU-save-btn p-button-rounded ml-3" onClick={handleCancel} label="Cancel" />
                <Button size="small" className="AU-save-btn p-button-rounded ml-3" onClick={handleYes} label="Yes" />
            </div>
        </Dialog>
    );
};

export default TermsModal;
