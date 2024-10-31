import React, { useMemo } from 'react';
import { Button, DownloadIcon, Table, TrashIcon } from 'evergreen-ui';

interface DashboardProps {
  uploadedFiles: { name: string; alias: string; size: number }[];
  onDelete: (alias: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ uploadedFiles, onDelete }) => {
  const MAX_QUOTA_MB = 2048;

  const quotaRemaining = useMemo(() => {
    const usedSpace = uploadedFiles.reduce((total, file) => total + file.size / (1024 * 1024), 0);
    return MAX_QUOTA_MB - usedSpace;
  }, [uploadedFiles]);

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
      <p>Quota restant : {quotaRemaining.toFixed(2)} MB</p>
      <Table>
        <Table.Head>
          <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>
            Nom du Fichier
          </Table.TextCell>
          <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>
            Taille du Fichier (Mo)
          </Table.TextCell>
          <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>
            Actions
          </Table.TextCell>
        </Table.Head>
        <Table.Body>
          {uploadedFiles.map((file, index) => (
            <Table.Row key={index}>
              <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>
                {file.name}
              </Table.TextCell>
              <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </Table.TextCell>
              <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>
                <Button
                  marginY={8}
                  iconBefore={DownloadIcon}
                  onClick={() => handleDownload(file.alias)}
                >
                  Télécharger en ZIP
                </Button>
                <Button
                  marginY={8}
                  iconBefore={TrashIcon}
                  intent="danger"
                  onClick={() => onDelete(file.alias)}
                >
                  Supprimer
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
