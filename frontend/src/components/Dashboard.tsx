import React from 'react';

interface File {
    name: string;
}

interface DashboardProps {
    uploadedFiles: File[];
}

const Dashboard: React.FC<DashboardProps> = ({ uploadedFiles }) => {
    return (
        <div className="upload-container">
            <h2>Fichiers Uploadés</h2>
            {uploadedFiles.length === 0 ? (
                <p>Aucun fichier uploadé.</p>
            ) : (
                <ul>
                    {uploadedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;
