import React, { useState } from 'react';
import { Card, Button, TextInputField, Pane } from 'evergreen-ui';
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
            credentials: "include",
            body: JSON.stringify({ mail, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                navigate('/dashboard');
            } else {
                alert("Error");
            }
        })
        .catch(err => console.log(err));
        
    };

    return (
        <Pane display="flex" justifyContent="center" marginTop="10px">
            <Card elevation={1} padding={24} width={400} background="tint2" display="flex" flexDirection="column" alignItems="center">
            <h2>Connexion</h2>
                <form onSubmit={handleSubmit}>
                    <TextInputField
                        marginBottom="10px"
                        textAlign="left"
                        label="Adresse email"
                        placeholder="Entrer votre email"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)} 
                        type="email"
                        required
                    />
                    <TextInputField
                        marginBottom="10px"
                        textAlign="left"
                        label="Mot de passe"
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        type="password"
                        required
                    />
                    <Button type="submit" appearance="primary" marginTop={16} marginBottom={8}>
                        Se connecter
                    </Button>
                </form>
                Ou
                <Button appearance="default" onClick={onSwitch} marginTop={8}>
                    S'inscrire
                </Button>
            </Card>
        </Pane>
    );
};

export default Login;
