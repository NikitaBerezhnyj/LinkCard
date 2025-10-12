"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  FiTrash2,
  FiUser,
  FiLink,
  FiAlertTriangle,
  FiUpload,
  FiKey,
  FiLogOut,
  FiImage,
  FiInfo
} from "react-icons/fi";
import { IoMdDocument } from "react-icons/io";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import type { AxiosError } from "axios";

import styles from "@/styles/pages/Edit.module.scss";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import ConfirmModal from "@/components/modals/ConfirmModal";

import { IUser } from "@/types/IUser";
import * as templates from "@/constants/templates";
import * as fonts from "@/constants/fonts";
import { formatUnitValue, parseUnitValue } from "@/utils/styleFormatter";
import { validateEmail, validateUsername, validateLink } from "@/utils/validations";
import { userService } from "@/services/UserService";
import { authService } from "@/services/AuthService";
import { uploadService } from "@/services/UploadService";
import { useUserStore } from "@/store/userStore";
import { useAuth } from "@/hooks/useAuth";

type TabType = "profile" | "styles";
type ConfirmAction =
  | { type: "deleteLink"; payload: number }
  | { type: "cancelChanges" }
  | { type: "logout" }
  | { type: "deleteAccount" };

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams();
  const usernameParam = params?.username as string;
  const { logout, setUser } = useUserStore();

  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [originalUserData, setOriginalUserData] = useState<IUser | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [linkErrors, setLinkErrors] = useState<(string | null)[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [openSection, setOpenSection] = useState<string>("Colors");
  const [userStyles, setUserStyles] = useState<IUser["styles"]>(templates.darkTheme);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);

  const { username: currentUsername } = useAuth({ forceCheck: true });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action?: ConfirmAction;
  }>({ isOpen: false });

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
      title: "Видалити акаунт назавжди?",
      message: "Ваш акаунт і всі дані будуть безповоротно видалені. Цю дію не можна скасувати!",
      confirmText: "Так, видалити назавжди",
      cancelText: "Скасувати"
    }
  } as const;

  useEffect(() => {
    const checkUserAccess = () => {
      if (!currentUsername) {
        router.push("/login");
        return;
      }

      if (currentUsername !== usernameParam) {
        router.replace(`/user/${usernameParam}`);
      }
    };

    checkUserAccess();
  }, [usernameParam, currentUsername, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!usernameParam) return;

        const response = await userService.getUser(usernameParam);
        const userData = response?.data?.data as IUser | undefined;

        if (!userData) return;

        setOriginalUserData(userData);

        setUsername(userData.username);
        setEmail(userData.email);
        setBio(userData.bio || "");
        setLinks(userData.links || []);
        setUserStyles(userData.styles || templates.darkTheme);
        setAvatarUrl(userData.avatar || null);
        setBackgroundUrl(userData.styles.background.value.image || null);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [usernameParam]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Файл занадто великий. Максимум 5MB");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const response = await uploadService.uploadAvatar(file);
      const newUrl = response.data?.filePath;

      if (newUrl) {
        setAvatarUrl(newUrl);
        toast.success("Аватарку оновлено!");
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error("Не вдалося завантажити аватарку.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Файл занадто великий. Максимум 10MB");
      return;
    }

    try {
      setIsUploadingBackground(true);
      const response = await uploadService.uploadBackground(file);
      const newUrl = response.data?.filePath;

      if (newUrl) {
        setBackgroundUrl(newUrl);
        handleStyleChange("background.value.image", newUrl);
        toast.success("Фон оновлено!");
      }
    } catch (error) {
      console.error("Background upload failed:", error);
      toast.error("Не вдалося завантажити фон.");
    } finally {
      setIsUploadingBackground(false);
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

  const handleLogoutClick = () => {
    openConfirmModal({ type: "logout" });
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
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
      logout();
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
      const keys = path.split(".");
      const newStyles = { ...prev };
      let current: Record<string, unknown> = newStyles as unknown as Record<string, unknown>;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) };
        current = current[keys[i]] as Record<string, unknown>;
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
      toast.success(`Шаблон "${templateName}" застосовано`);
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

    const isUsernameChanged = username !== originalUserData.username;

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
      toast.error("Будь ласка, виправте помилки у формі");
      return;
    }

    setError(null);

    const formattedBackground = { ...userStyles.background.value };
    if (backgroundUrl !== userStyles.background.value.image) {
      formattedBackground.image = backgroundUrl ?? undefined;
    }

    const formattedStyles = {
      ...userStyles,
      fontSize: formatUnitValue(userStyles.fontSize, "px"),
      borderRadius: formatUnitValue(userStyles.borderRadius, "px"),
      contentPadding: formatUnitValue(userStyles.contentPadding, "px"),
      contentGap: formatUnitValue(userStyles.contentGap, "px"),
      background: {
        ...userStyles.background,
        value: {
          ...formattedBackground,
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
      toast.success("Немає змін для збереження");
      return;
    }

    try {
      await userService.updateUser(usernameParam, changes);
      toast.success("Профіль успішно оновлено!");
      setOriginalUserData({ ...originalUserData, ...currentData });

      if (isUsernameChanged) {
        setUser(username);
      }

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

  if (!originalUserData) {
    return <div>Завантаження...</div>;
  }

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.formContainer}>
        <h1>Редагування профілю</h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Профіль
          </button>
          <button
            className={`${styles.tab} ${activeTab === "styles" ? styles.active : ""}`}
            onClick={() => setActiveTab("styles")}
          >
            Стилі
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === "profile" ? (
            <div className={styles.section}>
              <div className={`${styles.profileCard}`}>
                <div className={styles.cardHeader}>
                  <h2>
                    <FiUser />
                    Аватар
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.avatarSection}>
                    <div className={styles.avatarContainer}>
                      <label htmlFor="avatarInput" className={styles.avatarLabel}>
                        {isUploadingAvatar ? (
                          <div className={styles.avatarLoading}>
                            <FiUpload />
                            Завантаження...
                          </div>
                        ) : avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={username || "User avatar"}
                            width={140}
                            height={140}
                            unoptimized={true}
                            className={styles.avatarImage}
                          />
                        ) : (
                          <FaUserCircle className={styles.avatarPlaceholder} />
                        )}
                        <div className={styles.avatarOverlay}>
                          <FiUpload />
                        </div>
                      </label>
                      <input
                        id="avatarInput"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.avif,.tiff,.gif"
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <p className={styles.avatarHint}>JPG, PNG або GIF. Максимум 5MB</p>
                  </div>
                </div>
              </div>

              <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                  <h2>
                    <IoMdDocument /> Основна інформація
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.basicInfoGrid}>
                    <Input
                      type="text"
                      label="Ім'я користувача"
                      value={username}
                      onChange={e => {
                        setUsername(e.target.value);
                        if (usernameError) setUsernameError(null);
                      }}
                      placeholder="your_username"
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
                  </div>
                </div>
              </div>

              <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                  <h2>
                    <FiKey />
                    Безпека
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.passwordSection}>
                    <p className={styles.hint}>Натисніть, щоб отримати лист для зміни пароля</p>
                    <span className={styles.passwordLabel}>Пароль</span>
                    <button
                      className={styles.changePasswordBtn}
                      onClick={handlePasswordResetRequest}
                    >
                      Змінити пароль
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                  <h2>
                    <FiInfo /> Про себе
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.bioSection}>
                    <Textarea
                      label="Біографія"
                      placeholder="Розкажіть про себе..."
                      value={bio ?? ""}
                      onChange={e => setBio(e.target.value)}
                      maxCharacters={200}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                  <h2>
                    <FiLink />
                    Посилання
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.linksSection}>
                    <div className={styles.linksHeader}>
                      <h3>Соціальні мережі та сайти</h3>
                      <button className={styles.addBtn} onClick={handleAddLink}>
                        <FaPlus />
                      </button>
                    </div>
                    {links.length > 0 ? (
                      <div className={styles.linksList}>
                        {links.map((link, index) => (
                          <div key={index} className={styles.linkItem}>
                            <Input
                              type="text"
                              placeholder="Назва (напр. GitHub)"
                              value={link.title}
                              onChange={e => handleLinkChange(index, "title", e.target.value)}
                            />
                            <Input
                              type="text"
                              placeholder="https://example.com"
                              value={link.url}
                              onChange={e => handleLinkChange(index, "url", e.target.value)}
                              error={linkErrors[index] || undefined}
                            />
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleRemoveLink(index)}
                              title="Видалити посилання"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyLinks}>Ви ще не додали жодного посилання</div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`${styles.profileCard} ${styles.dangerZone}`}>
                <div className={styles.cardHeader}>
                  <h2>
                    <FiAlertTriangle />
                    Небезпечна зона
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.dangerActions}>
                    <button className={styles.dangerBtn} onClick={handleLogoutClick}>
                      <FiLogOut />
                      Вийти з акаунту
                    </button>
                    <button
                      className={`${styles.dangerBtn} ${styles.deleteAccount}`}
                      onClick={handleDeleteAccountClick}
                    >
                      <FiTrash2 />
                      Видалити акаунт назавжди
                    </button>
                  </div>
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
                            Вибір шаблону замінить усі поточні стилі на стилі обраного шаблону
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
                              label="Тип"
                              value={userStyles.background.type}
                              onChange={e => handleStyleChange("background.type", e.target.value)}
                              options={[
                                { value: "color", label: "Колір" },
                                { value: "gradient", label: "Градієнт" },
                                { value: "image", label: "Зображення" }
                              ]}
                            />
                          </div>

                          {userStyles.background.type === "color" && (
                            <div className={styles.formRow}>
                              <div className={styles.formGroup}>
                                <label>Колір фону</label>
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
                                  <label>Початковий колір</label>
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
                                  <label>Кінцевий колір</label>
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
                                  label="Кут (градуси)"
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
                            <div className={styles.backgroundSection}>
                              <label htmlFor="backgroundInput" className={styles.backgroundLabel}>
                                {isUploadingBackground ? (
                                  <div className={styles.backgroundLoading}>
                                    <FiUpload />
                                    Завантаження...
                                  </div>
                                ) : backgroundUrl ? (
                                  <Image
                                    src={backgroundUrl}
                                    alt="Background"
                                    width={600}
                                    height={200}
                                    className={styles.backgroundImage}
                                    unoptimized={true}
                                  />
                                ) : (
                                  <div className={styles.backgroundPlaceholder}>
                                    <FiImage />
                                    <span>Натисніть, щоб завантажити фон</span>
                                  </div>
                                )}
                                <div className={styles.backgroundOverlay}>
                                  <FiUpload />
                                </div>
                              </label>
                              <input
                                id="backgroundInput"
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp,.avif,.tiff,.gif"
                                style={{ display: "none" }}
                                onChange={handleBackgroundUpload}
                              />
                              <div className={styles.formRow}>
                                <Select
                                  label="Позиція"
                                  value={userStyles.background.value.position}
                                  onChange={e =>
                                    handleStyleChange("background.value.position", e.target.value)
                                  }
                                  options={[
                                    { value: "center", label: "Центр" },
                                    { value: "top", label: "Зверху" },
                                    { value: "bottom", label: "Знизу" },
                                    { value: "left", label: "Ліворуч" },
                                    { value: "right", label: "Праворуч" }
                                  ]}
                                />
                                <Select
                                  label="Розмір"
                                  value={userStyles.background.value.size}
                                  onChange={e =>
                                    handleStyleChange("background.value.size", e.target.value)
                                  }
                                  options={[
                                    { value: "cover", label: "Покрити" },
                                    { value: "contain", label: "Вмістити" },
                                    { value: "auto", label: "Авто" }
                                  ]}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {section === "Typography" && (
                        <>
                          <div className={styles.formRow}>
                            <Select
                              label="Шрифт"
                              value={userStyles.font}
                              onChange={e => handleStyleChange("font", e.target.value)}
                              options={fontOptions}
                            />
                            <Input
                              type="number"
                              min={8}
                              max={72}
                              step={1}
                              label="Розмір (px)"
                              value={parseUnitValue(userStyles.fontSize)}
                              onChange={e => handleStyleChange("fontSize", e.target.value)}
                              placeholder="16"
                            />
                          </div>
                          <div className={styles.formRow}>
                            <Select
                              label="Вага"
                              value={userStyles.fontWeight}
                              onChange={e => handleStyleChange("fontWeight", e.target.value)}
                              options={[
                                { value: "300", label: "Легкий" },
                                { value: "400", label: "Звичайний" },
                                { value: "500", label: "Середній" },
                                { value: "600", label: "Напівжирний" },
                                { value: "700", label: "Жирний" }
                              ]}
                            />
                            <Select
                              label="Вирівнювання"
                              value={userStyles.textAlign}
                              onChange={e => handleStyleChange("textAlign", e.target.value)}
                              options={[
                                { value: "left", label: "Ліворуч" },
                                { value: "center", label: "По центру" },
                                { value: "right", label: "Праворуч" }
                              ]}
                            />
                          </div>
                        </>
                      )}

                      {section === "Colors" && (
                        <div className={styles.colorGrid}>
                          {[
                            ["Текст", "text"],
                            ["Посилання", "linkText"],
                            ["Текст кнопки", "buttonText"],
                            ["Фон кнопки", "buttonBackground"],
                            ["Текст при наведенні", "buttonHoverText"],
                            ["Фон при наведенні", "buttonHoverBackground"],
                            ["Рамка", "border"],
                            ["Фон контенту", "contentBackground"]
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
                            label="Радіус рамки (px)"
                            value={parseUnitValue(userStyles.borderRadius)}
                            onChange={e => handleStyleChange("borderRadius", e.target.value)}
                            placeholder="8"
                          />
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            label="Відступ (px)"
                            value={parseUnitValue(userStyles.contentPadding)}
                            onChange={e => handleStyleChange("contentPadding", e.target.value)}
                            placeholder="20"
                          />
                          <Input
                            type="number"
                            min={0}
                            max={60}
                            step={1}
                            label="Проміжок (px)"
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

        {error && (
          <div className={styles.errorMessage}>
            <FiAlertTriangle />
            {error}
          </div>
        )}

        <div className={styles.actionButtons}>
          <Button type="button" variant="secondary" onClick={handleCancelChangesClick}>
            Скасувати
          </Button>
          <Button type="button" variant="primary" onClick={handleAccept}>
            Зберегти зміни
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
