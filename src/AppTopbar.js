import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import logo from './images/amphe.png';
import profile from './images/profile-pic.png';
import { Menu } from 'primereact/menu';
import { useStoreActions } from 'easy-peasy';

export const AppTopbar = (props) => {
    const menu = useRef(null);
    let history = useHistory();
    const setUser = useStoreActions((action) => action.loginModel.setUser);

    let items = [
        {
            label: "Logout",
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                setUser('');
                history.replace("/");
                localStorage.removeItem("e-portal-access-token")
            },
        },
    ];
    const handleLogoClick = () => {
        history.push("/app/defaultnav");
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

        </div>
    );
}
