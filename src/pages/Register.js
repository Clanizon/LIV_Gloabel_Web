import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { hooks } from "prismjs/components/prism-core";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const Register = () => {
    const [checked1, setChecked1] = useState();
    let history = useHistory();
    const goto = (to)=>{
        history.replace(to);
    }
    return (
        <div className="center">
            <div className="surface-card p-4 shadow-2 border-round w-full">
                <div className="text-center mb-5">
                    <img src="/images/logo-dark.svg" alt="hyper" height={50} className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                    <span className="text-600 font-medium line-height-3">Already have an account?</span>
                    <a onClick={()=> goto("/login")} className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">login</a>
                </div>

                <div>
                    <label htmlFor="email" className="block text-900 font-medium mb-2">
                        Email
                    </label>
                    <InputText id="email" type="text" placeholder="Email address" className="w-full mb-3" />

                    <label htmlFor="password" className="block text-900 font-medium mb-2">
                        Password
                    </label>
                    <InputText type="password" placeholder="Password" className="w-full mb-3" />

                    <div className="flex align-items-center justify-content-between mb-6">
                        <div className="flex align-items-center">
                            <Checkbox id="rememberme" className="mr-2" checked={checked1} onChange={(e) => setChecked1(e.checked)} />
                            <label htmlFor="rememberme">Remember me</label>
                        </div>
                        <a  href onClick={()=> goto("/forgot-passeword")} className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
                    </div>

                    <Button onClick={()=> goto("/")} label="Sign In" icon="pi pi-user" className="w-full" />
                </div>
            </div>
        </div>
    );
};

export default Register;
