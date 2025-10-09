"use client";

// TODO:
// 1. Покращити дизайн загалом, щоб більше відповідав дизайну інших сторінок;
// 2. Додати кнопку для видалення акаунту;
// 3. Додати можливість зміни паролю (через окрему сторінку, куди веде кнопка);
// 4. Додати збереження змін на сервері (додати запит через сервіс);

import { useState } from "react";
import styles from "@/styles/pages/Edit.module.scss";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { IUser } from "@/types/IUser";
import { FiTrash2, FiPlus } from "react-icons/fi";
import * as templates from "@/constants/templates";
import { formatUnitValue, parseUnitValue } from "@/utils/styleFormatter";

type TabType = "profile" | "styles";

export default function UserEditPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Profile data
  const [username, setUsername] = useState("john_doe");
  const [email, setEmail] = useState("john@example.com");
  const [links, setLinks] = useState<{ title: string; url: string }[]>([
    { title: "GitHub", url: "https://github.com/johndoe" },
    { title: "Twitter", url: "https://twitter.com/johndoe" }
  ]);

  // Styles data
  const [userStyles, setUserStyles] = useState<IUser["styles"]>(templates.dracula);

  const handleAddLink = () => {
    setLinks([...links, { title: "", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: "title" | "url", value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleStyleChange = (path: string, value: any) => {
    setUserStyles(prev => {
      const newStyles = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current = newStyles;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newStyles;
    });
  };

  const handleTemplateSelect = (templateName: string) => {
    const templateMap: Record<string, IUser["styles"]> = {
      lightTheme: templates.lightTheme,
      darkTheme: templates.darkTheme,
      blueSky: templates.blueSky,
      pinkMarshmallow: templates.pinkMarshmallow,
      warmGradient: templates.warmGradient,
      mintFresh: templates.mintFresh,
      dracula: templates.dracula,
      solarizedLight: templates.solarizedLight,
      sunsetGlow: templates.sunsetGlow,
      oceanBreeze: templates.oceanBreeze
    };

    if (templateMap[templateName]) {
      setUserStyles(templateMap[templateName]);
    }
  };

  const handleAccept = () => {
    if (activeTab === "profile") {
      console.log("Profile Data:", { username, email, links });
    } else {
      const formattedStyles = {
        ...userStyles,
        fontSize: formatUnitValue(userStyles.fontSize, "px"),
        borderRadius: formatUnitValue(userStyles.borderRadius, "px"),
        contentPadding: formatUnitValue(userStyles.contentPadding, "px"),
        contentGap: formatUnitValue(userStyles.contentGap, "px"),
        background: {
          ...userStyles.background,
          value: {
            ...userStyles.background.value,
            gradient: userStyles.background.value.gradient
              ? {
                  ...userStyles.background.value.gradient,
                  angle: formatUnitValue(userStyles.background.value.gradient.angle, "deg")
                }
              : undefined
          }
        }
      };

      console.log("Styles Data:", formattedStyles);
    }
  };

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.formContainer}>
        <h1>Edit Profile</h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`${styles.tab} ${activeTab === "styles" ? styles.active : ""}`}
            onClick={() => setActiveTab("styles")}
          >
            Styles
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === "profile" ? (
            <div className={styles.section}>
              <Input
                type="text"
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Your username"
              />

              <Input
                type="email"
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
              />

              <div className={styles.linksSection}>
                <div className={styles.sectionHeader}>
                  <h3>Links</h3>
                  <button className={styles.addBtn} onClick={handleAddLink}>
                    <FiPlus /> Add Link
                  </button>
                </div>

                {links.map((link, index) => (
                  <div key={index} className={styles.linkItem}>
                    <div className={styles.linkInputs}>
                      <Input
                        type="text"
                        placeholder="Title"
                        value={link.title}
                        onChange={e => handleLinkChange(index, "title", e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="URL"
                        value={link.url}
                        onChange={e => handleLinkChange(index, "url", e.target.value)}
                      />
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleRemoveLink(index)}
                      title="Delete link"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.section}>
              <div className={styles.templatesSection}>
                <h3>Templates</h3>
                <div className={styles.templateGrid}>
                  {Object.keys(templates).map(key => (
                    <button
                      key={key}
                      className={styles.templateBtn}
                      onClick={() => handleTemplateSelect(key)}
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </button>
                  ))}
                </div>
              </div>

              <h3>Background</h3>

              <div className={styles.formGroup}>
                <label>Type</label>
                <select
                  value={userStyles.background.type}
                  onChange={e => handleStyleChange("background.type", e.target.value)}
                  className={styles.select}
                >
                  <option value="color">Color</option>
                  <option value="gradient">Gradient</option>
                  <option value="image">Image</option>
                </select>
              </div>

              {userStyles.background.type === "color" && (
                <div className={styles.formGroup}>
                  <label>Background Color</label>
                  <input
                    type="color"
                    value={userStyles.background.value.color}
                    onChange={e => handleStyleChange("background.value.color", e.target.value)}
                    className={styles.colorInput}
                  />
                  <span className={styles.colorValue}>{userStyles.background.value.color}</span>
                </div>
              )}

              {userStyles.background.type === "gradient" && (
                <>
                  <div className={styles.formGroup}>
                    <label>Start Color</label>
                    <input
                      type="color"
                      value={userStyles.background.value.gradient?.start}
                      onChange={e =>
                        handleStyleChange("background.value.gradient.start", e.target.value)
                      }
                      className={styles.colorInput}
                    />
                    <span className={styles.colorValue}>
                      {userStyles.background.value.gradient?.start}
                    </span>
                  </div>
                  <div className={styles.formGroup}>
                    <label>End Color</label>
                    <input
                      type="color"
                      value={userStyles.background.value.gradient?.end}
                      onChange={e =>
                        handleStyleChange("background.value.gradient.end", e.target.value)
                      }
                      className={styles.colorInput}
                    />
                    <span className={styles.colorValue}>
                      {userStyles.background.value.gradient?.end}
                    </span>
                  </div>
                  <Input
                    type="number"
                    label="Angle (deg)"
                    value={parseUnitValue(userStyles.background.value.gradient?.angle || 0)}
                    onChange={e =>
                      handleStyleChange("background.value.gradient.angle", e.target.value)
                    }
                    placeholder="135"
                  />
                </>
              )}

              {userStyles.background.type === "image" && (
                <>
                  <Input
                    type="text"
                    label="Image URL"
                    value={userStyles.background.value.image}
                    onChange={e => handleStyleChange("background.value.image", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className={styles.formGroup}>
                    <label>Position</label>
                    <select
                      value={userStyles.background.value.position}
                      onChange={e => handleStyleChange("background.value.position", e.target.value)}
                      className={styles.select}
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Size</label>
                    <select
                      value={userStyles.background.value.size}
                      onChange={e => handleStyleChange("background.value.size", e.target.value)}
                      className={styles.select}
                    >
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </>
              )}

              <h3>Typography</h3>

              <div className={styles.formGroup}>
                <label>Font</label>
                <select
                  value={userStyles.font}
                  onChange={e => handleStyleChange("font", e.target.value)}
                  className={styles.select}
                >
                  <option value="Roboto">Roboto</option>
                  <option value="Fira Code">Fira Code</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </div>

              <Input
                type="number"
                label="Font Size (px)"
                value={parseUnitValue(userStyles.fontSize)}
                onChange={e => handleStyleChange("fontSize", e.target.value)}
                placeholder="16"
              />

              <div className={styles.formGroup}>
                <label>Font Weight</label>
                <select
                  value={userStyles.fontWeight}
                  onChange={e => handleStyleChange("fontWeight", e.target.value)}
                  className={styles.select}
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Text Align</label>
                <select
                  value={userStyles.textAlign}
                  onChange={e => handleStyleChange("textAlign", e.target.value)}
                  className={styles.select}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <h3>Colors</h3>

              <div className={styles.formGroup}>
                <label>Text</label>
                <input
                  type="color"
                  value={userStyles.text}
                  onChange={e => handleStyleChange("text", e.target.value)}
                  className={styles.colorInput}
                />
                <span className={styles.colorValue}>{userStyles.text}</span>
              </div>

              <div className={styles.formGroup}>
                <label>Link Text</label>
                <input
                  type="color"
                  value={userStyles.linkText}
                  onChange={e => handleStyleChange("linkText", e.target.value)}
                  className={styles.colorInput}
                />
                <span className={styles.colorValue}>{userStyles.linkText}</span>
              </div>

              <div className={styles.formGroup}>
                <label>Button Text</label>
                <input
                  type="color"
                  value={userStyles.buttonText}
                  onChange={e => handleStyleChange("buttonText", e.target.value)}
                  className={styles.colorInput}
                />
                <span className={styles.colorValue}>{userStyles.buttonText}</span>
              </div>

              <div className={styles.formGroup}>
                <label>Button Background</label>
                <input
                  type="color"
                  value={userStyles.buttonBackground}
                  onChange={e => handleStyleChange("buttonBackground", e.target.value)}
                  className={styles.colorInput}
                />
                <span className={styles.colorValue}>{userStyles.buttonBackground}</span>
              </div>

              <div className={styles.formGroup}>
                <label>Button Hover Text</label>
                <input
                  type="color"
                  value={userStyles.buttonHoverText}
                  onChange={e => handleStyleChange("buttonHoverText", e.target.value)}
                  className={styles.colorInput}
                />
                <span className={styles.colorValue}>{userStyles.buttonHoverText}</span>
              </div>

              <div className={styles.formGroup}>
                <label>Button Hover Background</label>
                <input
                  type="color"
                  value={userStyles.buttonHoverBackground}
                  onChange={e => handleStyleChange("buttonHoverBackground", e.target.value)}
                  className={styles.colorInput}
                />
                <span className={styles.colorValue}>{userStyles.buttonHoverBackground}</span>
              </div>

              <div className={styles.formGroup}>
                <label>Border</label>
                <input
                  type="color"
                  value={userStyles.border}
                  onChange={e => handleStyleChange("border", e.target.value)}
                  className={styles.colorInput}
                />
                <span className={styles.colorValue}>{userStyles.border}</span>
              </div>

              <div className={styles.formGroup}>
                <label>Content Background</label>
                <input
                  type="color"
                  value={userStyles.contentBackground}
                  onChange={e => handleStyleChange("contentBackground", e.target.value)}
                  className={styles.colorInput}
                />
                <span className={styles.colorValue}>{userStyles.contentBackground}</span>
              </div>

              <h3>Layout</h3>

              <Input
                type="number"
                label="Border Radius (px)"
                value={parseUnitValue(userStyles.borderRadius)}
                onChange={e => handleStyleChange("borderRadius", e.target.value)}
                placeholder="8"
              />

              <Input
                type="number"
                label="Content Padding (px)"
                value={parseUnitValue(userStyles.contentPadding)}
                onChange={e => handleStyleChange("contentPadding", e.target.value)}
                placeholder="20"
              />

              <Input
                type="number"
                label="Content Gap (px)"
                value={parseUnitValue(userStyles.contentGap)}
                onChange={e => handleStyleChange("contentGap", e.target.value)}
                placeholder="12"
              />
            </div>
          )}
        </div>

        <Button type="button" variant="primary" onClick={handleAccept}>
          Accept Changes
        </Button>
      </div>
    </main>
  );
}
