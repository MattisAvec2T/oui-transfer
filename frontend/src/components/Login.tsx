import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    onSwitch: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitch }) => {
    const [mail, setMail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mail, password })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                navigate('/dashboard');
            } else {
                alert("Error");
            }
        })
        .catch(err => console.log(err));
        
    };

    return (
        <div>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="mail"><strong>Adresse email</strong></label>
                    <input
                        type="email"
                        name="mail"
                        placeholder="Entrer votre email"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)} 
                    />
                </div>
                <div>
                    <label htmlFor="password"><strong>Mot de passe</strong></label>
                    <input
                        type="password"
                        name="password"
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit">Se connecter</button>
            </form>

            <button onClick={onSwitch}>S'inscrire</button>
        </div>
    );
};

export default Login;
