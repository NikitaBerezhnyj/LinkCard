"use client";

// TODO:
// - [x] 1. Додати кнопку для видалення акаунту;
// - [x] 2. Додати можливість зміни паролю (через окрему сторінку, куди веде кнопка);
// - [x] 3. Додати збереження змін на сервері (додати запит через сервіс);
// - [x] 4. Додати валідацію полів (email, url, обов'язкові поля);
// - [x] 5. Додати завантаження початкових даних користувача з сервера;
// - [x] 6. Додати кнопку Logout;
// - [x] 7. Додати можливість зміни аватарки;
// - [ ] 8. Покращити вигляд сторінки
// - [x] 9. Після змін користувача, редірект на профіль, щоб було зрозуміло, що все пройшо нормально
// - [x] 10. Після змін користувача, редірект на новий URL (якщо змінився username)
// - [x] 11. Додати якусь обробку на сервер (можливо якщо змінюється username відправляти новий jwt токен з новим username) щоб сайт досі вважав користувача авторизованим, але зі змінений username
// - [x] 13. Додати підтримку шрифтів, які можна обрати
// - [ ] 14. Додати можливість завантажувати зображення для бекграунду, або давати на них посилання, якщо воно вже є десь в інтернеті

// UX/UI improvements:
// - [x] 1. Додати підтвердження перед видаленням посилання;
// - [x] 2. Зробити всі категорії стилів згортальними (accordion);
// - [x] 3. Min/Max значення для числових полів стилів;
// - [x] 4. Додати можливість скасування змін перед збереженням;

import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "@/styles/pages/Edit.module.scss";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { IUser } from "@/types/IUser";
import { FiTrash2, FiPlus } from "react-icons/fi";
import * as templates from "@/constants/templates";
import { formatUnitValue, parseUnitValue } from "@/utils/styleFormatter";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { IoIosArrowDown } from "react-icons/io";
import Textarea from "@/components/ui/Textarea";
import { useRouter } from "next/navigation";
import { userService } from "@/services/UserService";
import { authService } from "@/services/AuthService";
import { validateEmail, validateUsername, validateLink } from "@/utils/validations";
import type { AxiosError } from "axios";
import * as fonts from "@/constants/fonts";
import { toast } from "react-hot-toast";
import { uploadService } from "@/services/UploadService";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

type TabType = "profile" | "styles";
type ConfirmAction =
  | { type: "deleteLink"; payload: number }
  | { type: "cancelChanges" }
  | { type: "logout" }
  | { type: "deleteAccount" };
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams();
  const usernameParam = params?.username as string;
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [originalUserData, setOriginalUserData] = useState<IUser | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [linkErrors, setLinkErrors] = useState<(string | null)[]>([]);
  const [openSection, setOpenSection] = useState<string>("Colors");
  const [userStyles, setUserStyles] = useState<IUser["styles"]>(templates.darkTheme);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action?: ConfirmAction;
  }>({ isOpen: false });
  const [error, setError] = useState<string | null>(null);

  const modalConfig = {
    deleteLink: {
      title: "Видалити посилання?",
      message: "Це посилання буде видалене без можливості відновлення.",
      confirmText: "Так, видалити",
      cancelText: "Скасувати"
    },
    cancelChanges: {
      title: "Скасувати зміни?",
      message: "Усі незбережені зміни будуть втрачені.",
      confirmText: "Так, скасувати",
      cancelText: "Повернутись"
    },
    logout: {
      title: "Вийти з акаунту?",
      message: "Ви справді хочете вийти з акаунту?",
      confirmText: "Так, вийти",
      cancelText: "Скасувати"
    },
    deleteAccount: {
      title: "Видалити акаунт?",
      message: "Ваш акаунт буде безповоротно видалено. Ви впевнені?",
      confirmText: "Так, видалити",
      cancelText: "Скасувати"
    }
  } as const;

  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const profileResponse = await authService.getCurrentUser();
        const currentUsername = profileResponse?.username;

        if (!currentUsername) {
          router.push("/login");
          return;
        }

        if (currentUsername !== usernameParam) {
          router.replace(`/user/${usernameParam}`);
        }
      } catch (error) {
        console.error("Failed to check user access:", error);
        router.push("/login");
      }
    };

    checkUserAccess();
  }, [usernameParam, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!usernameParam) return;

        const response = await userService.getUser(usernameParam);
        const userData = response?.data?.data as IUser | undefined;

        if (!userData) {
          console.warn("No user data received from server");
          return;
        }

        setOriginalUserData(userData);
        setUsername(userData.username);
        setEmail(userData.email);
        setBio(userData.bio || "");
        setLinks(userData.links || []);
        setUserStyles(userData.styles || templates.dracula);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [usernameParam]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const response = await uploadService.uploadAvatar(file);
      const newUrl = response.data?.filePath; // або response.data.data.url — залежно від твоєї відповіді сервера
      if (newUrl) {
        setAvatarUrl(newUrl);
        toast.success("Аватарку оновлено!");
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error("Не вдалося завантажити аватарку.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    try {
      if (!email) {
        setEmailError("Email не може бути порожнім.");
        return;
      }

      await authService.forgotPassword({ email });
      toast.success("Інструкцію для зміни пароля надіслано на вашу пошту.");
    } catch {
      console.error("Password reset request failed");
      toast.error("Не вдалося надіслати лист. Спробуйте пізніше.");
    }
  };

  const handleAddLink = () => {
    setLinks([...links, { title: "", url: "" }]);
  };

  const handleDeleteLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
    closeConfirmModal();
  };

  const openConfirmModal = (action: ConfirmAction) => {
    setConfirmModal({ isOpen: true, action });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false });
  };

  const handleConfirm = async () => {
    const action = confirmModal.action;
    if (!action) return;

    switch (action.type) {
      case "deleteLink":
        handleDeleteLink(action.payload);
        break;
      case "cancelChanges":
        handleCancelChanges();
        break;
      case "logout":
        await handleLogout();
        break;
      case "deleteAccount":
        await handleDeleteAccount();
        break;
    }
  };

  const handleRemoveLink = (index: number) => {
    openConfirmModal({ type: "deleteLink", payload: index });
  };

  const handleLinkChange = (index: number, field: "title" | "url", value: string) => {
    setLinks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    if (field === "url") {
      setLinkErrors(prev => {
        const updated = [...prev];
        updated[index] = null;
        return updated;
      });
    }
  };

  const handleLogoutClick = () => {
    openConfirmModal({ type: "logout" });
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    closeConfirmModal();
  };

  const handleDeleteAccountClick = () => {
    openConfirmModal({ type: "deleteAccount" });
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteUser(usernameParam);
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Account deletion failed:", error);
    }
    closeConfirmModal();
  };

  const fontOptions = Object.keys(fonts).map(key => {
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
    return { value: label, label };
  });

  const handleStyleChange = (path: string, value: string | number) => {
    setUserStyles(prev => {
      const newStyles = { ...prev };
      const keys = path.split(".");
      let current: unknown = newStyles;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof current === "object" && current !== null) {
          current = (current as Record<string, unknown>)[keys[i]];
        }
      }
      if (typeof current === "object" && current !== null) {
        (current as Record<string, string | number>)[keys[keys.length - 1]] = value;
      }
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

  const getChangedFields = (
    original: Record<string, unknown> | null | undefined,
    current: Record<string, unknown>
  ): DeepPartial<typeof current> | undefined => {
    if (!original || typeof original !== "object" || Array.isArray(original)) {
      return current;
    }

    const changes: Record<string, unknown> = {};

    for (const key in current) {
      if (!Object.prototype.hasOwnProperty.call(current, key)) continue;

      const origValue = original[key];
      const currValue = current[key];

      if (Array.isArray(currValue)) {
        if (JSON.stringify(origValue) !== JSON.stringify(currValue)) {
          changes[key] = currValue;
        }
      } else if (typeof currValue === "object" && currValue !== null) {
        const nestedChanges = getChangedFields(
          origValue as Record<string, unknown>,
          currValue as Record<string, unknown>
        );
        if (nestedChanges && Object.keys(nestedChanges).length > 0) {
          changes[key] = nestedChanges;
        }
      } else {
        if (origValue !== currValue) {
          changes[key] = currValue;
        }
      }
    }

    return Object.keys(changes).length > 0 ? changes : undefined;
  };

  const handleAccept = async () => {
    if (!originalUserData) {
      console.error("Original user data is not loaded");
      return;
    }

    const usernameValidation =
      username !== originalUserData.username ? validateUsername(username) : null;
    const emailValidation = email !== originalUserData.email ? validateEmail(email) : null;
    const linksValidation =
      JSON.stringify(links) !== JSON.stringify(originalUserData.links)
        ? links.map(link => validateLink(link.url ?? ""))
        : [];

    setUsernameError(usernameValidation);
    setEmailError(emailValidation);
    setLinkErrors(linksValidation);

    const hasErrors =
      usernameValidation || emailValidation || linksValidation.some(error => error !== null);

    if (hasErrors) {
      console.warn("Validation failed");
      return;
    }

    setError(null);

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

    const currentData: Partial<IUser> = {
      username,
      email,
      bio,
      links,
      styles: formattedStyles
    };

    if (avatarUrl && avatarUrl !== originalUserData.avatar) {
      currentData.avatar = avatarUrl;
    }

    const changes = getChangedFields(
      originalUserData as unknown as Record<string, unknown>,
      currentData
    );

    if (!changes) {
      console.log("No changes to save");
      return;
    }

    console.log("Changed fields to send:", changes);

    try {
      await userService.updateUser(usernameParam, changes);
      console.log("User updated successfully");

      setOriginalUserData({ ...originalUserData, ...currentData });

      router.push(`/user/${username}`);
    } catch (err: unknown) {
      console.error("Failed to update user:", err);

      const axiosError = err as AxiosError<{ message: string }>;

      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else if (axiosError.message) {
        setError(axiosError.message);
      } else {
        setError("Не вдалося оновити дані користувача. Спробуйте пізніше.");
      }
    }
  };

  const handleCancelChangesClick = () => {
    openConfirmModal({ type: "cancelChanges" });
  };

  const handleCancelChanges = () => {
    router.push(`/user/${username}`);
    closeConfirmModal();
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
              <div className={styles.avatarContainer}>
                <label htmlFor="avatarInput" className={styles.avatarLabel}>
                  {isUploading ? (
                    <div className={styles.avatarLoading}>...</div>
                  ) : avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={username || "User avatar"}
                      width={120}
                      height={120}
                      unoptimized={true}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <FaUserCircle className={styles.avatarPlaceholder} />
                  )}
                  <div className={styles.avatarOverlay}>Змінити</div>
                </label>

                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
              </div>

              <Input
                type="text"
                label="Username"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  if (usernameError) setUsernameError(null);
                }}
                placeholder="Your username"
                error={usernameError || undefined}
              />

              <Input
                type="email"
                label="Email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                placeholder="your@email.com"
                error={emailError || undefined}
              />

              <div className={styles.passwordSection}>
                <button className={styles.changePasswordBtn} onClick={handlePasswordResetRequest}>
                  Змінити пароль
                </button>
              </div>

              <Textarea
                label="Bio"
                placeholder="Tell something about yourself..."
                value={bio}
                onChange={e => setBio(e.target.value)}
                maxCharacters={200}
              />

              <div className={styles.linksSection}>
                <div className={styles.sectionHeader}>
                  <label>Links</label>
                  <button className={styles.addBtn} onClick={handleAddLink}>
                    <FiPlus />
                  </button>
                </div>

                {links.map((link, index) => (
                  <div key={index} className={styles.linkItem}>
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
                      error={linkErrors[index] || undefined}
                    />
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleRemoveLink(index)}
                      title="Delete link"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}

                <div className={styles.actionsSection}>
                  <Button className={styles.logoutBtn} onClick={handleLogoutClick}>
                    Вийти з акаунту
                  </Button>
                  <Button className={styles.deleteAccountBtn} onClick={handleDeleteAccountClick}>
                    Видалити акаунт
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.section}>
              {["Templates", "Background", "Typography", "Colors", "Layout"].map(section => {
                const isOpen = openSection === section;

                return (
                  <div key={section} className={`${styles.accordion} ${isOpen ? styles.open : ""}`}>
                    <button
                      className={styles.accordionHeader}
                      onClick={() => setOpenSection(prev => (prev === section ? "" : section))}
                    >
                      {section}
                      <IoIosArrowDown />
                    </button>

                    <div className={styles.accordionContent}>
                      {section === "Templates" && (
                        <>
                          <p className={styles.hint}>
                            Selecting a template will replace all current styles with the styles of
                            the selected template.
                          </p>
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
                        </>
                      )}

                      {section === "Background" && (
                        <>
                          <div className={styles.formRow}>
                            <Select
                              label="Type"
                              value={userStyles.background.type}
                              onChange={e => handleStyleChange("background.type", e.target.value)}
                              options={[
                                { value: "color", label: "Color" },
                                { value: "gradient", label: "Gradient" },
                                { value: "image", label: "Image" }
                              ]}
                            />
                          </div>

                          {userStyles.background.type === "color" && (
                            <div className={styles.formRow}>
                              <div className={styles.formGroup}>
                                <label>Color</label>
                                <div className={styles.colorWrapper}>
                                  <input
                                    type="color"
                                    value={userStyles.background.value.color}
                                    onChange={e =>
                                      handleStyleChange("background.value.color", e.target.value)
                                    }
                                    className={styles.colorInput}
                                  />
                                  <span className={styles.colorValue}>
                                    {userStyles.background.value.color}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {userStyles.background.type === "gradient" && (
                            <>
                              <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                  <label>Start</label>
                                  <div className={styles.colorWrapper}>
                                    <input
                                      type="color"
                                      value={userStyles.background.value.gradient?.start}
                                      onChange={e =>
                                        handleStyleChange(
                                          "background.value.gradient.start",
                                          e.target.value
                                        )
                                      }
                                      className={styles.colorInput}
                                    />
                                    <span className={styles.colorValue}>
                                      {userStyles.background.value.gradient?.start}
                                    </span>
                                  </div>
                                </div>
                                <div className={styles.formGroup}>
                                  <label>End</label>
                                  <div className={styles.colorWrapper}>
                                    <input
                                      type="color"
                                      value={userStyles.background.value.gradient?.end}
                                      onChange={e =>
                                        handleStyleChange(
                                          "background.value.gradient.end",
                                          e.target.value
                                        )
                                      }
                                      className={styles.colorInput}
                                    />
                                    <span className={styles.colorValue}>
                                      {userStyles.background.value.gradient?.end}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.formRow}>
                                <Input
                                  type="number"
                                  min={0}
                                  max={360}
                                  step={1}
                                  label="Angle (deg)"
                                  value={parseUnitValue(
                                    userStyles.background.value.gradient?.angle || 0
                                  )}
                                  onChange={e =>
                                    handleStyleChange(
                                      "background.value.gradient.angle",
                                      e.target.value
                                    )
                                  }
                                  placeholder="135"
                                />
                              </div>
                            </>
                          )}

                          {userStyles.background.type === "image" && (
                            <>
                              <Input
                                type="text"
                                label="Image URL"
                                value={userStyles.background.value.image}
                                onChange={e =>
                                  handleStyleChange("background.value.image", e.target.value)
                                }
                                placeholder="https://example.com/image.jpg"
                              />
                              <div className={styles.formRow}>
                                <Select
                                  label="Position"
                                  value={userStyles.background.value.position}
                                  onChange={e =>
                                    handleStyleChange("background.value.position", e.target.value)
                                  }
                                  options={[
                                    { value: "center", label: "Center" },
                                    { value: "top", label: "Top" },
                                    { value: "bottom", label: "Bottom" },
                                    { value: "left", label: "Left" },
                                    { value: "right", label: "Right" }
                                  ]}
                                />
                                <Select
                                  label="Size"
                                  value={userStyles.background.value.size}
                                  onChange={e =>
                                    handleStyleChange("background.value.size", e.target.value)
                                  }
                                  options={[
                                    { value: "cover", label: "Cover" },
                                    { value: "contain", label: "Contain" },
                                    { value: "auto", label: "Auto" }
                                  ]}
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {section === "Typography" && (
                        <>
                          <div className={styles.formRow}>
                            <Select
                              label="Font"
                              value={userStyles.font}
                              onChange={e => handleStyleChange("font", e.target.value)}
                              options={fontOptions}
                            />
                            <Input
                              type="number"
                              min={8}
                              max={72}
                              step={1}
                              label="Size (px)"
                              value={parseUnitValue(userStyles.fontSize)}
                              onChange={e => handleStyleChange("fontSize", e.target.value)}
                              placeholder="16"
                            />
                          </div>
                          <div className={styles.formRow}>
                            <Select
                              label="Weight"
                              value={userStyles.fontWeight}
                              onChange={e => handleStyleChange("fontWeight", e.target.value)}
                              options={[
                                { value: "300", label: "Light" },
                                { value: "400", label: "Regular" },
                                { value: "500", label: "Medium" },
                                { value: "600", label: "Semibold" },
                                { value: "700", label: "Bold" }
                              ]}
                            />
                            <Select
                              label="Align"
                              value={userStyles.textAlign}
                              onChange={e => handleStyleChange("textAlign", e.target.value)}
                              options={[
                                { value: "left", label: "Left" },
                                { value: "center", label: "Center" },
                                { value: "right", label: "Right" }
                              ]}
                            />
                          </div>
                        </>
                      )}

                      {section === "Colors" && (
                        <div className={styles.colorGrid}>
                          {[
                            ["Text", "text"],
                            ["Link", "linkText"],
                            ["Button Text", "buttonText"],
                            ["Button BG", "buttonBackground"],
                            ["Hover Text", "buttonHoverText"],
                            ["Hover BG", "buttonHoverBackground"],
                            ["Border", "border"],
                            ["Content BG", "contentBackground"]
                          ].map(([label, key]) => (
                            <div key={key} className={styles.formGroup}>
                              <label>{label}</label>
                              <div className={styles.colorWrapper}>
                                <input
                                  type="color"
                                  value={userStyles[key as keyof typeof userStyles] as string}
                                  onChange={e => handleStyleChange(key, e.target.value)}
                                  className={styles.colorInput}
                                />
                                <span className={styles.colorValue}>
                                  {userStyles[key as keyof typeof userStyles] as string}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section === "Layout" && (
                        <div className={styles.formRow}>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            label="Border Radius (px)"
                            value={parseUnitValue(userStyles.borderRadius)}
                            onChange={e => handleStyleChange("borderRadius", e.target.value)}
                            placeholder="8"
                          />
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            label="Padding (px)"
                            value={parseUnitValue(userStyles.contentPadding)}
                            onChange={e => handleStyleChange("contentPadding", e.target.value)}
                            placeholder="20"
                          />
                          <Input
                            type="number"
                            min={0}
                            max={60}
                            step={1}
                            label="Gap (px)"
                            value={parseUnitValue(userStyles.contentGap)}
                            onChange={e => handleStyleChange("contentGap", e.target.value)}
                            placeholder="12"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div>
          <Button type="button" variant="primary" onClick={handleAccept}>
            Accept Changes
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancelChangesClick}>
            Cancel
          </Button>
        </div>
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onConfirm={handleConfirm}
        onCancel={closeConfirmModal}
        title={confirmModal.action ? modalConfig[confirmModal.action.type].title : ""}
        message={confirmModal.action ? modalConfig[confirmModal.action.type].message : ""}
        confirmText={confirmModal.action ? modalConfig[confirmModal.action.type].confirmText : "OK"}
        cancelText={
          confirmModal.action ? modalConfig[confirmModal.action.type].cancelText : "Cancel"
        }
      />
    </main>
  );
}
