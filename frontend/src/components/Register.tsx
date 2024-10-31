import React, { useState } from 'react';
import { Card, Button, TextInputField, Pane } from 'evergreen-ui';

interface RegisterProps {
    onSwitch: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitch }) => {
    const [username, setUsername] = useState<string>('');
    const [mail, setMail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, mail, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                onSwitch();
            } else {
                alert("Error");
            }
        })
        .catch(err => console.log(err));
        
    };

    return (
        <Pane display="flex" justifyContent="center" marginTop="10px">
            <Card elevation={1} padding={24} width={400} background="tint2" display="flex" flexDirection="column" alignItems="center">
            <h2>Inscription</h2>
                <form onSubmit={handleSubmit}>
                    <TextInputField
                        marginBottom="10px"
                        textAlign="left"
                        label="Nom d'utilisateur"
                        placeholder="Entrer votre nom"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
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
                    <TextInputField
                        marginBottom="10px"
                        textAlign="left"
                        label="Confirmer votre mot de passe"
                        placeholder="******"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        required
                    />
                    <Button type="submit" appearance="primary" marginTop={16} marginBottom={8}>
                        S'inscrire
                    </Button>
                </form>
                Ou
                <Button appearance="default" onClick={onSwitch} marginTop={8}>
                    Se connecter
                </Button>
            </Card>
        </Pane>
    );
};

export default Register;
