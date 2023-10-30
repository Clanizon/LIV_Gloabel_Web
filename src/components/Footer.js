
import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="footer-content ">
                <p>© 2023 Razolve. All rights reserved.</p>
                <div className="policy-links">
                    <a href="https://policies.razolve.com/privacy-policy.html" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                    </a>
                    <a href="https://policies.razolve.com/disclaimer-policy.html" target="_blank" rel="noopener noreferrer">
                        Disclaimer Policy
                    </a>
                    <a href="https://policies.razolve.com/terms-conditions.html" target="_blank" rel="noopener noreferrer">
                        Terms & Conditions
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;