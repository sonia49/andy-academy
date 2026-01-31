import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  'https://lcbwehiwjowgthazrydy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYndlaGl3am93Z3RoYXpyeWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTg4NjIsImV4cCI6MjA4NDkzNDg2Mn0.2nP42Uh262Jt-1stolzSVM8_EEzrAdCutKgd7B2MurY'
);

const QUESTIONS = {
  math: {
    '6ème': [
      { q: "15 × 12 ?", r: "180" }, { q: "456 + 789 ?", r: "1245" }, { q: "144 ÷ 12 ?", r: "12" }, { q: "25 × 4 ?", r: "100" }, { q: "Moitié de 50 ?", r: "25" },
      { q: "1/4 de 100 ?", r: "25" }, { q: "2.5 + 3.5 ?", r: "6" }, { q: "Côtés hexagone ?", r: "6" }, { q: "Périmètre carré côté 5 ?", r: "20" }, { q: "Angles droits carré ?", r: "4" },
      { q: "1000 - 1 ?", r: "999" }, { q: "Double de 15 ?", r: "30" }, { q: "0.5 × 10 ?", r: "5" }, { q: "Côtés triangle ?", r: "3" }, { q: "100 ÷ 4 ?", r: "25" },
      { q: "9 × 8 ?", r: "72" }, { q: "7 × 7 ?", r: "49" }, { q: "Rayon si diamètre 10 ?", r: "5" }, { q: "3 × 3 × 3 ?", r: "27" }, { q: "150 + 150 ?", r: "300" }
    ],
    '5ème': [
      { q: "-5 + 8 ?", r: "3" }, { q: "-12 + 7 ?", r: "-5" }, { q: "-3 × 4 ?", r: "-12" }, { q: "Simplifie 4/8 ?", r: "1/2" }, { q: "Aire rectangle 5×8 ?", r: "40" }
    ]
  },
  french: {
    '6ème': [
      { q: "Nature de 'vite' ?", r: "adverbe" }, { q: "COD : 'Il lit un livre'", r: "un livre" }, { q: "Sujet : 'La pluie tombe'", r: "la pluie" }, { q: "Faire (nous, présent) ?", r: "faisons" }, { q: "Avoir (je, imparfait) ?", r: "avais" },
      { q: "Futur 'aller' (tu) ?", r: "iras" }, { q: "Pluriel 'journal' ?", r: "journaux" }, { q: "Féminin 'boulanger' ?", r: "boulangère" }, { q: "Synonyme 'triste' ?", r: "malheureux" }, { q: "Contraire 'chaud' ?", r: "froid" },
      { q: "Infinitif 'dormons' ?", r: "dormir" }, { q: "Type : 'Sortez !'", r: "imperative" }, { q: "Féminin 'lion' ?", r: "lionne" }, { q: "Syllabes 'bateau' ?", r: "2" }, { q: "Pluriel 'gaz' ?", r: "gaz" },
      { q: "Contraire 'petit' ?", r: "grand" }, { q: "Sujet 'Tu chantes' ?", r: "tu" }, { q: "Nature 'belle' ?", r: "adjectif" }, { q: "Verbe 'Il finit' ?", r: "finit" }, { q: "Synonyme 'joyeux' ?", r: "heureux" }
    ],
    '5ème': []
  },
  english: {
    '6ème': [
      { q: "Dog ?", r: "chien" }, { q: "Cat ?", r: "chat" }, { q: "House ?", r: "maison" }, { q: "School ?", r: "école" }, { q: "15 ?", r: "fifteen" },
      { q: "Red ?", r: "rouge" }, { q: "Blue ?", r: "bleu" }, { q: "I (to be) happy ?", r: "am" }, { q: "He (to have) a dog ?", r: "has" }, { q: "Family ?", r: "famille" },
      { q: "Apple ?", r: "pomme" }, { q: "Book ?", r: "livre" }, { q: "Hello ?", r: "bonjour" }, { q: "Thank you ?", r: "merci" }, { q: "Yellow ?", r: "jaune" },
      { q: "Green ?", r: "vert" }, { q: "Brother ?", r: "frère" }, { q: "Sister ?", r: "soeur" }, { q: "Sun ?", r: "soleil" }, { q: "Water ?", r: "eau" }
    ],
    '5ème': []
  }
};

const CAPITALS_GAME = [
  { country: "France", capital: "Paris" }, { country: "Espagne", capital: "Madrid" },
  { country: "Italie", capital: "Rome" }, { country: "Allemagne", capital: "Berlin" },
  { country: "Royaume-Uni", capital: "Londres" }, { country: "Portugal", capital: "Lisbonne" },
  { country: "Belgique", capital: "Bruxelles" }, { country: "Pays-Bas", capital: "Amsterdam" },
  { country: "Suisse", capital: "Berne" }, { country: "Autriche", capital: "Vienne" }
];

const AVATARS = ['🧁', '🍰', '🍭', '🍬', '🍩', '🍪', '🧋', '🍦', '🌈', '⭐', '💎', '🦄'];

function App() {
  const [screen, setScreen] = useState('auth');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [gameMode, setGameMode] = useState('menu');
  const [category, setCategory] = useState('math');
  const [level, setLevel] = useState('6ème');
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(null);
  const [currentCapital, setCurrentCapital] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState('🧁');
  const [showSettings, setShowSettings] = useState(false);
  
  // WIDGET TEMPS :
  const [secondsSpent, setSecondsSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSecondsSpent(s => s + 1), 1000);
    const saved = localStorage.getItem('selectedAvatar');
    if (saved) setSelectedAvatar(saved);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleAuth = async (type) => {
    if (!username || password.length < 6) {
      alert("⚠️ Pseudo et mot de passe (6+ caractères) requis !");
      return;
    }
    const email = username.toLowerCase().trim() + "@candy.app";
    if (type === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return alert("❌ " + error.message);
      await supabase.from('profiles').insert([{ id: data.user.id, email: username, diamonds: 100, level: 1, streak: 0 }]);
      alert("✨ Compte créé ! Connecte-toi.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert("❌ Pseudo ou mot de passe incorrect");
      let { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      setProfile(prof || { email: username, diamonds: 100, streak: 0 });
      setScreen('dashboard');
    }
  };

  const handleCheckAnswer = async () => {
    const questions = QUESTIONS[category][level];
    if (answer.toLowerCase().trim() === questions[currentQ].r.toLowerCase().trim()) {
      setShowResult('correct');
      if (window.confetti) window.confetti({ particleCount: 100, spread: 70 });
      setProfile(p => ({ ...p, diamonds: p.diamonds + 15, streak: p.streak + 1 }));
      setTimeout(() => {
        setShowResult(null);
        setCurrentQ((currentQ + 1) % questions.length);
        setAnswer('');
      }, 1500);
    } else {
      setShowResult('wrong');
      setTimeout(() => setShowResult(null), 1500);
    }
  };

  // FIX CAPITALES : On passe à l'index suivant correctement
  const handleCapitalAnswer = (selected) => {
    if (selected === CAPITALS_GAME[currentCapital].capital) {
      if (window.confetti) window.confetti({ particleCount: 50 });
      setProfile(p => ({ ...p, diamonds: p.diamonds + 10 }));
      
      if (currentCapital < CAPITALS_GAME.length - 1) {
        setCurrentCapital(currentCapital + 1);
      } else {
        alert("🌍 Tour du monde fini !");
        setGameMode('menu');
        setCurrentCapital(0);
      }
    } else {
      alert("Oups ! Réessaie.");
    }
  };

  if (screen === 'auth') {
    return (
      <div className="app">
        <div className="auth-container">
          <h1 className="logo">🍭 Candy Academy 🍬</h1>
          <input className="input-candy" placeholder="✨ Ton pseudo" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="input-candy" type="password" placeholder="🔐 Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={() => handleAuth('login')} className="btn-primary">SE CONNECTER</button>
          <button onClick={() => handleAuth('signup')} className="btn-secondary">CRÉER COMPTE</button>
        </div>
      </div>
    );
  }

  if (gameMode === 'menu') {
    return (
      <div className="app">
        <div className="settings-icon" onClick={() => setShowSettings(true)}>⚙️</div>
        <div className="dashboard">
          <div className="header">
            <div className="avatar-big">{selectedAvatar}</div>
            <div className="user-info">
              <h2>{profile?.email?.toUpperCase()}</h2>
              <div className="badges">
                <span className="badge">💎 {profile?.diamonds}</span>
                <span className="badge">🔥 {profile?.streak}</span>
                {/* WIDGET TEMPS UTILISATION */}
                <span className="badge">⏱️ {formatTime(secondsSpent)}</span>
              </div>
            </div>
          </div>
          <div className="game-buttons">
            <button className="game-btn math-btn" onClick={() => { setGameMode('quiz'); setCategory('math'); }}>🍩 MATHS</button>
            <button className="game-btn french-btn" onClick={() => { setGameMode('quiz'); setCategory('french'); }}>🍬 FRANÇAIS</button>
            <button className="game-btn english-btn" onClick={() => { setGameMode('quiz'); setCategory('english'); }}>🍦 ENGLISH</button>
            <button className="game-btn world-btn" onClick={() => setGameMode('capitals')}>🌍 CAPITALES</button>
          </div>
        </div>
        {showSettings && (
          <div className="modal" onClick={() => setShowSettings(false)}>
            <div className="modal-content">
              <h3>Avatar</h3>
              <div className="avatar-grid">
                {AVATARS.map(av => <span key={av} onClick={() => setSelectedAvatar(av)}>{av}</span>)}
              </div>
              <button onClick={() => setShowSettings(false)}>OK</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app">
        <div className="quiz-container">
          <button className="back-btn" onClick={() => setGameMode('menu')}>← Retour</button>
          
          {/* BARRE DE PROGRESSION */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ 
              width: `${gameMode === 'quiz' 
                ? (currentQ / QUESTIONS[category][level].length) * 100 
                : (currentCapital / CAPITALS_GAME.length) * 100}%` 
            }}></div>
          </div>

          {gameMode === 'quiz' ? (
            <>
              <h2>{QUESTIONS[category][level][currentQ]?.q}</h2>
              <input className="answer-input" value={answer} onChange={e => setAnswer(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleCheckAnswer()} />
              <button className="btn-primary" onClick={handleCheckAnswer}>VALIDER ✨</button>
            </>
          ) : (
            <>
              <h2>Capitale de : {CAPITALS_GAME[currentCapital].country}</h2>
              <div className="capitals-options">
                {/* On affiche les options, incluant la bonne réponse de l'étape actuelle */}
                {CAPITALS_GAME.slice(0, 4).map(c => (
                  <button key={c.capital} onClick={() => handleCapitalAnswer(c.capital)} className="capital-option">
                    {/* Pour que ça marche, on s'assure que la bonne réponse est dans la liste affichée */}
                    {c.capital}
                  </button>
                ))}
              </div>
            </>
          )}
          {showResult && <div className={`result-overlay ${showResult}`}><h2>{showResult === 'correct' ? 'BRAVO !' : 'OUPS !'}</h2></div>}
        </div>
    </div>
  );
}

export default App;
