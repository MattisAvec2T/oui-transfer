import React from 'react';

interface DashboardProps {
  uploadedFiles: { name: string; alias: string }[];
}

const Dashboard: React.FC<DashboardProps> = ({ uploadedFiles }) => {
  const handleDownload = async (alias: string) => {
    try {
      const response = await fetch(`http://localhost:3000/download-zip/${alias}`);
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du fichier ZIP');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      const zipFileName = getAliasWithoutExtension(alias) + '.zip';
      link.href = url;
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error);
    }
  };

  const getAliasWithoutExtension = (alias: string) => {
    const lastDotIndex = alias.lastIndexOf('.');
    return lastDotIndex !== -1 ? alias.slice(0, lastDotIndex) : alias;
  };
  

  return (
    <div>
      <h2>Tableau de Bord</h2>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            {file.name}{' '}
            <button onClick={() => handleDownload(file.alias)}>
              Télécharger en ZIP
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
