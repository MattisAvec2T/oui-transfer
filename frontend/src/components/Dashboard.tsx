import React from 'react';
import { Button, DownloadIcon, Table } from 'evergreen-ui';

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
      <Table>
        <Table.Head>
          <Table.TextCell flexBasis={560} flexShrink={0} flexGrow={0}>
            Nom du Fichier
          </Table.TextCell>
          <Table.TextCell>Actions</Table.TextCell>
        </Table.Head>
        <Table.Body>
          {uploadedFiles.map((file, index) => (
            <Table.Row key={index}>
              <Table.TextCell flexBasis={560} flexShrink={0} flexGrow={0}>
                {file.name}
              </Table.TextCell>
              <Table.TextCell>
              <Button marginY={8} iconBefore={DownloadIcon} onClick={() => handleDownload(file.alias)}>
              Télécharger en ZIP
        </Button>
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Dashboard;
