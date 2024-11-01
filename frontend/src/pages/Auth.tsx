import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

interface AuthProps {
    onLogin: (name: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const toggleComponent = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div>
            {isLogin ? (
                <Login onSwitch={toggleComponent} onLogin={onLogin} />
            ) : (
                <Register onSwitch={toggleComponent} />
            )}
        </div>
    );
};

export default Auth;
