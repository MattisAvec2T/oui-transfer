import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { TabNavigation, Tab } from 'evergreen-ui';
import './App.css';

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; alias: string }[]>([]);
  const location = useLocation();

  const handleFileUpload = (file: File, alias: string) => {
    setUploadedFiles((prevFiles) => [...prevFiles, { name: file.name, alias }]);
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
            isSelected={location.pathname === tab.path}
          >
            {tab.title}
          </Tab>
        ))}
      </TabNavigation>
      <Routes>
        <Route path="/" element={<FileUpload onFileUpload={handleFileUpload} />} />
        <Route path="/dashboard" element={<Dashboard uploadedFiles={uploadedFiles} />} />
      </Routes>
    </div>
  );
};

export default App;
