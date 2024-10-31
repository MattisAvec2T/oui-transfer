import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { TabNavigation, Tab } from 'evergreen-ui';
import './App.css';
import Auth from './pages/Auth';

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; alias: string, size: number }[]>([]);
  
  const handleFileUpload = (file: File, alias: string) => {
    setUploadedFiles((prevFiles) => [...prevFiles, { name: file.name, alias, size: file.size }]);
  };

  const handleDeleteFile = (alias: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.alias !== alias));
  };

  const tabs = [
    { title: 'Uploader un Fichier', path: '/' },
    { title: 'Tableau de Bord', path: '/dashboard' },
  ];

  return (
    <div>
      <h1>Oui-Transfer</h1>
      <TabNavigation>
        {tabs.map((tab) => (
          <Tab
            key={tab.title}
            is={Link}
            to={tab.path}
            >
            {tab.title}
          </Tab>
        ))}
      </TabNavigation>
      <Routes>
        <Route path="/" element={<FileUpload onFileUpload={handleFileUpload} />} />
        <Route path="/dashboard" element={<Dashboard uploadedFiles={uploadedFiles} onDelete={handleDeleteFile} />} />
        <Route path="/authentification" element={<Auth />} />
      </Routes>
    </div>
  );
};

export default App;
