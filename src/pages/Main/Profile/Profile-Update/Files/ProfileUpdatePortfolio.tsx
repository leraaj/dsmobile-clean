import { IonGrid, IonRow, IonCol, IonButton, IonIcon } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import IonicLayout from "../../../../../components/Layouts/IonicLayout";
import { useAuthContext } from "../../../../../helpers/context/AuthContext";
import {
  addSharp,
  arrowUndoSharp,
  pencilSharp,
  returnDownBack,
  trashSharp,
} from "ionicons/icons";
import { useUploadPortfolio } from "../../../../../hooks/profile/useUploadPortfolio";
import { useDeletePortfolio } from "../../../../../hooks/profile/useDeletePortfolio";

const ProfileUpdatePortfolio: React.FC = () => {
  const { user } = useAuthContext();
  const { uploadPortfolio, isLoading } = useUploadPortfolio();
  const { deletePortfolio, isLoading: isDeleting } = useDeletePortfolio();
  // EDIT CONTROLS
  const [selectedEditFiles, setSelectedFiles] = useState<{ id: string }[]>([]);
  const [showEditControls, setShowEditControls] = useState(false);
  const [selectEditAll, setSelectEditAll] = useState(false);

  const handleEditFileSelect = (file: { id: string }) => {
    setSelectedFiles((prev) => {
      const isSelected = prev.some((f) => f.id === file.id);
      return isSelected
        ? prev.filter((f) => f.id !== file.id) // remove if already selected
        : [...prev, file]; // add if not selected
    });
  };

  const isEditFileSelected = (id: string) =>
    selectedEditFiles.some((f) => f.id === id);

  // Reset selections when edit controls toggled
  useEffect(() => {
    if (!showEditControls) {
      setSelectedFiles([]);
      setSelectEditAll(false);
    }
  }, [showEditControls]);

  useEffect(() => {
    if (!selectEditAll) {
      setSelectedFiles([]);
    } else {
      const allFiles =
        user?.portfolio
          ?.filter((p) => !!p?.id)
          .map((p) => ({ id: p.id as string })) || [];
      setSelectedFiles(allFiles);
    }
  }, [selectEditAll]);

  // ADD CONTROLS
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAddControls, setShowAddControls] = useState(false);
  const [selectedAddAll, setSelectedAddAll] = useState(false);

  // Changed type to File[] for real files
  const [selectedAddFiles, setSelectedAddFiles] = useState<File[]>([]);

  const isAddFileSelected = (file: File) => selectedAddFiles.includes(file);

  // Remove file by index
  const handleRemoveAddFile = (index: number) => {
    setSelectedAddFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle file input change (multiple files)
  const handleAddFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Convert FileList to array and append
    setSelectedAddFiles((prev) => [...prev, ...Array.from(files)]);
  };

  useEffect(() => {
    if (!showAddControls) {
      setSelectedAddFiles([]);
      setSelectedAddAll(false);
    }
  }, [showAddControls]);

  return (
    <IonicLayout
      hasPadding
      paddingBlock="1rem"
      paddingInline="1.3rem"
      {...(!(showEditControls || showAddControls) && {
        backUrl: "/tabs/profile",
      })}
      color="dark"
      title={
        showEditControls
          ? `Delete files`
          : showAddControls
          ? `Add files`
          : `Update Portfolio`
      }
      toolbarEnd={
        <>
          {!showAddControls && (
            <IonButton onClick={() => setShowEditControls(!showEditControls)}>
              <IonIcon
                slot="icon-only"
                icon={
                  showEditControls ? returnDownBack : pencilSharp
                }></IonIcon>
            </IonButton>
          )}
          {!showEditControls && (
            <IonButton onClick={() => setShowAddControls(!showAddControls)}>
              <IonIcon
                slot="icon-only"
                icon={showAddControls ? returnDownBack : addSharp}></IonIcon>
            </IonButton>
          )}
        </>
      }>
      <IonGrid>
        <IonRow>
          {showEditControls && (
            <IonCol size="12">
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}>
                {selectedEditFiles?.length > 0 && (
                  <IonButton
                    color="danger"
                    onClick={() =>
                      deletePortfolio(selectedEditFiles.map((file) => file.id))
                    }
                    disabled={selectedEditFiles.length === 0 || isDeleting}>
                    {isDeleting
                      ? "Deleting..."
                      : `Delete (${selectedEditFiles.length}) file${
                          selectedEditFiles.length > 1 ? "s" : ""
                        }`}
                  </IonButton>
                )}
                {showEditControls && (
                  <IonButton
                    color={"light"}
                    slot="fixed"
                    fill={selectEditAll ? "outline" : "solid"}
                    onClick={() => setSelectEditAll(!selectEditAll)}>
                    {selectEditAll ? "un-select" : "select all"}
                  </IonButton>
                )}
              </div>
            </IonCol>
          )}

          {showAddControls && (
            <IonCol size="12">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}>
                <>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={handleAddFiles}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />

                  <IonButton onClick={() => fileInputRef.current?.click()}>
                    choose Files
                  </IonButton>

                  <IonButton
                    onClick={() => uploadPortfolio(selectedAddFiles)}
                    disabled={selectedAddFiles.length === 0 || isLoading}
                    color="success">
                    {isLoading
                      ? "Uploading..."
                      : `Upload (${selectedAddFiles.length})`}
                  </IonButton>
                </>
              </div>
            </IonCol>
          )}

          {!showAddControls &&
            user?.portfolio?.map((p, index) => {
              return (
                <IonCol
                  key={index}
                  size={"12"}
                  size-xs={"12"}
                  size-sm={"4"}
                  size-md={"3"}
                  size-lg={"3"}
                  style={{ "--border-radius": "1rem", height: "100%" }}>
                  <iframe
                    title="Uploaded Resume"
                    src={`https://drive.google.com/file/d/${p?.id}/preview`}
                    allow="autoplay"
                    style={{
                      height: "100%",
                      width: "100%",
                      padding: "0rem",
                      border: isEditFileSelected(p?.id as any)
                        ? "1px red inset"
                        : "none",
                      borderRadius: "1rem",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "end" }}>
                    {showEditControls && (
                      <IonButton
                        shape="round"
                        color={
                          isEditFileSelected(p?.id as any) ? "medium" : "danger"
                        }
                        onClick={() => handleEditFileSelect(p as any)}>
                        <IonIcon
                          slot="icon-only"
                          icon={
                            isEditFileSelected(p?.id as any)
                              ? arrowUndoSharp
                              : trashSharp
                          }></IonIcon>
                      </IonButton>
                    )}
                  </div>
                </IonCol>
              );
            })}

          {selectedAddFiles?.map((file, index) => {
            const objectUrl = URL.createObjectURL(file);
            return (
              <IonCol
                key={index}
                size={"12"}
                size-xs={"12"}
                size-sm={"4"}
                size-md={"3"}
                size-lg={"3"}
                style={{ "--border-radius": "1rem", height: "100%" }}>
                {/* Show image preview for images, fallback icon or message for others */}
                {file.type.startsWith("image/") ? (
                  <img
                    src={objectUrl}
                    style={{
                      height: "300px",
                      width: "100%",
                      padding: "0rem",
                      border: isAddFileSelected(file)
                        ? "1px white dashed "
                        : "none",
                      borderRadius: "1rem",
                      objectFit: "contain",
                    }}
                    alt={file.name}
                  />
                ) : (
                  <div
                    style={{
                      height: "300px",
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "1rem",
                      backgroundColor: "#333",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <p>{file.name}</p>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <IonButton
                    color="danger"
                    shape="round"
                    onClick={() => handleRemoveAddFile(index)}>
                    <IonIcon slot="icon-only" icon={trashSharp} />
                  </IonButton>
                </div>
              </IonCol>
            );
          })}
        </IonRow>
      </IonGrid>
    </IonicLayout>
  );
};

export default ProfileUpdatePortfolio;
