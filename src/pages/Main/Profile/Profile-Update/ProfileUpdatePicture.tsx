import { IonAvatar, IonButton, IonCol, IonRow } from "@ionic/react";
import React, { useState, useCallback } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import IonicLayout from "../../../../components/Layouts/IonicLayout";
import { useAuthContext } from "../../../../helpers/context/AuthContext";
import LoadingSpinner from "../../../Other/LoadingSpinner";
import axios from "axios";
import { useHistory } from "react-router";
import Cropper from "react-easy-crop";
import { useToast } from "../../../../helpers/context/ToastContext";

const ProfileUpdatePicture: React.FC = () => {
  const { showToast } = useToast();
  const history = useHistory();
  const { user, initialize } = useAuthContext();
  const UPDATE_PROFILE_URL =
    import.meta.env.VITE_APP_API_URL + `upload-profile`;
  const PROFILE_ID = user?.profile?.id;
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState<string>();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedPhoto, setCroppedPhoto] = useState<string>();
  const showCropper = !!selectedPhoto && !croppedPhoto;
  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );
  const getCroppedImg = (
    imageSrc: string,
    cropAreaPixels: any
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = "anonymous";
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = cropAreaPixels.width;
        canvas.height = cropAreaPixels.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not get canvas context");
          return;
        }

        ctx.drawImage(
          image,
          cropAreaPixels.x,
          cropAreaPixels.y,
          cropAreaPixels.width,
          cropAreaPixels.height,
          0,
          0,
          cropAreaPixels.width,
          cropAreaPixels.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject("Canvas is empty");
            return;
          }
          const croppedImageUrl = URL.createObjectURL(blob);
          resolve(croppedImageUrl);
        }, "image/jpeg");
      };
      image.onerror = (error) => reject(error);
    });
  };
  const cropAndSave = async () => {
    if (!selectedPhoto || !croppedAreaPixels) return;

    try {
      const croppedImgUrl = await getCroppedImg(
        selectedPhoto,
        croppedAreaPixels
      );
      setCroppedPhoto(croppedImgUrl);

      // Revoke the previous photo URL after cropping if needed
      URL.revokeObjectURL(selectedPhoto);
    } catch (error) {
      console.error("Crop failed:", error);
    }
  };
  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false, // We do cropping in-app, so disable native editing
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      setSelectedPhoto(image.dataUrl);
      setCroppedPhoto(undefined);
    } catch (error) {
      console.error("Camera error:", error);
    }
  };
  const chooseFromGallery = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      setSelectedPhoto(image.dataUrl);
      setCroppedPhoto(undefined);
    } catch (error) {
      console.error("Gallery error:", error);
    }
  };
  const handleSubmitProfile = async (
    imageUrl: string,
    userId: string | undefined
  ) => {
    setIsLoading(true);
    if (!userId) {
      console.error("User ID is missing.");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch blob from cropped image URL
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("profile", blob, "profile.jpg");
      formData.append("id", userId);

      const res = await axios.post(UPDATE_PROFILE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res) return showToast(res);
      await initialize();
      history.replace("/tabs/profile");
      showToast("User update successfully");
    } catch (error) {
      alert(`Upload failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileEror, setProfileError] = useState(false);
  return (
    <IonicLayout
      hasPadding
      paddingBlock="1rem"
      paddingInline="1.3rem"
      backUrl="/tabs/profile"
      color="dark"
      title="Upload Photo">
      <div
        className="profile-container ion-justify-content-center ion-padding"
        style={{ height: 320, width: "100%" }}>
        <IonAvatar
          style={{
            height: "300px",
            width: "300px",
            "--border-radius": "1rem",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#222",
          }}>
          {/* Show cropper if user selected photo but hasn't cropped yet */}
          {showCropper ? (
            <Cropper
              image={selectedPhoto!}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{ containerStyle: { borderRadius: "1rem" } }}
            />
          ) : croppedPhoto ? (
            <img
              src={croppedPhoto}
              alt="Cropped"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "1rem",
              }}
            />
          ) : PROFILE_ID && profileLoaded ? (
            <img
              src={`https://drive.google.com/thumbnail?id=${PROFILE_ID}&sz=w500`}
              onLoad={() => setProfileLoaded(true)}
              onError={() => setProfileError(true)}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "1rem",
              }}
            />
          ) : PROFILE_ID && !profileLoaded ? (
            <iframe
              title="Uploaded Resume"
              src={`https://drive.google.com/file/d/${PROFILE_ID}/preview`}
              width="300px"
              height="300px"
              allow="autoplay"
              style={{
                objectFit: "cover",
                borderRadius: "1rem",
                padding: "0rem",
                border: "none",
              }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}>
              <LoadingSpinner color="light" />
            </div>
          )}
        </IonAvatar>
      </div>

      {/* Show crop and cancel buttons only when cropper is active */}
      {showCropper && (
        <div className="ion-padding-top ">
          <IonButton
            expand="block"
            color={"my-secondary"}
            onClick={cropAndSave}>
            Crop & Save
          </IonButton>
          <IonButton
            expand="block"
            color="light"
            fill="outline"
            onClick={() => {
              setSelectedPhoto(undefined);
              setCroppedPhoto(undefined);
            }}>
            Cancel
          </IonButton>
        </div>
      )}

      {!showCropper && (
        <div className="ion-padding-top ">
          <IonButton color={"my-secondary"} expand="block" onClick={takePhoto}>
            Use camera
          </IonButton>
          <IonButton
            color={"my-secondary"}
            expand="block"
            onClick={chooseFromGallery}>
            Choose from gallery
          </IonButton>
          {!showCropper && croppedPhoto && (
            <div className="ion-padding-top">
              <IonButton
                color={"light"}
                fill="outline"
                expand="block"
                onClick={() => handleSubmitProfile(croppedPhoto, user?._id)}>
                {isLoading ? <LoadingSpinner /> : "Save changes"}
              </IonButton>
            </div>
          )}
        </div>
      )}
    </IonicLayout>
  );
};

export default ProfileUpdatePicture;
