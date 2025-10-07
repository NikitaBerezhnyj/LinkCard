import React, { useState, useEffect } from "react";
import "../styles/components/CopyModal.css";

interface CopyModalProps {
  show: boolean;
  onClose: () => void;
}

const CopyModal: React.FC<CopyModalProps> = ({ show, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldClose, setShouldClose] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setShouldClose(false);
      const timer = setTimeout(() => {
        setShouldClose(true);
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setShouldClose(false);
    }
  }, [show]);

  useEffect(() => {
    if (shouldClose) {
      const closeTimer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 250);

      return () => clearTimeout(closeTimer);
    }
  }, [shouldClose, onClose]);

  return (
    <div className={`copy-modal-container ${isVisible ? "" : "hide"}`}>
      {isVisible && (
        <>
          <p className="copy-modal-text">Text copied!</p>
          <div className="progress-bar">
            <div className={`progress ${shouldClose ? "hide" : ""}`} />
          </div>
        </>
      )}
    </div>
  );
};

export default CopyModal;
