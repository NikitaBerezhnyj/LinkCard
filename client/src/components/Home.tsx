import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import ToTopButton from "./ToTopButton";
import "../styles/components/Home.css";

function Home() {
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUserName(username || "");
  }, []);

  const handleWatchCard = () => {
    if (userName) {
      navigate(`/user/${userName}`);
    }
  };

  const scrollToNextSection = () => {
    const nextSection = document.querySelector(".why-linkcard-screen");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-container">
      {/* <Header /> */}
      <ToTopButton />
      <section className="screen welcome-screen">
        <h1 className="title">Welcome to LinkCard</h1>
        {userName && (
          <p className="welcome-message">
            Hi, <span>{userName}</span>! Ready to manage your LinkCard?
          </p>
        )}
        <div className="button-group">
          <button className="primary-button" onClick={handleWatchCard}>
            View Your Card
          </button>
        </div>
        <div className="scroll-down" onClick={scrollToNextSection}>
          <IoIosArrowDown className="arrow-icon" />
        </div>
      </section>

      <section className="screen why-linkcard-screen">
        <h2>Why LinkCard?</h2>
        <p>
          LinkCard is a powerful tool to help you create a sleek, customizable digital business
          card. Share your contact details and social links effortlessly.
        </p>
      </section>

      <section className="screen features-screen">
        <h2>Features</h2>
        <ul className="features-list">
          <li>📱 Customizable themes and layouts for your card</li>
          <li>🔗 Easy link sharing and QR code generation</li>
          <li>🌐 Share across multiple social media platforms</li>
          <li>📈 Analytics to track your card's views and interactions</li>
        </ul>
      </section>

      <section className="screen how-it-works-screen">
        <h2>How It Works</h2>
        <p>
          Create your LinkCard in three simple steps: Sign up, customize your profile, and share
          with your network. Whether it's for business or personal use, your LinkCard helps you make
          a memorable impression.
        </p>
      </section>

      <section className="screen get-started-screen">
        <h2>Get Started</h2>
        <p>
          Ready to create your LinkCard? Get started now and make networking easier and more
          engaging!
        </p>
        <button className="primary-button" onClick={handleWatchCard}>
          Start Now
        </button>
      </section>
    </div>
  );
}

export default Home;
