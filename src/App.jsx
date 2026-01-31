import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  'https://lcbwehiwjowgthazrydy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYndlaGl3am93Z3RoYXpyeWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTg4NjIsImV4cCI6MjA4NDkzNDg2Mn0.2nP42Uh262Jt-1stolzSVM8_EEzrAdCutKgd7B2MurY'
);

// --- BANQUE D'EXERCICES COMPLÈTE (20 PAR MATIÈRE EN 6ÈME) ---
const QUESTIONS = {
  math: {
    '6ème': [
      { q: "15 × 12 ?", r: "180" }, { q: "456 + 789 ?", r: "1245" }, { q: "144 ÷ 12 ?", r: "12" }, { q: "25 × 4 ?", r: "100" }, { q: "Moitié de 50 ?", r: "25" },
      { q: "1/4 de 100 ?", r: "25" }, { q: "2.5 + 3.5 ?", r: "6" }, { q: "Côtés d'un hexagone ?", r: "6" }, { q: "Périmètre carré côté 5cm ?", r: "20" }, { q: "Angles droits carré ?", r: "4" },
      { q: "1000 - 1 ?", r: "999" }, { q: "Double de 15 ?", r: "30" }, { q: "0.5 × 10 ?", r: "5" }, { q: "Côtés d'un triangle ?", r: "3" }, { q: "100 ÷ 4 ?", r: "25" },
      { q: "9 × 8 ?", r: "72" }, { q: "7 × 7 ?", r: "49" }, { q: "Rayon si diamètre = 10 ?", r: "5" }, { q: "3 × 3 × 3 ?", r: "27" }, { q: "150 + 150 ?", r: "300" }
    ],
    '5ème': [{ q: "-5 + 8 ?", r: "3" }, { q: "10% de 200 ?", r: "20" }, { q: "Aire rectangle 5x8 ?", r: "40" }]
  },
  french: {
    '6ème': [
      { q: "Nature de 'vite' ?", r: "adverbe" }, { q: "COD : 'Il lit un livre'", r: "un livre" }, { q: "Sujet : 'La pluie tombe'", r: "la pluie" }, { q: "Présent 'faire' (nous) ?", r: "faisons" }, { q: "Imparfait 'avoir' (je) ?", r: "avais" },
      { q: "Futur 'aller' (tu) ?", r: "iras" }, { q: "Pluriel de 'journal' ?", r: "journaux" }, { q: "Féminin de 'boulanger' ?", r: "boulangère" }, { q: "Synonyme de 'triste' ?", r: "malheureux" }, { q: "Contraire de 'chaud' ?", r: "froid" },
      { q: "Infinitif de 'dormons' ?", r: "dormir" }, { q: "Type : 'Viens ici !'", r: "imperative" }, { q: "Féminin de 'canard' ?", r: "cane" }, { q: "Syllabes dans 'école' ?", r: "3" }, { q: "Pluriel de 'nez' ?", r: "nez" },
      { q: "Contraire de 'petit' ?", r: "grand" }, { q: "Sujet de 'Je pars' ?", r: "je" }, { q: "Nature de 'belle' ?", r: "adjectif" }, { q: "Verbe : 'Il court' ?", r: "court" }, { q: "Synonyme de 'maison' ?", r: "habitation" }
    ],
    '5ème': [{ q: "Passé simple de 'faire' (il) ?", r: "fit" }, { q: "Figure : 'Fort comme un lion'", r: "comparaison" }]
  },
  english: {
    '6ème': [
      { q: "Apple ?", r: "pomme" }, { q: "Dog ?", r: "chien" }, { q: "Yellow ?", r: "jaune" }, { q: "School ?", r: "école" }, { q: "Brother ?", r: "frère" },
      { q: "Thirteen ?", r: "13" }, { q: "Water ?", r: "eau" }, { q: "Sun ?", r: "soleil" }, { q: "Green ?", r: "vert" }, { q: "To be (I) ?", r: "am" },
      { q: "To have (He) ?", r: "has" }, { q: "Friend ?", r: "ami" }, { q: "Good morning ?", r: "bonjour" }, { q: "Red ?", r: "rouge" }, { q: "Thank you ?", r: "merci" },
      { q: "Cat ?", r: "chat" }, { q: "House ?", r: "maison" }, { q: "Book ?", r: "livre" }, { q: "Sister ?", r: "soeur" }, { q: "Blue ?", r: "bleu" }
    ],
    '5ème': [{ q: "Past simple of 'go' ?", r: "went" }, { q: "Comparative of 'big' ?", r: "bigger" }]
  }
};

const CAPITALS_GAME = [
  { country: "France", capital: "Paris" }, { country: "Espagne", capital: "Madrid" }, { country: "Italie", capital: "Rome" },
  { country: "Allemagne", capital: "Berlin" }, { country: "Royaume-Uni", capital: "Londres" }, { country: "Belgique", capital: "Bruxelles" }
];

const AVATARS = ['🧁', '🍰', '🍭', '🍬', '🍩', '🍪', '🧋', '🍦', '🌈', '⭐', '💎', '🦄'];

function App() {
  const [screen, setScreen] = useState('auth');
  const [loading, setLoading] = useState(true); // Ajout d'un état chargement
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);

  const [gameMode, setGameMode] = useState('menu');
  const [category, setCategory] = useState('math');
  const [level, setLevel] = useState('6ème');
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const [currentCapital, setCurrentCapital] = useState(0);
  const [capitalScore, setCapitalScore] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('selectedAvatar') || '🧁');
  const [showSettings, setShowSettings] = useState(false);

  // --- RÉCUPÉRATION AUTO DU PROFIL (Correctif Page Blanche) ---
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      let { data: prof, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (prof) {
        setProfile(prof);
        setScreen('dashboard');
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // --- AUTHENTIFICATION ---
  const handleAuth = async (type) => {
    if (!username || password.length < 6) return alert("Identifiants invalides !");
    setLoading(true);
    const email = `${username.toLowerCase().trim()}@candy.app`;

    const { data, error } = type === 'signup' 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Erreur : " + error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      if (type === 'signup') {
        await supabase.from('profiles').insert([{ id: data.user.id, email: username, diamonds: 100, level: 1, streak: 0 }]);
        alert("Compte créé ! Connecte-toi.");
        setLoading(false);
      } else {
        fetchProfile(data.user.id);
      }
    }
  };

  // --- LOGIQUE DU QUIZ ---
  const handleCheckAnswer = async () => {
    const questions = QUESTIONS[category][level];
    const correct = questions[currentQ].r.toLowerCase().trim();
    if (answer.toLowerCase().trim() === correct) {
      setShowResult('correct');
      const upProf = { ...profile, diamonds: profile.diamonds + 15, streak: profile.streak + 1 };
      await supabase.from('profiles').update({ diamonds: upProf.diamonds, streak: upProf.streak }).eq('id', profile.id);
      setProfile(upProf);
      setStats(s => ({ ...s, correct: s.correct + 1, total: s.total + 1 }));
      setTimeout(() => { setShowResult(null); setCurrentQ((currentQ + 1) % questions.length); setAnswer(''); }, 2000);
    } else {
      setShowResult('wrong');
      setStats(s => ({ ...s, total: s.total + 1 }));
      setTimeout(() => setShowResult(null), 2000);
    }
  };

  // --- RENDU ---
  if (loading) return <div className="app"><div className="loader">Chargement de ton univers... 🍬</div></div>;

  if (screen === 'auth') {
    return (
      <div className="app">
        <div className="auth-container">
          <h1 className="logo">🍭 Candy Academy 🍬</h1>
          <input className="input-candy" placeholder="✨ Pseudo" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="input-candy" type="password" placeholder="🔐 Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={() => handleAuth('login')} className="btn-primary">SE CONNECTER</button>
          <button onClick={() => handleAuth('signup')} className="btn-secondary">CRÉER COMPTE</button>
        </div>
      </div>
    );
  }

  if (gameMode === 'menu') {
    const successRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
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
              </div>
            </div>
          </div>
          <div className="stats-row">
            <div className="stat-card">🎯 {successRate}% <br/>Réussite</div>
            <div className="stat-card">📚 {stats.total} <br/>Questions</div>
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
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="avatar-grid">
                {AVATARS.map(av => <div key={av} className="avatar-option" onClick={() => {setSelectedAvatar(av); localStorage.setItem('selectedAvatar', av);}}>{av}</div>)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // (Le reste de tes modes quiz et capitals reste identique à ta structure...)
  return (
    <div className="app">
      <div className="quiz-container">
         <button className="back-btn" onClick={() => setGameMode('menu')}>← Retour</button>
         <h2>{gameMode === 'quiz' ? QUESTIONS[category][level][currentQ].q : `Capitale de : ${CAPITALS_GAME[currentCapital].country}`}</h2>
         <input className="answer-input" value={answer} onChange={e => setAnswer(e.target.value)} />
         <button className="btn-primary" onClick={handleCheckAnswer}>VALIDER</button>
         {showResult && <div className={`result-overlay ${showResult}`}><h2>{showResult === 'correct' ? 'BRAVO !' : 'OUPS !'}</h2></div>}
      </div>
    </div>
  );
}

export default App;
