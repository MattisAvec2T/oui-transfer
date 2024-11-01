import React, { useState } from 'react';
import { Card, Button, TextInputField, Pane, toaster } from 'evergreen-ui';

interface RegisterProps {
    onSwitch: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitch }) => {
    const [username, setUsername] = useState<string>('');
    const [mail, setMail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
    
        if (!emailPattern.test(mail)) {
            toaster.danger("Veuillez entrer une adresse email valide.");
            return;
        }
    
        if (password !== confirmPassword) {
            toaster.danger("Les mots de passe ne correspondent pas.");
            return;
        }
    
        fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, mail, password })
        })
        .then(response => {
            if (!response.ok) {
                console.log(response.status)
                if (response.status === 409) {
                    toaster.danger("Cette adresse email est déjà utilisée. Veuillez en choisir une autre.");
                }
                return response.json().then(data => {
                    toaster.danger("Erreur lors de l'inscription : " + data.message);
                });
            }
            return response.json();
        })
        .then(data => {
            if(data.success) {
                toaster.success("Inscription réussie !");
                onSwitch();
            }
        })
        .catch(() => {
            toaster.danger("Erreur lors de la connexion au serveur.");
        });
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
