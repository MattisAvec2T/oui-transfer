import React, { useMemo, useState, useEffect } from 'react';
import { DownloadIcon, Table, TrashIcon, LinkIcon, Tooltip, Position, IconButton } from 'evergreen-ui';

interface DashboardProps {
  onDelete: (file_path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onDelete }) => {
  const MAX_QUOTA_MB = 2048;
  const [uploadedFiles, setUploadedFiles] = useState<{ file_name: string; file_path: string; file_size: number }[]>([]);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/uploaded-files", {
          credentials: "include"
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des fichiers téléchargés');
        }

        const files = await response.json();
        setUploadedFiles(files.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des fichiers:', error);
      }
    };
    fetchUploadedFiles();
  }, []);

  const quotaRemaining = useMemo(() => {
    const usedSpace = uploadedFiles.reduce((total, file) => total + file.file_size / (1024 * 1024), 0);
    return MAX_QUOTA_MB - usedSpace;
  }, [uploadedFiles]);

  const handleDownload = async (file_path: string) => {
    try {
      const response = await fetch(`http://localhost:3000/download-zip/${file_path}`);
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du fichier ZIP');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${getAliasWithoutExtension(file_path)}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error);
    }
  };

  const handleDelete = async (file_path: string) => {
    try {
      const response = await fetch(`http://localhost:3000/delete/${file_path}`, {
        method: 'DELETE',
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du fichier');
      }

      setUploadedFiles(prevFiles => prevFiles.filter(file => file.file_path !== file_path));
      onDelete(file_path);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
    }
  };

  const getAliasWithoutExtension = (file_path: string) => {
    const lastDotIndex = file_path.lastIndexOf('.');
    return lastDotIndex !== -1 ? file_path.slice(0, lastDotIndex) : file_path;
  };

  return (
    <div>
      <h2>Tableau de Bord</h2>
      <p>Quota restant : {quotaRemaining.toFixed(2)} Mo</p>
      <Table>
        <Table.Head>
          <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>Nom du Fichier</Table.TextCell>
          <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>Taille du Fichier (Mo)</Table.TextCell>
          <Table.TextCell flexBasis={300} flexShrink={0} flexGrow={1}>Actions</Table.TextCell>
        </Table.Head>
        <Table.Body>
          {uploadedFiles.map((file, index) => (
            <Table.Row key={index}>
              <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>{file.file_name}</Table.TextCell>
              <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>{(file.file_size / (1024 * 1024)).toFixed(2)} Mo</Table.TextCell>
              <Table.TextCell flexBasis={300} flexShrink={0} flexGrow={1}>
                <Tooltip content="Télécharger en ZIP" position={Position.TOP}>
                  <IconButton icon={DownloadIcon} onClick={() => handleDownload(file.file_path)} marginRight={15} />
                </Tooltip>

                <Tooltip content="Supprimer" position={Position.TOP}>
                  <IconButton
                    icon={TrashIcon}
                    intent="danger"
                    onClick={() => handleDelete(file.file_path)}
                    marginRight={15}
                  />
                </Tooltip>

                <Tooltip content="Générer lien de partage" position={Position.TOP}>
                  <IconButton icon={LinkIcon} />
                </Tooltip>
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Dashboard;
