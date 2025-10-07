import { useState, useEffect, useRef } from "react";
import { FaTrash, FaCopy } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { QRCodeSVG } from "qrcode.react";
import { MdLogout } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { deleteUser } from "../api/userApi";
import "../styles/components/ActionModal.css";
import CopyModal from "./CopyModal";

interface ActionModalProps {
  onClose: () => void;
  isPersonalAccount: boolean;
}

function ActionModal({ onClose, isPersonalAccount }: ActionModalProps) {
  const [userName, setUserName] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [showCopyModal, setShowCopyModal] = useState(false);
  const qrRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUserName(username || "");
  }, []);

  useEffect(() => {
    const userLink = `http://localhost:5173/user/${userName}`;
    setLink(userLink);
  }, [userName]);

  const handleBackButtonClick = () => {
    onClose();
  };

  const handleLogOut = () => {
    localStorage.removeItem("jwtToken");
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      await deleteUser(userName);
      localStorage.removeItem("jwtToken");
      window.location.reload();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setShowCopyModal(true);
  };

  const handleCloseCopyModal = () => {
    setTimeout(() => {
      setShowCopyModal(false);
    }, 2000);
  };

  const handleDownloadQRCode = () => {
    const svgElement = qrRef.current?.querySelector("svg");
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8"
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = 200;
        canvas.height = 200;
        ctx?.drawImage(img, 0, 0);

        const link = document.createElement("a");
        link.download = `${userName}_QRCode.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  return (
    <div className="action-modal-overlay">
      <div className="action-modal-content">
        <button className="action-modal-back-button" onClick={handleBackButtonClick}>
          <FaArrowLeft />
        </button>
        <h2>Actions</h2>
        <div className="action-modal-qr-code" ref={qrRef}>
          <QRCodeSVG value={link} size={200} />
        </div>
        <div className="action-modal-actions">
          <button className="action-modal-button" onClick={handleDownloadQRCode}>
            Download QR Code <IoMdDownload />
          </button>
          <button className="action-modal-button" onClick={handleCopyLink}>
            Copy Profile Link <FaCopy />
          </button>
          {isPersonalAccount && (
            <>
              <button className="action-modal-button" onClick={handleLogOut}>
                Sign Out <MdLogout />
              </button>
              <button
                className="action-modal-button action-modal-delete-button"
                onClick={handleDeleteAccount}
              >
                Delete Account <FaTrash />
              </button>
            </>
          )}
        </div>
      </div>
      <CopyModal show={showCopyModal} onClose={handleCloseCopyModal} />
    </div>
  );
}

export default ActionModal;
