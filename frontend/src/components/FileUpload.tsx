import React, { useState } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onFileUpload: (file: File, alias: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier à uploader.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload du fichier');
      }

      const data = await response.json();
      onFileUpload(file, data.alias);
      alert('Fichier uploadé avec succès');
    } catch (error) {
      setError('Erreur lors de l\'upload du fichier : ' + error);
    }
  };

  return (
    <div className="upload-container">
      <h2>Uploader un fichier</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Uploader</button>
      {error && <p>{error}</p>}
      {file && <p>Fichier sélectionné : {file.name}</p>}
    </div>
  );
};

export default FileUpload;
