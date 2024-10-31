import React, { useState, useCallback } from 'react';
import { Pane, FileUploader, FileCard, Button, UploadIcon, Card } from 'evergreen-ui';

interface FileUploadProps {
  onFileUpload: (file: File, alias: string, size: number) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileRejections, setFileRejections] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((acceptedFiles) => {
    setFiles([acceptedFiles[0]]);
    setError(null);
  }, []);

  const handleRejected = useCallback((rejections) => {
    setFileRejections([rejections[0]]);
    setError('Fichier rejeté : ' + rejections[0]?.message);
  }, []);

  const handleRemove = useCallback(() => {
    setFiles([]);
    setFileRejections([]);
    setError(null);
  }, []);

  const handleUpload = async () => {
    const file = files[0];
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
        throw new Error("Erreur lors de l'upload du fichier");
      }

      const data = await response.json();
      onFileUpload(file, data.alias, file.size);
      alert('Fichier uploadé avec succès');
      handleRemove();
    } catch (error) {
      setError("Erreur lors de l'upload du fichier : " + error);
    }
  };

  return (
    <div className="upload-container">
      <h2>Uploader un fichier</h2>
      <Pane display="flex" alignItems="center" justifyContent="center" >
      <Card elevation={1} padding={24} width={400} background="tint2" display="flex" flexDirection="column" alignItems="center">
        <Pane maxWidth={654}>
          <FileUploader
            label="Upload File"
            maxFiles={1}
            onChange={handleChange}
            onRejected={handleRejected}
            renderFile={(file) => {
              const fileRejection = fileRejections.find((rej) => rej.file === file);
              const { name, size, type } = file;
              return (
                <FileCard
                  key={name}
                  isInvalid={!!fileRejection}
                  name={name}
                  onRemove={handleRemove}
                  sizeInBytes={size}
                  type={type}
                  validationMessage={fileRejection?.message || undefined}
                />
              );
            }}
            values={files}
          />
        </Pane>
        <Button marginY={8} iconBefore={UploadIcon} onClick={handleUpload}>
          Uploader
        </Button>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </Card>
    </Pane>
    </div>
  );
};

export default FileUpload;
