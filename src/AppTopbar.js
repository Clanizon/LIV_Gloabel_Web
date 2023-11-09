import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import logo from './images/amphe.png';
import profile from './images/profile-pic.png';
import { Menu } from 'primereact/menu';
import { useStoreActions } from 'easy-peasy';
import { Dialog } from 'primereact/dialog';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import classNames from "classnames";
import { Toast } from "primereact/toast";

import axios from "axios";
import constants from './constants/constants';
import getHeaders from './constants/Utils';
export const AppTopbar = (props) => {
    const menu = useRef(null);
    let history = useHistory();
    const setUser = useStoreActions((action) => action.loginModel.setUser);
    const setIsAuthenticated = useStoreActions((actions) => actions.tabModel.setIsAuthenticated);
    const [changeVisible, setChangeVisible] = useState(false);
    const defaultValues = { name: '' }
    const form = useForm({ defaultValues });
    const errors = form.formState.errors;
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef(null);
    const setUserRole = useStoreActions((action) => action.loginModel.setUserRole);

    let items = [
        {
            label: "Change Password",
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                setChangeVisible(true)
            },
        },
        {
            label: "Logout",
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                setUser(null);
                history.replace("/");
                localStorage.removeItem("e-portal-access-token");
                setIsAuthenticated(false);
                setUserRole('user');
            },
        },
    ];
    const handleLogoClick = () => {
        history.push("/app/defaultnav");
    };
    const onSubmit = (data) => {
        setIsLoading(true);
        const payload = {
            password: data.name,

        };
        axios.patch(constants.URL.CHANGE_PWD, payload, {
            headers: getHeaders(),
        })
            .then((resp) => {

                if (toast.current) {
                    toast.current.show({ severity: "success", summary: "Success", detail: "Item updated successfully" });
                }
                form.reset();
                setChangeVisible(false);
            })
            .catch((e) => {

                if (toast.current) {
                    toast.current.show({ severity: "error", summary: "Failure", detail: e?.response?.data?.message });
                }
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);

            });
    };
    return (
        <div className="layout-topbar">
            <Menu model={items} popup ref={menu} />
            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>
            <div className='layout-topbar-logo ' onClick={handleLogoClick}>
                <img className="rightLogo mx-2" height="30" width="30" src={logo} />
                <span className='logoFont'>Razolve</span>
            </div>

            <div className="logo-link ms-sm-5 hover_cursor" onClick={(e) => menu.current.toggle(e)}>
                <img className="rightLogo mr-2" height="30" width="30" src={profile} />
            </div>

            <button type="button" style={{ visibility: "hidden" }} className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
            </button>



            <Dialog header="Change Password" visible={changeVisible} style={{ width: "30vw" }} onHide={() => setChangeVisible(false)}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="error_msg">
                    <div className="field flex flex-column" style={{ marginTop: '20px', padding: '0.3rem 0.5rem' }}>
                        {/* <label htmlFor="department">
                            Plant
                        </label> */}
                        <Controller
                            name="name"
                            control={form.control}
                            rules={{ required: "Password is required." }}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputText id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />

                                    {fieldState.error && (
                                        <small className="p-error">{fieldState.error.message}</small>)}
                                </>
                            )}
                        />

                    </div>

                    <div className="flex justify-content-end mt-5">
                        <Button size="small" className="AU-save-btn p-button-rounded" loading={isLoading} label="Save" />
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
