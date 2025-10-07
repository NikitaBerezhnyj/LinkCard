import { useState, useRef } from "react";
import { GoPlus } from "react-icons/go";
import { FaTrash } from "react-icons/fa6";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { uploadAvatar, uploadBackground } from "../api/uploadApi";
import "../styles/components/EditModal.css";

interface ILink {
  title: string;
  url: string;
}

interface IStyles {
  font: string;
  text: string;
  button: string;
  contentBackground: string;
  border: string;
  background: {
    type: string;
    value: {
      color: string;
      gradient: {
        start: string;
        end: string;
      };
      image: string;
    };
  };
}

interface IUserData {
  username: string;
  bio: string;
  links: ILink[];
  avatar: string;
  styles: IStyles;
}

interface EditModalProps {
  userData: IUserData;
  onClose: () => void;
  onSave: (bio: string, links: ILink[], imageUrl: string, styles: IStyles) => void;
}

function EditModal({ userData, onClose, onSave }: EditModalProps) {
  const { bio, links, avatar } = userData;
  const [editedBio, setEditedBio] = useState<string>(bio);
  const [editedLinks, setEditedLinks] = useState<ILink[]>(links);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(avatar);
  const [activeTab, setActiveTab] = useState<"content" | "styles">("content");
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const { font, text, button, contentBackground, border } = userData.styles;
  const { type, value } = userData.styles.background;
  const { color, gradient, image } = value;
  const [editedFont, setEditedFont] = useState<string>(font);
  const [editedTextColor, setEditedTextColor] = useState<string>(text);
  const [editedBorderColor, setEditedBorderColor] = useState<string>(border);
  const [editedButtonColor, setEditedButtonColor] = useState<string>(button);
  const [editedContentBackgroundColor, setEditedContentBackgroundColor] =
    useState<string>(contentBackground);
  const [editedBackgroundType, setEditedBackgroundType] = useState<string>(type);
  const [editedBackgroundColor, setEditedBackgroundColor] = useState<string>(color);
  const [editedBackgroundFile, setEditedBackgroundFile] = useState<File | null>(null);
  const [editedGradientColor1, setEditedGradientColor1] = useState<string>(gradient.start);
  const [editedGradientColor2, setEditedGradientColor2] = useState<string>(gradient.end);

  const handleLinkChange = (index: number, field: "title" | "url", value: string) => {
    const newLinks = [...editedLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setEditedLinks(newLinks);
  };

  const handleAddLink = () => {
    setEditedLinks([...editedLinks, { title: "", url: "" }]);
  };

  const handleDeleteLink = (index: number) => {
    const newLinks = editedLinks.filter((_, i) => i !== index);
    setEditedLinks(newLinks);
  };

  const moveLinkUp = (index: number) => {
    if (index === 0) return;
    const newLinks = [...editedLinks];
    [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
    setEditedLinks(newLinks);
  };

  const moveLinkDown = (index: number) => {
    if (index === editedLinks.length - 1) return;
    const newLinks = [...editedLinks];
    [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    setEditedLinks(newLinks);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleBackgroundImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditedBackgroundFile(file);
    }
  };

  const handleSave = async () => {
    // Стандартні дані
    let uploadedImageUrl = userData.avatar;
    if (imageFile) {
      const response = await uploadAvatar(imageFile);
      uploadedImageUrl = response.filePath;
    }
    let uploadedBackgroundUrl = image;
    if (editedBackgroundFile) {
      const response = await uploadBackground(editedBackgroundFile);
      uploadedBackgroundUrl = response.filePath;
    }
    const editedStyles = {
      font: editedFont,
      text: editedTextColor,
      button: editedButtonColor,
      contentBackground: editedContentBackgroundColor,
      border: editedBorderColor,
      background: {
        type: editedBackgroundType,
        value: {
          color: editedBackgroundColor,
          gradient: {
            start: editedGradientColor1,
            end: editedGradientColor2
          },
          image: uploadedBackgroundUrl
        }
      }
    };
    onSave(editedBio, editedLinks, uploadedImageUrl ?? imageUrl, editedStyles);
    onClose();
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content">
        <h2>Edit LinkCard</h2>
        <div className="edit-modal-tabs">
          <button
            className={`edit-modal-tab ${activeTab === "content" ? "active" : ""}`}
            onClick={() => setActiveTab("content")}
          >
            Content
          </button>
          <button
            className={`edit-modal-tab ${activeTab === "styles" ? "active" : ""}`}
            onClick={() => setActiveTab("styles")}
          >
            Styles
          </button>
        </div>

        {activeTab === "content" && (
          <>
            <div className="edit-modal-header">
              <label>
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  className="edit-modal-file-input"
                  onChange={handleImageChange}
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Uploaded Preview"
                    className="edit-modal-image"
                    onClick={() => imageInputRef.current?.click()}
                  />
                )}
              </label>

              <div className="edit-modal-bio-input">
                <p>
                  <b>Name:</b> {userData.username}
                </p>
                <label>
                  <b>Bio:</b>
                  <textarea
                    className="edit-modal-textarea"
                    placeholder="Write some text about you"
                    value={editedBio}
                    onChange={e => setEditedBio(e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="edit-modal-link-header">
              <h3>Links</h3>
              <button className="edit-modal-link-header-button" onClick={handleAddLink}>
                Add Link <GoPlus />
              </button>
            </div>
            {editedLinks.map((link, index) => (
              <div key={index} className="link-edit-item">
                <input
                  type="text"
                  placeholder="Link title"
                  value={link.title}
                  onChange={e => handleLinkChange(index, "title", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Link URL"
                  value={link.url}
                  onChange={e => handleLinkChange(index, "url", e.target.value)}
                />
                <button
                  onClick={() => moveLinkUp(index)}
                  className="edit-modal-button edit-modal-move-button"
                >
                  <FaArrowUp />
                </button>
                <button
                  onClick={() => moveLinkDown(index)}
                  className="edit-modal-button edit-modal-move-button"
                >
                  <FaArrowDown />
                </button>
                <button
                  className="edit-modal-button edit-modal-delete-button"
                  onClick={() => handleDeleteLink(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === "styles" && (
          <>
            <div className="edit-modal-style-section">
              <label>
                <b>Font:</b>
                <select
                  className="edit-modal-select"
                  value={editedFont}
                  onChange={e => setEditedFont(e.target.value)}
                >
                  <option value="Roboto">Roboto</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="PT Sans">PT Sans</option>
                  <option value="Lobster">Lobster</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Fira Sans">Fira Sans</option>
                  <option value="Cormorant">Cormorant</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="Nunito">Nunito</option>
                  <option value="Exo 2">Exo 2</option>
                  <option value="Noto Sans">Noto Sans</option>
                </select>
              </label>
            </div>

            <div className="edit-modal-style-section">
              <label>
                <b>Text Color:</b>
                <input
                  type="color"
                  value={editedTextColor}
                  onChange={e => setEditedTextColor(e.target.value)}
                />
              </label>
              <label>
                <b>Button Color:</b>
                <input
                  type="color"
                  value={editedButtonColor}
                  onChange={e => setEditedButtonColor(e.target.value)}
                />
              </label>
              <label>
                <b>Content Background Color:</b>
                <input
                  type="color"
                  value={editedContentBackgroundColor}
                  onChange={e => setEditedContentBackgroundColor(e.target.value)}
                />
              </label>
              <label>
                <b>Border Color:</b>
                <input
                  type="color"
                  value={editedBorderColor}
                  onChange={e => setEditedBorderColor(e.target.value)}
                />
              </label>
            </div>

            <div className="edit-modal-style-section">
              <b>Background Type:</b>
              <div>
                <label>
                  <input
                    type="radio"
                    name="backgroundType"
                    value="color"
                    checked={editedBackgroundType === "color"}
                    onChange={() => setEditedBackgroundType("color")}
                  />
                  Color
                </label>
                <label>
                  <input
                    type="radio"
                    name="backgroundType"
                    value="gradient"
                    checked={editedBackgroundType === "gradient"}
                    onChange={() => setEditedBackgroundType("gradient")}
                  />
                  Gradient
                </label>
                <label>
                  <input
                    type="radio"
                    name="backgroundType"
                    value="image"
                    checked={editedBackgroundType === "image"}
                    onChange={() => setEditedBackgroundType("image")}
                  />
                  Image
                </label>
              </div>

              {editedBackgroundType === "color" && (
                <label>
                  <b>Background Color:</b>
                  <input
                    type="color"
                    value={editedBackgroundColor}
                    onChange={e => setEditedBackgroundColor(e.target.value)}
                  />
                </label>
              )}

              {editedBackgroundType === "gradient" && (
                <label>
                  <b>Gradient Colors:</b>
                  <label>
                    From:
                    <input
                      type="color"
                      value={editedGradientColor1}
                      onChange={e => setEditedGradientColor1(e.target.value)}
                    />
                  </label>
                  <label>
                    To:
                    <input
                      type="color"
                      value={editedGradientColor2}
                      onChange={e => setEditedGradientColor2(e.target.value)}
                    />
                  </label>
                </label>
              )}

              {editedBackgroundType === "image" && (
                <label>
                  <b>Background Image:</b>
                  <input type="file" accept="image/*" onChange={handleBackgroundImageChange} />
                </label>
              )}
            </div>
          </>
        )}

        <div className="edit-modal-actions">
          <button className="edit-modal-cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="edit-modal-save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
