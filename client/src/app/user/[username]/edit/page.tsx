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
import { parseUnitValue } from "@/utils/styleFormatter";
import { validateEmail, validateUsername, validateLink } from "@/utils/validations";
import { userService } from "@/services/UserService";
import { authService } from "@/services/AuthService";
import { useUserStore } from "@/store/userStore";
import Loader from "@/components/modals/Loader";
import { useTranslation } from "react-i18next";
import { accessManager } from "@/managers/accessManager";
import { getChangedFields, prepareCurrentData } from "@/utils/dataUtils";
import { useImageUpload } from "@/hooks/useImageUpload";

type TabType = "profile" | "styles";
type ConfirmAction =
  | { type: "deleteLink"; payload: number }
  | { type: "cancelChanges" }
  | { type: "logout" }
  | { type: "deleteAccount" };

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams();
  const usernameParam = params?.username as string;
  const { logout, setUser } = useUserStore();

  const [isLoading, setIsLoading] = useState(true);
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

  const [openSection, setOpenSection] = useState<string>("colors");
  const [userStyles, setUserStyles] = useState<IUser["styles"]>(templates.darkTheme);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const { t } = useTranslation();

  const { handleImageUpload } = useImageUpload();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action?: ConfirmAction;
  }>({ isOpen: false });

  const modalConfig = {
    deleteLink: {
      title: t("edit.modal.deleteLink.title"),
      message: t("edit.modal.deleteLink.message"),
      confirmText: t("edit.modal.deleteLink.confirmText"),
      cancelText: t("edit.modal.deleteLink.cancelText")
    },
    cancelChanges: {
      title: t("edit.modal.cancelChanges.title"),
      message: t("edit.modal.cancelChanges.message"),
      confirmText: t("edit.modal.cancelChanges.confirmText"),
      cancelText: t("edit.modal.cancelChanges.cancelText")
    },
    logout: {
      title: t("edit.modal.logout.title"),
      message: t("edit.modal.logout.message"),
      confirmText: t("edit.modal.logout.confirmText"),
      cancelText: t("edit.modal.logout.cancelText")
    },
    deleteAccount: {
      title: t("edit.modal.deleteAccount.title"),
      message: t("edit.modal.deleteAccount.message"),
      confirmText: t("edit.modal.deleteAccount.confirmText"),
      cancelText: t("edit.modal.deleteAccount.cancelText")
    }
  } as const;

  useEffect(() => {
    const handleAccessRedirect = async (usernameParam: string) => {
      const accessData = await accessManager.checkEditPageAccess(usernameParam);

      if (!accessData) {
        const currentUser = await accessManager.getCurrentUserCached();
        if (!currentUser) {
          router.push("/login");
        } else {
          router.replace(`/user/${usernameParam}`);
        }
        return null;
      }

      return accessData;
    };

    const initPage = async () => {
      if (!usernameParam) return;
      setIsLoading(true);
      try {
        const accessData = await handleAccessRedirect(usernameParam);
        if (!accessData) return;

        const { currentUser, pageUser } = accessData;

        setUser(currentUser);
        setOriginalUserData(pageUser);
        setUsername(pageUser.username);
        setEmail(pageUser.email);
        setBio(pageUser.bio || "");
        setLinks(pageUser.links || []);
        setUserStyles(pageUser.styles || templates.darkTheme);
        setAvatarUrl(pageUser.avatar || null);
        setBackgroundUrl(pageUser.styles.background.value.image || null);
      } catch (error) {
        console.error("Failed to initialize page:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    initPage();
  }, [usernameParam, router, setUser]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e, {
      type: "avatar",
      maxSizeMB: 5,
      onSuccess: url => setAvatarUrl(url),
      onStart: () => setIsUploadingAvatar(true),
      onFinish: () => setIsUploadingAvatar(false)
    });
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e, {
      type: "background",
      maxSizeMB: 10,
      onSuccess: url => setBackgroundUrl(url),
      onStart: () => setIsUploadingBackground(true),
      onFinish: () => setIsUploadingBackground(false)
    });
  };

  const handlePasswordResetRequest = async () => {
    try {
      if (!email) {
        setEmailError(t("edit.security.emailRequired"));
        return;
      }

      await authService.forgotPassword({ email });
      toast.success(t("edit.security.resetEmailSent"));
    } catch {
      console.error("Password reset request failed");
      toast.error(t("edit.security.resetEmailError"));
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
      toast.success(t("edit.styles.templateApplied", { templateName }));
    }
  };

  const validateForm = () => {
    if (!originalUserData) return { hasErrors: true, errors: {} };

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

    return { hasErrors, usernameValidation, emailValidation, linksValidation };
  };

  const handleAccept = async () => {
    if (!originalUserData) {
      console.error("Original user data is not loaded");
      return;
    }

    const { hasErrors } = validateForm();
    if (hasErrors) {
      toast.error(t("edit.validation.fixErrors"));
      return;
    }

    setError(null);

    const currentData = prepareCurrentData(
      userStyles,
      username,
      email,
      bio,
      links,
      avatarUrl,
      backgroundUrl,
      originalUserData
    );

    const changes = getChangedFields(
      originalUserData as unknown as Record<string, unknown>,
      currentData
    );

    if (!changes) {
      toast.success(t("edit.validation.noChanges"));
      return;
    }

    try {
      await userService.updateUser(usernameParam, changes);
      toast.success(t("edit.validation.updateSuccess"));

      setOriginalUserData({ ...originalUserData, ...currentData });

      if (username !== originalUserData.username) {
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
        setError(t("edit.validation.updateError"));
      }
    }
  };

  const handleCancelChangesClick = () => {
    if (!originalUserData) return;

    const currentData = prepareCurrentData(
      userStyles,
      username,
      email,
      bio,
      links,
      avatarUrl,
      backgroundUrl,
      originalUserData
    );

    const changes = getChangedFields(
      originalUserData as unknown as Record<string, unknown>,
      currentData
    );

    if (!changes) {
      router.push(`/user/${username}`);
      return;
    }

    openConfirmModal({ type: "cancelChanges" });
  };

  const handleCancelChanges = () => {
    router.push(`/user/${username}`);
    closeConfirmModal();
  };

  const renderAvatar = () => {
    if (isUploadingAvatar)
      return (
        <div className={styles.avatarLoading} role="status" aria-live="polite">
          <FiUpload aria-hidden="true" />
          <span>{t("edit.avatar.uploading")}</span>
        </div>
      );

    if (avatarUrl)
      return (
        <Image
          src={avatarUrl}
          alt={t("edit.avatar.currentAvatar", {
            defaultValue: `Поточний аватар ${username || "користувача"}`
          })}
          width={140}
          height={140}
          unoptimized
          className={styles.avatarImage}
        />
      );

    return <FaUserCircle className={styles.avatarPlaceholder} aria-hidden="true" />;
  };

  const renderBackground = () => {
    if (isUploadingBackground)
      return (
        <div className={styles.backgroundLoading} role="status" aria-live="polite">
          <FiUpload aria-hidden="true" />
          <span>{t("common.loading", { defaultValue: "Завантаження..." })}</span>
        </div>
      );

    if (backgroundUrl)
      return (
        <Image
          src={backgroundUrl}
          alt={t("edit.styles.background.currentImage", {
            defaultValue: "Поточне зображення фону"
          })}
          width={600}
          height={200}
          className={styles.backgroundImage}
          unoptimized
        />
      );

    return (
      <div className={styles.backgroundPlaceholder}>
        <FiImage aria-hidden="true" />
        <span>{t("edit.styles.background.uploadPrompt")}</span>
      </div>
    );
  };

  if (isLoading) {
    return <Loader isOpen={true} />;
  }

  if (!originalUserData) {
    throw new Error(t("edit.errors.userNotFound"));
  }

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>{t("edit.title")}</h1>

        <div
          className={styles.tabs}
          role="tablist"
          aria-label={t("edit.tabs.label", { defaultValue: "Налаштування профілю" })}
        >
          <button
            role="tab"
            aria-selected={activeTab === "profile"}
            aria-controls="profile-panel"
            id="profile-tab"
            className={`${styles.tab} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            {t("edit.tabs.profile")}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "styles"}
            aria-controls="styles-panel"
            id="styles-tab"
            className={`${styles.tab} ${activeTab === "styles" ? styles.active : ""}`}
            onClick={() => setActiveTab("styles")}
          >
            {t("edit.tabs.styles")}
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === "profile" ? (
            <div
              className={styles.section}
              role="tabpanel"
              id="profile-panel"
              aria-labelledby="profile-tab"
            >
              <div className={`${styles.profileCard}`}>
                <div className={styles.cardHeader}>
                  <h2>
                    <FiUser aria-hidden="true" />
                    {t("edit.avatar.title")}
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.avatarSection}>
                    <div className={styles.avatarContainer}>
                      <label htmlFor="avatarInput" className={styles.avatarLabel}>
                        {renderAvatar()}
                        <div className={styles.avatarOverlay} aria-hidden="true">
                          <FiUpload />
                        </div>
                      </label>
                      <input
                        id="avatarInput"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.avif,.tiff,.gif"
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                        aria-label={t("edit.avatar.uploadLabel", {
                          defaultValue: "Завантажити аватар"
                        })}
                      />
                    </div>
                    <p className={styles.avatarHint}>{t("edit.avatar.hint")}</p>
                  </div>
                </div>
              </div>

              <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                  <h2>
                    <IoMdDocument aria-hidden="true" /> {t("edit.basicInfo.title")}
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.basicInfoGrid}>
                    <Input
                      type="text"
                      label={t("edit.basicInfo.username")}
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
                      label={t("edit.basicInfo.email")}
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
                    <FiKey aria-hidden="true" />
                    {t("edit.security.title")}
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.passwordSection}>
                    <p className={styles.hint}>{t("edit.security.hint")}</p>
                    <span className={styles.passwordLabel} id="password-label">
                      {t("edit.security.password")}
                    </span>
                    <button
                      className={styles.changePasswordBtn}
                      onClick={handlePasswordResetRequest}
                      aria-describedby="password-label"
                    >
                      {t("edit.security.changePassword")}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                  <h2>
                    <FiInfo aria-hidden="true" /> {t("edit.bio.title")}
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.bioSection}>
                    <Textarea
                      label={t("edit.bio.label")}
                      placeholder={t("edit.bio.placeholder")}
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
                    <FiLink aria-hidden="true" />
                    {t("edit.links.title")}
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.linksSection}>
                    <div className={styles.linksHeader}>
                      <h3>{t("edit.links.subtitle")}</h3>
                      <button
                        className={styles.addBtn}
                        onClick={handleAddLink}
                        aria-label={t("edit.links.addLabel", {
                          defaultValue: "Додати нове посилання"
                        })}
                      >
                        <FaPlus aria-hidden="true" />
                      </button>
                    </div>
                    {links.length > 0 ? (
                      <div className={styles.linksList} role="list">
                        {links.map((link, index) => (
                          <div key={index} className={styles.linkItem} role="listitem">
                            <Input
                              type="text"
                              placeholder={t("edit.links.titlePlaceholder")}
                              value={link.title}
                              onChange={e => handleLinkChange(index, "title", e.target.value)}
                              aria-label={t("edit.links.titleLabel", {
                                defaultValue: `Назва посилання ${index + 1}`
                              })}
                            />
                            <Input
                              type="text"
                              placeholder={t("edit.urlPlaceholder")}
                              value={link.url}
                              onChange={e => handleLinkChange(index, "url", e.target.value)}
                              error={linkErrors[index] || undefined}
                              aria-label={t("edit.links.urlLabel", {
                                defaultValue: `URL посилання ${index + 1}`
                              })}
                            />
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleRemoveLink(index)}
                              aria-label={t("edit.links.deleteLabel", {
                                defaultValue: `Видалити посилання ${index + 1}`
                              })}
                            >
                              <FiTrash2 aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyLinks} role="status">
                        {t("edit.links.empty")}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`${styles.profileCard} ${styles.dangerZone}`}>
                <div className={styles.cardHeader}>
                  <h2>
                    <FiAlertTriangle aria-hidden="true" />
                    {t("edit.dangerZone.title")}
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.dangerActions}>
                    <button
                      className={styles.dangerBtn}
                      onClick={handleLogoutClick}
                      aria-label={t("edit.dangerZone.logoutLabel", {
                        defaultValue: "Вийти з облікового запису"
                      })}
                    >
                      <FiLogOut aria-hidden="true" />
                      {t("edit.dangerZone.logout")}
                    </button>
                    <button
                      className={`${styles.dangerBtn} ${styles.deleteAccount}`}
                      onClick={handleDeleteAccountClick}
                      aria-label={t("edit.dangerZone.deleteLabel", {
                        defaultValue: "Видалити обліковий запис назавжди"
                      })}
                    >
                      <FiTrash2 aria-hidden="true" />
                      {t("edit.dangerZone.deleteAccount")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={styles.section}
              role="tabpanel"
              id="styles-panel"
              aria-labelledby="styles-tab"
            >
              {[
                { key: "templates", label: t("edit.styles.sections.templates") },
                { key: "background", label: t("edit.styles.sections.background") },
                { key: "typography", label: t("edit.styles.sections.typography") },
                { key: "colors", label: t("edit.styles.sections.colors") },
                { key: "layout", label: t("edit.styles.sections.layout") }
              ].map(({ key, label }) => {
                const isOpen = openSection === key;
                return (
                  <div key={key} className={`${styles.accordion} ${isOpen ? styles.open : ""}`}>
                    <button
                      className={styles.accordionHeader}
                      onClick={() => setOpenSection(prev => (prev === key ? "" : key))}
                      aria-expanded={isOpen}
                      aria-controls={`accordion-${key}`}
                      id={`accordion-header-${key}`}
                    >
                      <span>{label}</span>
                      <IoIosArrowDown aria-hidden="true" />
                    </button>

                    <div
                      className={styles.accordionContent}
                      id={`accordion-${key}`}
                      role="region"
                      aria-labelledby={`accordion-header-${key}`}
                      aria-hidden={!isOpen}
                    >
                      {/* === Templates === */}
                      {key === "templates" && (
                        <>
                          <p className={styles.hint}>{t("edit.styles.templatesHint")}</p>
                          <div className={styles.templateGrid} role="list">
                            {Object.keys(templates).map(templateKey => (
                              <button
                                key={templateKey}
                                className={styles.templateBtn}
                                onClick={() => handleTemplateSelect(templateKey)}
                                role="listitem"
                                aria-label={t("edit.styles.templateLabel", {
                                  defaultValue: `Вибрати шаблон ${templateKey.replace(/([A-Z])/g, " $1").trim()}`
                                })}
                              >
                                {templateKey.replace(/([A-Z])/g, " $1").trim()}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {/* === Background === */}
                      {key === "background" && (
                        <>
                          <div className={styles.formRow}>
                            <Select
                              label={t("edit.styles.background.type")}
                              value={userStyles.background.type}
                              onChange={e => handleStyleChange("background.type", e.target.value)}
                              options={[
                                { value: "color", label: t("edit.styles.background.typeColor") },
                                {
                                  value: "gradient",
                                  label: t("edit.styles.background.typeGradient")
                                },
                                { value: "image", label: t("edit.styles.background.typeImage") }
                              ]}
                            />
                          </div>

                          {userStyles.background.type === "color" && (
                            <div className={styles.formRow}>
                              <div className={styles.formGroup}>
                                <label htmlFor="bg-color-input">
                                  {t("edit.styles.background.backgroundColor")}
                                </label>
                                <div className={styles.colorWrapper}>
                                  <input
                                    id="bg-color-input"
                                    type="color"
                                    value={userStyles.background.value.color}
                                    onChange={e =>
                                      handleStyleChange("background.value.color", e.target.value)
                                    }
                                    className={styles.colorInput}
                                    aria-label={t("edit.styles.background.colorLabel", {
                                      defaultValue: "Колір фону"
                                    })}
                                  />
                                  <span className={styles.colorValue} aria-live="polite">
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
                                  <label htmlFor="gradient-start-input">
                                    {t("edit.styles.background.gradientStart")}
                                  </label>
                                  <div className={styles.colorWrapper}>
                                    <input
                                      id="gradient-start-input"
                                      type="color"
                                      value={userStyles.background.value.gradient?.start}
                                      onChange={e =>
                                        handleStyleChange(
                                          "background.value.gradient.start",
                                          e.target.value
                                        )
                                      }
                                      className={styles.colorInput}
                                      aria-label={t("edit.styles.background.gradientStartLabel", {
                                        defaultValue: "Початковий колір градієнта"
                                      })}
                                    />
                                    <span className={styles.colorValue} aria-live="polite">
                                      {userStyles.background.value.gradient?.start}
                                    </span>
                                  </div>
                                </div>
                                <div className={styles.formGroup}>
                                  <label htmlFor="gradient-end-input">
                                    {t("edit.styles.background.gradientEnd")}
                                  </label>
                                  <div className={styles.colorWrapper}>
                                    <input
                                      id="gradient-end-input"
                                      type="color"
                                      value={userStyles.background.value.gradient?.end}
                                      onChange={e =>
                                        handleStyleChange(
                                          "background.value.gradient.end",
                                          e.target.value
                                        )
                                      }
                                      className={styles.colorInput}
                                      aria-label={t("edit.styles.background.gradientEndLabel", {
                                        defaultValue: "Кінцевий колір градієнта"
                                      })}
                                    />
                                    <span className={styles.colorValue} aria-live="polite">
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
                                  label={t("edit.styles.background.gradientAngle")}
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
                                {renderBackground()}
                                <div className={styles.backgroundOverlay} aria-hidden="true">
                                  <FiUpload />
                                </div>
                              </label>
                              <input
                                id="backgroundInput"
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp,.avif,.tiff,.gif"
                                style={{ display: "none" }}
                                onChange={handleBackgroundUpload}
                                aria-label={t("edit.styles.background.uploadLabel", {
                                  defaultValue: "Завантажити зображення фону"
                                })}
                              />
                              <div className={styles.formRow}>
                                <Select
                                  label={t("edit.styles.background.position")}
                                  value={userStyles.background.value.position}
                                  onChange={e =>
                                    handleStyleChange("background.value.position", e.target.value)
                                  }
                                  options={[
                                    {
                                      value: "center",
                                      label: t("edit.styles.background.posCenter")
                                    },
                                    { value: "top", label: t("edit.styles.background.posTop") },
                                    {
                                      value: "bottom",
                                      label: t("edit.styles.background.posBottom")
                                    },
                                    { value: "left", label: t("edit.styles.background.posLeft") },
                                    { value: "right", label: t("edit.styles.background.posRight") }
                                  ]}
                                />
                                <Select
                                  label={t("edit.styles.background.size")}
                                  value={userStyles.background.value.size}
                                  onChange={e =>
                                    handleStyleChange("background.value.size", e.target.value)
                                  }
                                  options={[
                                    {
                                      value: "cover",
                                      label: t("edit.styles.background.sizeCover")
                                    },
                                    {
                                      value: "contain",
                                      label: t("edit.styles.background.sizeContain")
                                    },
                                    { value: "auto", label: t("edit.styles.background.sizeAuto") }
                                  ]}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* === Typography === */}
                      {key === "typography" && (
                        <>
                          <div className={styles.formRow}>
                            <Select
                              label={t("edit.styles.typography.font")}
                              value={userStyles.font}
                              onChange={e => handleStyleChange("font", e.target.value)}
                              options={fontOptions}
                            />
                            <Input
                              type="number"
                              min={8}
                              max={72}
                              step={1}
                              label={t("edit.styles.typography.fontSize")}
                              value={parseUnitValue(userStyles.fontSize)}
                              onChange={e => handleStyleChange("fontSize", e.target.value)}
                              placeholder="16"
                            />
                          </div>
                          <div className={styles.formRow}>
                            <Select
                              label={t("edit.styles.typography.fontWeight")}
                              value={userStyles.fontWeight}
                              onChange={e => handleStyleChange("fontWeight", e.target.value)}
                              options={[
                                { value: "300", label: t("edit.styles.typography.weightLight") },
                                { value: "400", label: t("edit.styles.typography.weightNormal") },
                                { value: "500", label: t("edit.styles.typography.weightMedium") },
                                { value: "600", label: t("edit.styles.typography.weightSemibold") },
                                { value: "700", label: t("edit.styles.typography.weightBold") }
                              ]}
                            />
                            <Select
                              label={t("edit.styles.typography.textAlign")}
                              value={userStyles.textAlign}
                              onChange={e => handleStyleChange("textAlign", e.target.value)}
                              options={[
                                { value: "left", label: t("edit.styles.typography.alignLeft") },
                                { value: "center", label: t("edit.styles.typography.alignCenter") },
                                { value: "right", label: t("edit.styles.typography.alignRight") }
                              ]}
                            />
                          </div>
                        </>
                      )}

                      {/* === Colors === */}
                      {key === "colors" && (
                        <div className={styles.colorGrid}>
                          {[
                            ["text", t("edit.styles.colors.text")],
                            ["linkText", t("edit.styles.colors.linkText")],
                            ["buttonText", t("edit.styles.colors.buttonText")],
                            ["buttonBackground", t("edit.styles.colors.buttonBackground")],
                            ["buttonHoverText", t("edit.styles.colors.buttonHoverText")],
                            [
                              "buttonHoverBackground",
                              t("edit.styles.colors.buttonHoverBackground")
                            ],
                            ["border", t("edit.styles.colors.border")],
                            ["contentBackground", t("edit.styles.colors.contentBackground")]
                          ].map(([keyName, label]) => (
                            <div key={keyName} className={styles.formGroup}>
                              <label htmlFor={`color-${keyName}`}>{label}</label>
                              <div className={styles.colorWrapper}>
                                <input
                                  id={`color-${keyName}`}
                                  type="color"
                                  value={userStyles[keyName as keyof typeof userStyles] as string}
                                  onChange={e => handleStyleChange(keyName, e.target.value)}
                                  className={styles.colorInput}
                                  aria-label={label}
                                />
                                <span className={styles.colorValue} aria-live="polite">
                                  {userStyles[keyName as keyof typeof userStyles] as string}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* === Layout === */}
                      {key === "layout" && (
                        <div className={styles.formRow}>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            label={t("edit.styles.layout.borderRadius")}
                            value={parseUnitValue(userStyles.borderRadius)}
                            onChange={e => handleStyleChange("borderRadius", e.target.value)}
                            placeholder="8"
                          />
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            label={t("edit.styles.layout.padding")}
                            value={parseUnitValue(userStyles.contentPadding)}
                            onChange={e => handleStyleChange("contentPadding", e.target.value)}
                            placeholder="20"
                          />
                          <Input
                            type="number"
                            min={0}
                            max={60}
                            step={1}
                            label={t("edit.styles.layout.gap")}
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
          <div className={styles.errorMessage} role="alert" aria-live="assertive">
            <FiAlertTriangle aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div className={styles.actionButtons}>
          <Button type="button" variant="secondary" onClick={handleCancelChangesClick}>
            {t("edit.actions.cancel")}
          </Button>
          <Button type="button" variant="primary" onClick={handleAccept}>
            {t("edit.actions.save")}
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
