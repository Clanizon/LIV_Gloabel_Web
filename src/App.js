import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Route, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppMenu } from './AppMenu';

import Dashboard from './components/Dashboard';
import ChartDemo from './components/ChartDemo';

import Crud from './pages/Crud';
import EmptyPage from './pages/EmptyPage';

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/demo/flags/flags.css';
import './assets/demo/Demos.scss';
import './assets/layout/layout.scss';
import './App.scss';
import Login from './pages/Login';
import Register from './pages/Register';
import Master from './components/Master';
import Settings from './components/Settings';
import Footer from './components/Footer';
import CustomRoute from './CustomRoute';
import { useStoreState } from 'easy-peasy';
import Report from './components/Report';

const App = () => {
    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();
    const [isAuthScreen, setAuthScreen] = useState(true);
    const user = useStoreState((actions) => actions.loginModel.user);
    const userRole = useStoreState((state) => state.loginModel.userRole);
    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    useEffect(() => {
        if (["/login", "/register"].includes(location.pathname)) {
            console.log(location.pathname)
            setAuthScreen(true)
            setStaticMenuInactive(true)
        } else {
            console.log(location.pathname)
            setAuthScreen(false)
            setStaticMenuInactive(false)
        }
        // console.log(location.pathname)
    }, [location.pathname])

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menu = [
        {
            label: "",
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/app/defaultnav' },
                // { label: 'Training Status', icon: 'pi pi-fw pi-file', to: '/app/training-status' },
                // { label: 'All Members', icon: 'pi pi-fw pi-user', to: '/app/allTrainee' },
                { label: 'Settings', icon: 'pi pi-fw pi-slack', to: '/app/settings' },
                { label: 'Report', icon: 'pi pi-fw pi-book', to: '/app/report' },
            ]
        },
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            {
                isAuthScreen === false && (
                    <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode} mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />
                )
            }
            {
                isAuthScreen === false && (
                    <div className="layout-sidebar" onClick={onSidebarClick}>
                        <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
                    </div>)
            }

            <div className="layout-main-container">
                <div className="layout-main">
                    <CustomRoute path="/app/defaultnav" component={Dashboard} allowedRoles="Admin" currentToken={userRole} />
                    {/* <CustomRoute path="/app/defaultnav"  allowedRoles="Admin" currentToken={userRole}  exact render={() => <Dashboard colorMode={layoutColorMode} location={location} />} /> */}
                    <CustomRoute path="/app/ViewMember" component={Master} allowedRoles="Admin" currentToken={userRole} />
                    <CustomRoute path="/login" component={Login} allowedRoles="Admin" currentToken={userRole} />
                    {/* <CustomRoute path="/register" component={Register}  allowedRoles="Admin" currentToken={userRole}  /> */}
                    <CustomRoute path="/app/settings" component={Settings} allowedRoles="Admin" currentToken={userRole} />
                    <CustomRoute path="/chart" component={ChartDemo} allowedRoles="Admin" currentToken={userRole} />
                    <CustomRoute path="/crud" component={Crud} allowedRoles="Admin" currentToken={userRole} />
                    <CustomRoute path="/empty" componelogoint={EmptyPage} allowedRoles="Admin" currentToken={userRole} />
                    <CustomRoute path="/app/report" component={Report} allowedRoles="Admin" currentToken={userRole} />
                </div>
            </div>
            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>
            <Footer></Footer>
        </div>
    );

}

export default App;
