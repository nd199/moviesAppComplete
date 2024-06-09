import React, {useState} from 'react';
import './Register.css';
import {useDispatch} from 'react-redux';
import {register} from '../redux/ApiCalls';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const registerHandler = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (password === confirmPassword) {
                await register(dispatch, {name, email, password, phoneNumber});
            }
        } catch (error) {
            console.error(
                "Register error: ",
                err.response?.data?.error || "An unexpected error occurred"
            );
            setError(err.response?.data?.error || "An unexpected error occurred");
        }
    };

    return (
        <div className="register_Admin">
            <div className="regisCard">
                <h1>Register</h1>
                <div className="inputs">
                    <label>Name:</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="inputs">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="inputs">
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="inputs">
                    <label>Confirm Password:</label>
                    <input
                        type="confirm-Password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="inputs">
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <button className="btn" onClick={registerHandler}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default Register;
