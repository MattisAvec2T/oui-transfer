import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  TrashIcon,
  Tooltip,
  Position,
  IconButton,
  EditIcon,
  Button,
  Checkbox,
  Card,
  toaster,
  TextInput,
} from "evergreen-ui";

interface DashboardProps {
  onDelete: (file_path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onDelete }) => {
  const MAX_QUOTA_MB = 2048;
  const [uploadedFiles, setUploadedFiles] = useState<
    {
      file_name: string;
      file_path: string;
      file_size: number;
      isEditing: boolean;
      baseName: string;
      extension: string;
    }[]
  >([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/uploaded-files", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des fichiers téléchargés"
          );
        }

        const files = await response.json();
        setUploadedFiles(
          files.data.map((file) => {
            const lastDotIndex = file.file_name.lastIndexOf(".");
            return {
              ...file,
              isEditing: false,
              baseName:
                lastDotIndex === -1
                  ? file.file_name
                  : file.file_name.slice(0, lastDotIndex),
              extension:
                lastDotIndex === -1 ? "" : file.file_name.slice(lastDotIndex),
            };
          })
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des fichiers:", error);
      }
    };
    fetchUploadedFiles();
  }, []);

  const quotaRemaining = useMemo(() => {
    const usedSpace = uploadedFiles.reduce(
      (total, file) => total + file.file_size / (1024 * 1024),
      0
    );
    return MAX_QUOTA_MB - usedSpace;
  }, [uploadedFiles]);

  const handleDelete = async (file_path: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/delete/${file_path}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du fichier");
      }

      setUploadedFiles((prevFiles) =>
        prevFiles.filter((file) => file.file_path !== file_path)
      );
      onDelete(file_path);
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier:", error);
    }
  };

  const handleFileSelect = (file_path: string) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(file_path)
        ? prevSelected.filter((path) => path !== file_path)
        : [...prevSelected, file_path]
    );
  };

  const handleGenerateLink = async () => {
    try {
      const response = await fetch("http://localhost:3000/generate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          files: selectedFiles.map((file_path) => ({ filePath: file_path })),
        }),
      });

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la génération du lien de téléchargement"
        );
      }

      const result = await response.json();
      setGeneratedLink(`http://localhost:3000/download/${result.data}`);

      setSelectedFiles([]);
    } catch (error) {
      console.error(
        "Erreur lors de la génération du lien de téléchargement:",
        error
      );
    }
  };

  const handleFileNameEditToggle = (file_path: string) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.file_path === file_path
          ? { ...file, isEditing: !file.isEditing }
          : file
      )
    );
  };

  const handleFileNameChange = (file_path: string, newBaseName: string) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.file_path === file_path ? { ...file, baseName: newBaseName } : file
      )
    );
  };

  const handleFileNameSave = async (file_path: string) => {
    const fileToUpdate = uploadedFiles.find(
      (file) => file.file_path === file_path
    );
    if (fileToUpdate) {
      try {
        const response = await fetch(`http://localhost:3000/update`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            fileName: fileToUpdate.baseName + fileToUpdate.extension,
            filePath: file_path,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour du nom du fichier");
        }

        setUploadedFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.file_path === file_path ? { ...file, isEditing: false } : file
          )
        );
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du nom du fichier:",
          error
        );
      }
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toaster.success("Lien copié dans le presse-papiers !");
    }
  };

  return (
    <div>
      <h2>Tableau de Bord</h2>
      <p>Quota restant : {quotaRemaining.toFixed(2)} Mo</p>
      <Table>
        <Table.Head>
          <Table.TextCell flexBasis={50} flexShrink={0} flexGrow={1}>
            Sélection
          </Table.TextCell>
          <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>
            Nom du Fichier
          </Table.TextCell>
          <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>
            Taille du Fichier (Mo)
          </Table.TextCell>
          <Table.TextCell flexBasis={300} flexShrink={0} flexGrow={1}>
            Actions
          </Table.TextCell>
        </Table.Head>
        <Table.Body>
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((file, index) => (
              <Table.Row key={index}>
                <Table.TextCell flexBasis={50} flexShrink={0} flexGrow={1}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Checkbox
                      label=""
                      checked={selectedFiles.includes(file.file_path)}
                      onChange={() => handleFileSelect(file.file_path)}
                    />
                  </div>
                </Table.TextCell>

                <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>
                  {file.isEditing ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TextInput
                        value={file.baseName}
                        onChange={(e) =>
                          handleFileNameChange(file.file_path, e.target.value)
                        }
                        style={{ marginRight: "8px", flexGrow: 1 }}
                      />
                      <span>{file.extension}</span>
                      <Button
                        onClick={() => handleFileNameSave(file.file_path)}
                        marginLeft={8}
                      >
                        Sauvegarder
                      </Button>
                    </div>
                  ) : (
                    `${file.baseName}${file.extension}`
                  )}
                </Table.TextCell>
                <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={1}>
                  {(file.file_size / (1024 * 1024)).toFixed(2)} Mo
                </Table.TextCell>
                <Table.TextCell flexBasis={300} flexShrink={0} flexGrow={1}>
                  <Tooltip
                    content={file.isEditing ? "Annuler" : "Modifier"}
                    position={Position.TOP}
                  >
                    <IconButton
                      icon={file.isEditing ? TrashIcon : EditIcon}
                      onClick={() => handleFileNameEditToggle(file.file_path)}
                      marginRight={15}
                    />
                  </Tooltip>

                  <Tooltip content="Supprimer" position={Position.TOP}>
                    <IconButton
                      icon={TrashIcon}
                      intent="danger"
                      onClick={() => handleDelete(file.file_path)}
                      marginRight={15}
                    />
                  </Tooltip>
                </Table.TextCell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.TextCell colSpan={4} style={{ textAlign: "center" }}>
                Aucune données
              </Table.TextCell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        {uploadedFiles.length > 0 && selectedFiles.length > 0 && (
          <Button onClick={handleGenerateLink} appearance="primary">
            Générer le Lien de Téléchargement
          </Button>
        )}
        {generatedLink && (
          <Card
            display="flex"
            alignItems="center"
            padding={16}
            background="tint2"
            border
            marginY={16}
          >
            <TextInput
              value={generatedLink}
              readOnly
              flex="1"
              marginRight={8}
            />
            <Button onClick={handleCopyLink} appearance="primary">
              Copier le lien
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
