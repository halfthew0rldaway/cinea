import { useState, useEffect, useRef } from "react";
import { storage } from "../utils/storage";
import { 
  StreambertLogo, 
  DocumentIcon, 
  AnimeIcon, 
  ToolIcon, 
  WavesIcon, 
  UtilityIcon, 
  TimerIcon, 
  CalculatorIcon 
} from "./Icons";
import "../styles/sarcastic.css";

const SARCASTIC_LINES = [
  "We scraped the internet so you don't have to.",
  "Totally legal. Definitely not suspicious at all.",
  "Your parents would be so proud.",
  "Netflix is typing…",
  "Powered by vibes and stolen API keys.",
  "No subscription required. No guilt either.",
  "We monetize nothing. You're welcome.",
  "This definitely won't get taken down.",
  "Steal smarter, not harder.",
  "You're welcome, broke bestie.",
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
    // Pop up on every refresh as requested
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
              text='"Your favorite morally-gray streaming catalog"'
              delay={400}
              speed={35}
            />
          )}
        </p>

        <div className="sw-scrollable-content">
          {/* Main sarcastic body */}
          <div className="sw-body" style={{ marginBottom: "10px" }}>
            <p className="sw-text" style={{ fontSize: "18px", fontWeight: "600", color: "var(--red)" }}>
              Oh wow, you actually clicked on this. Bold move.
            </p>
            <p className="sw-text sw-text-dim" style={{ fontSize: "16px" }}>
              This project crawls the deepest corners of the internet to scrape media links, compiling them into a surprisingly functional catalog. It then wraps everything in a UI so beautiful you'll completely forget you aren't paying a monthly subscription.
            </p>
            <p className="sw-text sw-text-dim" style={{ fontSize: "16px" }}>
              Say goodbye to paying for 15 different streaming platforms. Say hello to pure, unfiltered entertainment.
            </p>
          </div>

          {/* Projects Grid */}
          <h2 className="sw-projects-title">My Other Projects (That Mostly Work)</h2>
          <div className="sw-projects-grid">
            <a href="https://docsmith-six.vercel.app/" target="_blank" rel="noreferrer" className="sw-project-link">
              <div className="sw-project-name"><span><DocumentIcon /></span> Docsmith</div>
              <div className="sw-project-desc">A document editor for people who pretend to work.</div>
            </a>
            <a href="https://animix-omega.vercel.app/" target="_blank" rel="noreferrer" className="sw-project-link">
              <div className="sw-project-name"><span><AnimeIcon /></span> Animix</div>
              <div className="sw-project-desc">Like this app, but for anime. Weep for your bandwidth.</div>
            </a>
            <a href="https://aio-inky.vercel.app/" target="_blank" rel="noreferrer" className="sw-project-link">
              <div className="sw-project-name"><span><ToolIcon /></span> AIO</div>
              <div className="sw-project-desc">An all-in-one tool for when you're too lazy to open tabs.</div>
            </a>
            <a href="https://flux-state.vercel.app/" target="_blank" rel="noreferrer" className="sw-project-link">
              <div className="sw-project-name"><span><WavesIcon /></span> Flux</div>
              <div className="sw-project-desc">Generate random things to manage your existential dread.</div>
            </a>
            <a href="https://halfthew0rldaway.github.io/utilify/" target="_blank" rel="noreferrer" className="sw-project-link">
              <div className="sw-project-name"><span><UtilityIcon /></span> Utilify</div>
              <div className="sw-project-desc">Utilities you could Google, wrapped in a shiny UI.</div>
            </a>
            <a href="https://halfthew0rldaway.github.io/pomodoro/" target="_blank" rel="noreferrer" className="sw-project-link">
              <div className="sw-project-name"><span><TimerIcon /></span> Pomodoro</div>
              <div className="sw-project-desc">A timer to guilt-trip you into studying for 25 minutes.</div>
            </a>
            <a href="https://halfthew0rldaway.github.io/kalkulatorkalori/" target="_blank" rel="noreferrer" className="sw-project-link">
              <div className="sw-project-name"><span><CalculatorIcon /></span> Kalori Calc</div>
              <div className="sw-project-desc">Calculate calories so you feel bad about your snacks.</div>
            </a>
          </div>
          
          <a href="https://github.com/halfthew0rldaway" target="_blank" rel="noreferrer" className="sw-github-link">
            Explore more questionable code on GitHub ↗
          </a>

          {/* Rotating sarcastic footer line */}
          <div className="sw-rotator">
            <span className="sw-rotator-text" key={currentLine}>
              {SARCASTIC_LINES[currentLine]}
            </span>
          </div>
        </div>

        {/* Dismiss button */}
        <button className="sw-cta" onClick={handleDismiss}>
          <span className="sw-cta-text">I Accept My Free Entertainment</span>
          <span className="sw-cta-arrow">→</span>
        </button>

        <p className="sw-footer-note" style={{ marginTop: "24px" }}>
          No account needed. No credit card. No dignity required.<br/>
          Crafted with immense sarcasm by <strong style={{ color: "var(--red)" }}>Wizzy</strong>.
        </p>
      </div>
    </div>
  );
}
