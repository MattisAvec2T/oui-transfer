import React, { useState } from 'react';

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
        <div>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username"><strong>Nom d'utilisateur</strong></label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Entrer votre nom"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="mail"><strong>Adresse email</strong></label>
                    <input
                        type="mail"
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
                <div>
                    <label htmlFor="confirm_password"><strong>Confirmer votre mot de passe</strong></label>
                    <input
                        type="password"
                        name="confirm_password"
                        placeholder="******"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit">S'inscrire</button>
            </form>

            <button onClick={onSwitch}>Se connecter</button>
        </div>
    );
};

export default Register;
