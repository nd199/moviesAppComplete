import React, {useState, useEffect} from 'react';
import {useLocation} from "react-router-dom";
import EmailReg from '../Components/EmailReg';

const EmailVerification = () => {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    const handleEmailUpdate = (email) => {
        setEmail(email);
    };

    const handleEmailVerified = (verified) => {
        setIsVerified(verified);
    };

    return (
        <div>
            <h2>Email Verification</h2>
            <form>
                <EmailReg onEmailUpdate={handleEmailUpdate} onEmailVerified={handleEmailVerified}/>
                {isVerified && (
                    <div>
                        <p>Email has been verified!</p>
                        <p>Selected Plan: {selectedPlan?.name}</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default EmailVerification;
