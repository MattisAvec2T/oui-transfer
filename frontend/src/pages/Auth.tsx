import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const Connection: React.FC = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const toggleComponent = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div>
            {isLogin ? <Login onSwitch={toggleComponent} /> : <Register onSwitch={toggleComponent} />}
        </div>
    );
};

export default Connection;
