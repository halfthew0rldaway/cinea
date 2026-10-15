import { useState, useEffect, useRef } from "react";
import { storage } from "../utils/storage";
import { StreambertLogo } from "./Icons";
import "../styles/sarcastic.css";

const SARCASTIC_LINES = [
  "Because having fifteen streaming subscriptions makes total sense.",
  "Bypassing the friction of modern streaming.",
  "Zero subscription tiers. Zero newsletter sign-ups.",
  "No 30-second unskippable ads for car insurance.",
  "Your wallet can take a well-deserved breather.",
  "Aggregating the web so you don't have to.",
  "Clean interface, straight to the point."
];

function TypewriterText({ text, delay = 0, speed = 30 }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [started, text, speed]);

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="sw-cursor">|</span>
      )}
    </span>
  );
}

function FloatingParticle({ delay }) {
  return (
    <div
      className="sw-particle"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${6 + Math.random() * 8}s`,
      }}
    />
  );
}

export default function SarcasticWelcomeModal() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState(0); // 0=entering, 1=content, 2=leaving
  const [currentLine, setCurrentLine] = useState(0);
  const boxRef = useRef(null);

  useEffect(() => {
    // Only pop up if the user hasn't seen it yet
    if (storage.get("hasSeenWelcome")) return;
    
    const t = setTimeout(() => {
      setPhase(1);
      setShow(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  // Rotate sarcastic lines
  useEffect(() => {
    if (phase !== 1) return;
    const iv = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % SARCASTIC_LINES.length);
    }, 4000);
    return () => clearInterval(iv);
  }, [phase]);

  const handleDismiss = () => {
    setPhase(2);
    storage.set("hasSeenWelcome", true);
    setTimeout(() => {
      setShow(false);
    }, 500);
  };

  if (!show) return null;

  return (
    <div className={`sw-overlay ${phase === 2 ? "sw-exit" : "sw-enter"}`}>
      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.7} />
      ))}

      <div
        className={`sw-card ${phase === 2 ? "sw-card-exit" : ""}`}
        ref={boxRef}
      >
        {/* Glow ring */}
        <div className="sw-glow-ring" />

        {/* Logo */}
        <div className="sw-logo-container">
          <div className="sw-logo">
            <StreambertLogo style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="sw-logo-pulse" />
        </div>

        {/* Title with staggered letters */}
        <h1 className="sw-title">
          {"CINEA".split("").map((ch, i) => (
            <span
              key={i}
              className="sw-letter"
              style={{ animationDelay: `${0.3 + i * 0.08}s` }}
            >
              {ch}
            </span>
          ))}
        </h1>

        <div className="sw-subtitle-line" />

        {/* Sarcasm sub-header */}
        <p className="sw-tagline">
          {phase === 1 && (
            <TypewriterText
              text='"Because managing seven subscriptions was getting absurd."'
              delay={400}
              speed={35}
            />
          )}
        </p>

        <div className="sw-scrollable-content">
          {/* Main welcoming body */}
          <div className="sw-body">
            <p className="sw-text sw-highlight-text">
              Welcome to the simpler side of streaming.
            </p>
            <p className="sw-text sw-text-dim">
              A clean catalog to browse and watch your favorite movies and shows—without paywalls, account requirements, or endless subscription tiers.
            </p>
            <p className="sw-text sw-text-dim">
              Everything is aggregated in one responsive interface so you can spend less time searching and more time actually watching.
            </p>
          </div>

          {/* Rotating sarcastic footer line */}
          <div className="sw-rotator">
            <span className="sw-rotator-text" key={currentLine}>
              {SARCASTIC_LINES[currentLine]}
            </span>
          </div>
        </div>

        {/* Dismiss button */}
        <button className="sw-cta" onClick={handleDismiss}>
          <span className="sw-cta-text">Enter The Catalog</span>
          <span className="sw-cta-arrow">→</span>
        </button>

        <p className="sw-footer-note">
          No account needed • No credit card required<br/>
          Crafted by <strong className="sw-footer-name">Wizzy</strong>
        </p>
      </div>
    </div>
  );
}
