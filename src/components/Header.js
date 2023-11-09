import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/amphenol-logo.png';
import profile from '../images/profile.png';
import { Menu } from 'primereact/menu';
import { useStoreActions } from 'easy-peasy';

function Header() {
    const menu = useRef(null);
    const navigate = useNavigate();
    // const setIsAuthenticated = useStoreActions((actions) => actions.tabModel.setIsAuthenticated);

    let items = [


        {
            label: "Logout",
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                navigate("/")
                // setIsAuthenticated(false)
            },
        },
    ];

    const goto = () => {
        navigate("/add-user")
    }

    return (
        <div className="db-topbar">
            <Menu model={items} popup ref={menu} />
            <img src={logo} onClick={() => navigate("/dashboard")} className="db-topbar-logo" alt='logo' />

            <div className='flex align-items-center'>
                <h4 onClick={goto} className='pr-5'>Add User</h4>
                <div className="ms-sm-5 hover_cursor" onClick={(e) => menu.current.toggle(e)}>
                    <img className="rightLogo mr-2" height="40" width="40" src={profile} />
                </div>
            </div>
        </div>
    );
}

export default Header;