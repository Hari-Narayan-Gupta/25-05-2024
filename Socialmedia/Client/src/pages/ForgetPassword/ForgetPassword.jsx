import React, { useState } from 'react';
import '../Auth/Auth.css';
import { forgetPassword } from '../../api/AuthRequest';
import { Link } from "react-router-dom";


export default function ForgetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            if (newPassword === confirmPassword) {
                const response = await forgetPassword({ newPassword: newPassword });
                setIsSent(true);
                setNewPassword('');
                setConfirmPassword('');
                console.log("response: ", response);
            }
        } catch (error) {
            console.log("Error: ", error);
        }

    };

    return (
        <div className="Auth">
            {/* Form for resetting password */}
            <div className="a-right">
                <form className="infoForm authForm">
                    <h3>Forget Password?</h3>
                    <div>
                        <input
                            required
                            type="password"
                            placeholder="New Password"
                            className="infoInput"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            required
                            type="password"
                            placeholder="Confirm Password"
                            className="infoInput"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="submit">
                        <button
                            className="button infoButton"
                            onClick={handleResetPassword}
                        >
                            Reset
                        </button>
                        <Link to="../home" style={{fontSize: '13px'}}>
                            back to login
                        </Link>
                    </div>
                    {isSent && (
                        <p className="changePassword-msg">
                            Your password has been changed successfully...
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
