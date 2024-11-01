import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { TabNavigation, Tab, Button } from 'evergreen-ui';
import './App.css';
import Auth from './pages/Auth';

const App: React.FC = () => {
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string; alias: string; size: number }[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const handleFileUpload = (file: File, alias: string) => {
        setUploadedFiles((prevFiles) => [...prevFiles, { name: file.name, alias, size: file.size }]);
    };

    const handleDeleteFile = (alias: string) => {
        setUploadedFiles(uploadedFiles.filter((file) => file.alias !== alias));
    };

    const handleLogin = (name: string) => {
        setUserName(name);
        setIsAuthenticated(true);
        navigate('/dashboard')
    };

    const handleLogout = () => {
        setUserName('');
        setIsAuthenticated(false);
        navigate('/')
    };

    const tabs = [
        { title: 'Uploader un Fichier', path: '/file-upload' },
        { title: 'Tableau de Bord', path: '/dashboard' },
    ];

    return (
        <div>
            <header className="app-header">
                <h1>Oui-Transfer</h1>
                {isAuthenticated ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent:'right' }}>
                        <span style={{ marginRight: '10px' }}>{userName}</span>
                        <Button onClick={handleLogout} appearance="primary">Se Déconnecter</Button>
                    </div>
                ) : null}
            </header>

            {isAuthenticated && (
                <TabNavigation>
                    {tabs.map((tab) => (
                        <Tab key={tab.title} is={Link} to={tab.path}>
                            {tab.title}
                        </Tab>
                    ))}
                </TabNavigation>
            )}
            
            <Routes>
                <Route path="/file-upload" element={isAuthenticated ? <FileUpload onFileUpload={handleFileUpload} /> : <Navigate to="/" replace />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard onDelete={handleDeleteFile} /> : <Navigate to="/" replace />} />
                <Route path="/" element={<Auth onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
};

export default App;
