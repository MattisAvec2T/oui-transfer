import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import './App.css';

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; alias: string }[]>([]);

  const handleFileUpload = (file: File, alias: string) => {
    setUploadedFiles((prevFiles) => [...prevFiles, { name: file.name, alias }]);
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
      </Routes>
    </div>
  );
};

export default App;