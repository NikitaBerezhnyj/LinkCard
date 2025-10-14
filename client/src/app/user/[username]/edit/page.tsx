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
import Loader from "@/components/modals/Loader";
import axios from "axios";
import { useTranslation } from "react-i18next";

type TabType = "profile" | "styles";
type ConfirmAction =
  | { type: "deleteLink"; payload: number }
  | { type: "cancelChanges" }
  | { type: "logout" }
  | { type: "deleteAccount" };

type UploadType = "avatar" | "background";
interface UploadOptions {
  type: UploadType;
  maxSizeMB: number;
  onSuccess: (url: string) => void;
  onStart?: () => void;
  onFinish?: () => void;
}

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

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

  const [openSection, setOpenSection] = useState<string>("Colors");
  const [userStyles, setUserStyles] = useState<IUser["styles"]>(templates.darkTheme);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const { t } = useTranslation();
  const { username: currentUsername } = useAuth({ forceCheck: true });

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

        setIsLoading(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [usernameParam]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    options: UploadOptions
  ) => {
    const { type, maxSizeMB, onSuccess, onStart, onFinish } = options;
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(t("edit.upload.fileTooLarge", { maxSizeMB }));
      return;
    }

    try {
      onStart?.();

      const response =
        type === "avatar"
          ? await uploadService.uploadAvatar(file)
          : await uploadService.uploadBackground(file);

      const newUrl = response.data?.filePath;
      if (!newUrl) throw new Error(t("edit.upload.uploadFailed"));

      onSuccess(newUrl);
      toast.success(
        type === "avatar" ? t("edit.upload.avatarSuccess") : t("edit.upload.backgroundSuccess")
      );
    } catch (error: unknown) {
      console.error(`Download error ${type}:`, error);

      let errorMessage =
        type === "avatar" ? t("edit.upload.avatarError") : t("edit.upload.backgroundError");

      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (typeof data === "object" && data && "message" in data) {
          errorMessage = (data as { message: string }).message;
        } else if (typeof data === "string") {
          errorMessage = data;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      onFinish?.();
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    handleImageUpload(event, {
      type: "avatar",
      maxSizeMB: 5,
      onStart: () => setIsUploadingAvatar(true),
      onFinish: () => setIsUploadingAvatar(false),
      onSuccess: url => setAvatarUrl(url)
    });

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) =>
    handleImageUpload(event, {
      type: "background",
      maxSizeMB: 10,
      onStart: () => setIsUploadingBackground(true),
      onFinish: () => setIsUploadingBackground(false),
      onSuccess: url => {
        setBackgroundUrl(url);
        handleStyleChange("background.value.image", url);
      }
    });

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

  const prepareCurrentData = (): Partial<IUser> => {
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

    if (avatarUrl && avatarUrl !== originalUserData?.avatar) {
      currentData.avatar = avatarUrl;
    }

    return currentData;
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

    const currentData = prepareCurrentData();

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

    const currentData = prepareCurrentData();

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

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            {t("edit.tabs.profile")}
          </button>
          <button
            className={`${styles.tab} ${activeTab === "styles" ? styles.active : ""}`}
            onClick={() => setActiveTab("styles")}
          >
            {t("edit.tabs.styles")}
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === "profile" ? (
            <div className={styles.section}>
              <div className={`${styles.profileCard}`}>
                <div className={styles.cardHeader}>
                  <h2>
                    <FiUser />
                    {t("edit.avatar.title")}
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.avatarSection}>
                    <div className={styles.avatarContainer}>
                      <label htmlFor="avatarInput" className={styles.avatarLabel}>
                        {isUploadingAvatar ? (
                          <div className={styles.avatarLoading}>
                            <FiUpload />
                            {t("edit.avatar.uploading")}
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
                    <p className={styles.avatarHint}>{t("edit.avatar.hint")}</p>
                  </div>
                </div>
              </div>

              <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                  <h2>
                    <IoMdDocument /> {t("edit.basicInfo.title")}
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
                    <FiKey />
                    {t("edit.security.title")}
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.passwordSection}>
                    <p className={styles.hint}>{t("edit.security.hint")}</p>
                    <span className={styles.passwordLabel}>{t("edit.security.password")}</span>
                    <button
                      className={styles.changePasswordBtn}
                      onClick={handlePasswordResetRequest}
                    >
                      {t("edit.security.changePassword")}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                  <h2>
                    <FiInfo /> {t("edit.bio.title")}
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
                    <FiLink />
                    {t("edit.links.title")}
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.linksSection}>
                    <div className={styles.linksHeader}>
                      <h3>{t("edit.links.subtitle")}</h3>
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
                              placeholder={t("edit.links.titlePlaceholder")}
                              value={link.title}
                              onChange={e => handleLinkChange(index, "title", e.target.value)}
                            />
                            <Input
                              type="text"
                              placeholder={t("edit.urlPlaceholder")}
                              value={link.url}
                              onChange={e => handleLinkChange(index, "url", e.target.value)}
                              error={linkErrors[index] || undefined}
                            />
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleRemoveLink(index)}
                              title={t("edit.links.deleteTooltip")}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyLinks}>{t("edit.links.empty")}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`${styles.profileCard} ${styles.dangerZone}`}>
                <div className={styles.cardHeader}>
                  <h2>
                    <FiAlertTriangle />
                    {t("edit.dangerZone.title")}
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.dangerActions}>
                    <button className={styles.dangerBtn} onClick={handleLogoutClick}>
                      <FiLogOut />
                      {t("edit.dangerZone.logout")}
                    </button>
                    <button
                      className={`${styles.dangerBtn} ${styles.deleteAccount}`}
                      onClick={handleDeleteAccountClick}
                    >
                      <FiTrash2 />
                      {t("edit.dangerZone.deleteAccount")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.section}>
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
                    >
                      {label}
                      <IoIosArrowDown />
                    </button>

                    <div className={styles.accordionContent}>
                      {/* === Templates === */}
                      {key === "templates" && (
                        <>
                          <p className={styles.hint}>{t("edit.styles.templatesHint")}</p>
                          <div className={styles.templateGrid}>
                            {Object.keys(templates).map(templateKey => (
                              <button
                                key={templateKey}
                                className={styles.templateBtn}
                                onClick={() => handleTemplateSelect(templateKey)}
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
                                <label>{t("edit.styles.background.backgroundColor")}</label>
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
                                  <label>{t("edit.styles.background.gradientStart")}</label>
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
                                  <label>{t("edit.styles.background.gradientEnd")}</label>
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
                                {isUploadingBackground ? (
                                  <div className={styles.backgroundLoading}>
                                    <FiUpload />
                                    {t("common.loading", { defaultValue: "Завантаження..." })}
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
                                    <span>{t("edit.styles.background.uploadPrompt")}</span>
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
                              <label>{label}</label>
                              <div className={styles.colorWrapper}>
                                <input
                                  type="color"
                                  value={userStyles[keyName as keyof typeof userStyles] as string}
                                  onChange={e => handleStyleChange(keyName, e.target.value)}
                                  className={styles.colorInput}
                                />
                                <span className={styles.colorValue}>
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
          <div className={styles.errorMessage}>
            <FiAlertTriangle />
            {error}
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
