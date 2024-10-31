import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import './App.css';
import Auth from './pages/Auth';

const App: React.FC = () => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const handleFileUpload = (file: File) => {
        setUploadedFiles((prevFiles) => [...prevFiles, file]);
    };

    return (
        <div>
            <h1>Oui-Transfer</h1>
            <nav>
                <Link to="/">Uploader un Fichier</Link> | <Link to="/dashboard">Tableau de Bord</Link>
            </nav>
            <Routes>
                <Route path="/" element={<FileUpload onFileUpload={handleFileUpload} />} />
                <Route path="/dashboard" element={<Dashboard uploadedFiles={uploadedFiles} />} />
                <Route path="/authentification" element={<Auth />} />
            </Routes>
        </div>
    );
};

export default App;
