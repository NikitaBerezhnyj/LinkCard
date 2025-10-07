import { useEffect, useState } from "react";
import { getUserInfo } from "../api/userApi";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaBehance,
  FaMediumM,
  FaDribbble,
  FaPhoneAlt,
  FaPinterest,
  FaTiktok,
  FaRedditAlien,
  FaStackOverflow
} from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdAlternateEmail } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { IoEllipsisHorizontal } from "react-icons/io5";
import EditModal from "./EditModal";
import ActionModal from "./ActionModal";
import { updateUser } from "../api/userApi";
import "../styles/components/Template.css";

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

interface IBackground {
  type: "color" | "gradient" | "image";
  value: {
    color?: string;
    gradient?: {
      start: string;
      end: string;
    };
    image?: string;
  };
}

interface User {
  username: string;
  email: string;
  avatar: string;
  bio: string;
  links: ILink[];
  styles: IStyles;
}

function Template() {
  const [userName, setUserName] = useState<string>("");
  const [isPersonalAccount, setIsPersonalAccount] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [userStyles, setUserStyles] = useState<IStyles>({
    font: "Roboto",
    text: "#e0e0e0",
    button: "#2a2a2a",
    contentBackground: "#1f1f1f",
    border: "#dddddd",
    background: {
      type: "color",
      value: {
        color: "#121212",
        gradient: {
          start: "#6ab6e2",
          end: "#4a9bcf"
        },
        image: "http://localhost:3001/uploads/backgrounds/"
      }
    }
  });

  const linkIcons = [
    { domain: "github.com", icon: <FaGithub size={28} /> },
    { domain: "linkedin.com", icon: <FaLinkedin size={28} /> },
    { domain: "youtube.com", icon: <FaYoutube size={28} /> },
    { domain: "youtu.be", icon: <FaYoutube size={28} /> },
    { domain: "instagram.com", icon: <FaInstagram size={28} /> },
    { domain: "twitter.com", icon: <FaTwitter size={28} /> },
    { domain: "behance.net", icon: <FaBehance size={28} /> },
    { domain: "medium.com", icon: <FaMediumM size={28} /> },
    { domain: "dribbble.com", icon: <FaDribbble size={28} /> },
    { domain: "pinterest.com", icon: <FaPinterest size={28} /> },
    { domain: "tiktok.com", icon: <FaTiktok size={28} /> },
    { domain: "reddit.com", icon: <FaRedditAlien size={28} /> },
    { domain: "stackoverflow.com", icon: <FaStackOverflow size={28} /> }
  ];

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const usernameFromURL = pathSegments[pathSegments.length - 1];
    setUserName(usernameFromURL);
    const personalUsername = localStorage.getItem("username");
    if (usernameFromURL === personalUsername) {
      setIsPersonalAccount(true);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo(userName);
        setUserData(response.data || null);
      } catch (error) {
        setError(`Failed to fetch user data. ${error}`);
      }
    };

    if (userName !== "") {
      fetchUserData();
    }
  }, [userName]);

  useEffect(() => {
    if (!userData || !userData.styles) return;

    const { font, text, button, contentBackground, border, background } = userData.styles;
    const newUserStyles = {
      font,
      text,
      button,
      contentBackground,
      border,
      background
    };
    setUserStyles(newUserStyles);
  }, [userData]);

  useEffect(() => {
    setColors();
    setFont();
    setBackground();
  }, [userStyles]);

  const getFont = (font: string) => {
    return `font-${font.toLowerCase().replace(/\s+/g, "-")}`;
  };

  const getBackgroundStyles = (background: IBackground) => {
    if (background.type === "color" && background.value.color) {
      return `background-color: ${background.value.color};`;
    } else if (
      background.type === "gradient" &&
      background.value.gradient &&
      background.value.gradient.start &&
      background.value.gradient.end
    ) {
      return `background: linear-gradient(${background.value.gradient.start}, ${background.value.gradient.end});`;
    } else if (background.type === "image" && background.value.image) {
      return `
      background: url("${background.value.image}");
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;`;
    } else {
      return "";
    }
  };

  const getLinkIcon = (link: string) => {
    for (const { domain, icon } of linkIcons) {
      if (link.includes(domain)) {
        return icon;
      }
    }
    if (/^\+?[0-9]{1,3}?[-. ()]*([0-9]{1,4}[-. ()]*){1,4}$/.test(link)) {
      return <FaPhoneAlt size={28} />;
    } else if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(link)) {
      return <MdAlternateEmail size={28} />;
    } else {
      return <IoIosLink size={28} />;
    }
  };

  const setColors = () => {
    document.documentElement.style.setProperty("--text", userStyles.text);
    document.documentElement.style.setProperty("--button", userStyles.button);
    document.documentElement.style.setProperty(
      "--content-background",
      userStyles.contentBackground
    );
    document.documentElement.style.setProperty("--border", userStyles.border);
  };

  const setFont = () => {
    const templateContainer = document.querySelector(".template-wrap");
    if (templateContainer) {
      templateContainer.className = `template-wrap ${getFont(userStyles.font)}`;
    }
  };

  const setBackground = () => {
    const templateContainer = document.querySelector(".template-container") as HTMLElement;
    if (templateContainer) {
      templateContainer.style.cssText = getBackgroundStyles(userStyles.background as IBackground);
    }
  };

  const handleEditButtonClick = () => {
    setIsEditModalOpen(true);
  };

  const handleActionButtonClick = () => {
    setIsActionModalOpen(true);
  };

  const handleSave = async (bio: string, links: ILink[], imageUrl: string, styles: IStyles) => {
    if (userData) {
      const updatedUserData = {
        username: userData.username,
        email: userData.email,
        avatar: imageUrl,
        bio: bio,
        links: links,
        styles: styles
      };

      try {
        await updateUser(updatedUserData);
        setUserData(updatedUserData);
        setIsEditModalOpen(false);
      } catch (error) {
        setError("Failed to update user data.");
        console.error("Error updating user data:", error);
      }
    }
  };

  return (
    <div className="template-container">
      <button className="template-action-button" onClick={handleActionButtonClick}>
        <IoEllipsisHorizontal />
      </button>
      <div className="template-wrap">
        {error && <p>{error}</p>}
        {userData ? (
          <div>
            <div className="template-base-info">
              <img
                src={userData.avatar}
                alt="User Avatar"
                style={{ width: "150px", borderRadius: "50%" }}
              />
              <div className="template-base-info-text">
                <p>
                  <b>Name:</b> {userData.username}
                </p>
                <p>
                  <b>Bio:</b> {userData.bio || "No bio available"}
                </p>
              </div>
            </div>
            {isPersonalAccount && (
              <button className="template-edit-button" onClick={handleEditButtonClick}>
                Edit <CiEdit />
              </button>
            )}
            <h3>Links:</h3>
            {userData.links.length > 0 ? (
              <div className="template-links-container">
                {userData.links.map((link, index) => (
                  <div
                    key={index}
                    className="template-link-item"
                    onClick={() => {
                      const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(link.url);
                      const isPhone = /^\+?[0-9]{1,3}?[-. ()]*([0-9]{1,4}[-. ()]*){1,4}$/.test(
                        link.url
                      );
                      const linkToOpen = isEmail
                        ? `mailto:${link.url}`
                        : isPhone
                          ? `tel:${link.url}`
                          : link.url;
                      window.open(linkToOpen, isEmail || isPhone ? "_self" : "_blank");
                    }}
                  >
                    {getLinkIcon(link.url)} <span style={{ marginLeft: "8px" }}>{link.title}</span>{" "}
                  </div>
                ))}
              </div>
            ) : (
              <p>No links available</p>
            )}
          </div>
        ) : (
          !error && <p>Loading...</p>
        )}
      </div>
      {isEditModalOpen && userData && (
        <EditModal
          userData={userData}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
        />
      )}
      {isActionModalOpen && (
        <ActionModal
          onClose={() => setIsActionModalOpen(false)}
          isPersonalAccount={isPersonalAccount}
        />
      )}
    </div>
  );
}

export default Template;
