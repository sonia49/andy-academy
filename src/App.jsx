import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  'https://lcbwehiwjowgthazrydy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYndlaGl3am93Z3RoYXpyeWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTg4NjIsImV4cCI6MjA4NDkzNDg2Mn0.2nP42Uh262Jt-1stolzSVM8_EEzrAdCutKgd7B2MurY'
);

// VRAIES QUESTIONS COMPLÈTES 6ÈME/5ÈME
const QUESTIONS = {
  math: {
    '6ème': [
      { q: "Combien font 15 × 12 ?", r: "180" },
      { q: "Calcule : 456 + 789", r: "1245" },
      { q: "Combien font 144 ÷ 12 ?", r: "12" },
      { q: "Calcule : 25 × 4", r: "100" },
      { q: "Quelle est la moitié de 50 ?", r: "25" },
      { q: "Combien font 1/4 de 100 ?", r: "25" },
      { q: "Calcule : 2.5 + 3.5", r: "6" },
      { q: "Combien de côtés a un hexagone ?", r: "6" },
      { q: "Périmètre d'un carré de côté 5 cm ?", r: "20" },
      { q: "Combien d'angles droits dans un carré ?", r: "4" }
    ],
    '5ème': [
      { q: "Calcule : -5 + 8", r: "3" },
      { q: "Combien font -12 + 7 ?", r: "-5" },
      { q: "Combien font -3 × 4 ?", r: "-12" },
      { q: "Simplifie : 4/8", r: "1/2" },
      { q: "Aire d'un rectangle 5×8 ?", r: "40" },
      { q: "10% de 200 ?", r: "20" },
      { q: "50% de 80 ?", r: "40" },
      { q: "Calcule : 2 + 3 × 4", r: "14" },
      { q: "Calcule : (5 + 3) × 2", r: "16" },
      { q: "Aire d'un carré de côté 6 cm ?", r: "36" }
    ]
  },
  french: {
    '6ème': [
      { q: "Nature du mot 'rapidement'", r: "adverbe" },
      { q: "COD dans : 'Je mange une pomme'", r: "une pomme" },
      { q: "Sujet de : 'Le chat dort'", r: "le chat" },
      { q: "Présent de 'faire' à nous", r: "faisons" },
      { q: "Imparfait de 'avoir' à je", r: "avais" },
      { q: "Futur de 'aller' à tu", r: "iras" },
      { q: "Pluriel de 'cheval'", r: "chevaux" },
      { q: "Féminin de 'acteur'", r: "actrice" },
      { q: "Synonyme de 'joyeux'", r: "heureux" },
      { q: "Contraire de 'grand'", r: "petit" }
    ],
    '5ème': [
      { q: "Conditionnel présent de 'pouvoir' à je", r: "pourrais" },
      { q: "Subjonctif présent de 'être' à il", r: "soit" },
      { q: "Passé simple de 'faire' à il", r: "fit" },
      { q: "Figure : 'Il est fort comme un lion'", r: "comparaison" },
      { q: "Figure : 'La mer est un miroir'", r: "metaphore" },
      { q: "Figure : 'Je meurs de faim'", r: "hyperbole" },
      { q: "Type de verbe : 'sembler'", r: "etat" },
      { q: "Pluriel de 'bijou'", r: "bijoux" },
      { q: "Féminin de 'directeur'", r: "directrice" },
      { q: "Présent de 'venir' à nous", r: "venons" }
    ]
  },
  english: {
    '6ème': [
      { q: "Translate 'chien'", r: "dog" },
      { q: "Translate 'chat'", r: "cat" },
      { q: "Translate 'maison'", r: "house" },
      { q: "Translate 'école'", r: "school" },
      { q: "How do you say '15'?", r: "fifteen" },
      { q: "Translate 'rouge'", r: "red" },
      { q: "Translate 'bleu'", r: "blue" },
      { q: "I (to be) happy", r: "am" },
      { q: "He (to have) a dog", r: "has" },
      { q: "Translate 'famille'", r: "family" }
    ],
    '5ème': [
      { q: "Past simple of 'go'", r: "went" },
      { q: "Past simple of 'eat'", r: "ate" },
      { q: "Past simple of 'see'", r: "saw" },
      { q: "Past simple of 'make'", r: "made" },
      { q: "Present continuous: I (read) a book", r: "am reading" },
      { q: "Present continuous: She (play) tennis", r: "is playing" },
      { q: "Comparative of 'big'", r: "bigger" },
      { q: "Comparative of 'good'", r: "better" },
      { q: "Superlative of 'happy'", r: "happiest" },
      { q: "Past simple of 'take'", r: "took" }
    ]
  }
};

// JEU DES CAPITALES
const CAPITALS_GAME = [
  { country: "France", capital: "Paris", x: 48.8, y: 2.3 },
  { country: "Espagne", capital: "Madrid", x: 40.4, y: -3.7 },
  { country: "Italie", capital: "Rome", x: 41.9, y: 12.5 },
  { country: "Allemagne", capital: "Berlin", x: 52.5, y: 13.4 },
  { country: "Royaume-Uni", capital: "Londres", x: 51.5, y: -0.1 },
  { country: "Portugal", capital: "Lisbonne", x: 38.7, y: -9.1 },
  { country: "Belgique", capital: "Bruxelles", x: 50.8, y: 4.3 },
  { country: "Pays-Bas", capital: "Amsterdam", x: 52.4, y: 4.9 },
  { country: "Suisse", capital: "Berne", x: 46.9, y: 7.4 },
  { country: "Autriche", capital: "Vienne", x: 48.2, y: 16.4 }
];

const AVATARS = ['🧁', '🍰', '🍭', '🍬', '🍩', '🍪', '🧋', '🍦', '🌈', '⭐', '💎', '🦄'];

function App() {
  const [screen, setScreen] = useState('auth');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);

  const [gameMode, setGameMode] = useState('menu'); // menu, quiz, capitals
  const [category, setCategory] = useState('math');
  const [level, setLevel] = useState('6ème');
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  // Jeu capitales
  const [currentCapital, setCurrentCapital] = useState(0);
  const [capitalScore, setCapitalScore] = useState(0);
  const [capitalAnswers, setCapitalAnswers] = useState([]);

  const [selectedAvatar, setSelectedAvatar] = useState('🧁');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('selectedAvatar');
    if (saved) setSelectedAvatar(saved);
  }, []);

  // AUTH
  const handleAuth = async (type) => {
    if (!username || password.length < 6) {
      alert("⚠️ Pseudo et mot de passe (6+ caractères) requis !");
      return;
    }

    const email = username.toLowerCase() + "@candy.app";

    if (type === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert("❌ " + error.message);
        return;
      }
      await supabase.from('profiles').insert([{
        id: data.user.id,
        email: username,
        diamonds: 100,
        level: 1,
        streak: 0
      }]);
      alert("✨ Compte créé ! Connecte-toi maintenant.");
      window.location.reload();
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert("❌ Pseudo ou mot de passe incorrect");
        return;
      }

      let { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      if (!prof) {
        const { data: newProf } = await supabase.from('profiles')
          .insert([{ id: data.user.id, email: username, diamonds: 100, level: 1, streak: 0 }])
          .select()
          .single();
        prof = newProf;
      }
      setProfile(prof);
      setScreen('dashboard');
    }
  };

  // QUIZ
  const handleCheckAnswer = async () => {
    const questions = QUESTIONS[category][level];
    const correct = questions[currentQ].r.toLowerCase().trim();
    const user = answer.toLowerCase().trim();

    const newStats = { ...stats, total: stats.total + 1 };

    if (user === correct || correct.includes(user)) {
      newStats.correct++;
      setShowResult('correct');
      
      if (window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      const updatedProfile = {
        ...profile,
        diamonds: profile.diamonds + 15,
        streak: profile.streak + 1
      };

      await supabase.from('profiles').update({
        diamonds: updatedProfile.diamonds,
        streak: updatedProfile.streak
      }).eq('id', profile.id);

      setProfile(updatedProfile);
      
      setTimeout(() => {
        setShowResult(null);
        setCurrentQ((currentQ + 1) % questions.length);
        setAnswer('');
      }, 2000);
    } else {
      setShowResult('wrong');
      setTimeout(() => {
        setShowResult(null);
      }, 2000);
    }

    setStats(newStats);
  };

  // JEU CAPITALES
  const handleCapitalAnswer = (selectedCapital) => {
    const correct = CAPITALS_GAME[currentCapital].capital;
    const isCorrect = selectedCapital === correct;
    
    setCapitalAnswers([...capitalAnswers, { country: CAPITALS_GAME[currentCapital].country, correct: isCorrect }]);
    
    if (isCorrect) {
      setCapitalScore(capitalScore + 1);
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60 });
      }
    }

    if (currentCapital < CAPITALS_GAME.length - 1) {
      setTimeout(() => setCurrentCapital(currentCapital + 1), 1000);
    } else {
      setTimeout(() => {
        alert(`Terminé ! Score : ${capitalScore + (isCorrect ? 1 : 0)}/${CAPITALS_GAME.length}`);
        setGameMode('menu');
        setCurrentCapital(0);
        setCapitalScore(0);
        setCapitalAnswers([]);
      }, 1500);
    }
  };

  const startCapitalsGame = () => {
    setGameMode('capitals');
    setCurrentCapital(0);
    setCapitalScore(0);
    setCapitalAnswers([]);
  };

  // AUTH SCREEN
  if (screen === 'auth') {
    return (
      <div className="app">
        <div className="auth-container">
          <h1 className="logo">🍭 Candy Academy 🍬</h1>
          <p className="tagline">Apprends en t'amusant !</p>
          
          <input
            type="text"
            placeholder="✨ Ton pseudo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-candy"
          />
          <input
            type="password"
            placeholder="🔐 Mot de passe (6+)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-candy"
            onKeyPress={(e) => e.key === 'Enter' && handleAuth('login')}
          />
          
          <button onClick={() => handleAuth('login')} className="btn-primary">
            SE CONNECTER
          </button>
          <button onClick={() => handleAuth('signup')} className="btn-secondary">
            CRÉER COMPTE
          </button>
        </div>
      </div>
    );
  }

  // MENU PRINCIPAL
  if (gameMode === 'menu') {
    const successRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    
    return (
      <div className="app">
        <div className="settings-icon" onClick={() => setShowSettings(true)}>⚙️</div>
        
        <div className="dashboard">
          <div className="header">
            <div className="avatar-big">{selectedAvatar}</div>
            <div className="user-info">
              <h2>{profile.email.toUpperCase()}</h2>
              <div className="badges">
                <span className="badge">💎 {profile.diamonds}</span>
                <span className="badge">⭐ Niv.{profile.level}</span>
                <span className="badge">🔥 {profile.streak}</span>
              </div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">{successRate}%</div>
              <div className="stat-label">Réussite</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Questions</div>
            </div>
          </div>

          <h3 className="section-title">🎮 Choisis ton jeu</h3>
          
          <div className="game-buttons">
            <button className="game-btn math-btn" onClick={() => { setGameMode('quiz'); setCategory('math'); }}>
              <span className="btn-icon">🍩</span>
              <span className="btn-text">MATHS</span>
            </button>
            
            <button className="game-btn french-btn" onClick={() => { setGameMode('quiz'); setCategory('french'); }}>
              <span className="btn-icon">🍬</span>
              <span className="btn-text">FRANÇAIS</span>
            </button>
            
            <button className="game-btn english-btn" onClick={() => { setGameMode('quiz'); setCategory('english'); }}>
              <span className="btn-icon">🍦</span>
              <span className="btn-text">ENGLISH</span>
            </button>
            
            <button className="game-btn world-btn" onClick={startCapitalsGame}>
              <span className="btn-icon">🌍</span>
              <span className="btn-text">CAPITALES</span>
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="modal" onClick={() => setShowSettings(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>⚙️ Choisis ton avatar</h3>
              <div className="avatar-grid">
                {AVATARS.map(av => (
                  <div
                    key={av}
                    className={`avatar-option ${selectedAvatar === av ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedAvatar(av);
                      localStorage.setItem('selectedAvatar', av);
                    }}
                  >
                    {av}
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={() => setShowSettings(false)}>OK</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // QUIZ MODE
  if (gameMode === 'quiz') {
    const questions = QUESTIONS[category][level];
    const currentQuestion = questions[currentQ];

    return (
      <div className="app">
        <div className="quiz-container">
          <div className="quiz-header">
            <button className="back-btn" onClick={() => setGameMode('menu')}>← Retour</button>
            <div className="quiz-info">
              <span className="category-badge">{category.toUpperCase()}</span>
              <span className="level-badge">{level}</span>
            </div>
          </div>

          <div className="level-selector">
            <button 
              className={`level-btn ${level === '6ème' ? 'active' : ''}`}
              onClick={() => { setLevel('6ème'); setCurrentQ(0); }}
            >
              6ème
            </button>
            <button 
              className={`level-btn ${level === '5ème' ? 'active' : ''}`}
              onClick={() => { setLevel('5ème'); setCurrentQ(0); }}
            >
              5ème
            </button>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${((currentQ + 1) / questions.length) * 100}%`}}></div>
          </div>
          <p className="progress-text">Question {currentQ + 1}/{questions.length}</p>

          <div className="question-box">
            <h2 className="question">{currentQuestion.q}</h2>
            
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCheckAnswer()}
              placeholder="Ta réponse..."
              className="answer-input"
              autoFocus
            />

            <button onClick={handleCheckAnswer} className="btn-primary submit-btn">
              VALIDER ✨
            </button>
          </div>

          {showResult && (
            <div className={`result-overlay ${showResult}`}>
              <div className="result-card">
                {showResult === 'correct' ? (
                  <>
                    <div className="result-emoji">🎉</div>
                    <h2>BRAVO !</h2>
                    <p>C'est la bonne réponse !</p>
                    <p className="reward">+15 💎</p>
                  </>
                ) : (
                  <>
                    <div className="result-emoji">😅</div>
                    <h2>PAS TOUT À FAIT...</h2>
                    <p>La bonne réponse était :</p>
                    <p className="correct-answer">{currentQuestion.r}</p>
                    <p className="encouragement">Réessaie la prochaine !</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // JEU CAPITALES
  if (gameMode === 'capitals') {
    const current = CAPITALS_GAME[currentCapital];
    const options = [...CAPITALS_GAME].sort(() => Math.random() - 0.5).slice(0, 4).map(c => c.capital);
    if (!options.includes(current.capital)) {
      options[Math.floor(Math.random() * 4)] = current.capital;
    }

    return (
      <div className="app">
        <div className="quiz-container">
          <div className="quiz-header">
            <button className="back-btn" onClick={() => setGameMode('menu')}>← Retour</button>
            <div className="quiz-info">
              <span className="category-badge">CAPITALES</span>
              <span className="score-badge">Score: {capitalScore}/{currentCapital}</span>
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${((currentCapital + 1) / CAPITALS_GAME.length) * 100}%`}}></div>
          </div>
          <p className="progress-text">Pays {currentCapital + 1}/{CAPITALS_GAME.length}</p>

          <div className="capitals-game">
            <div className="world-map">🗺️</div>
            <h2 className="capitals-question">Quelle est la capitale de :</h2>
            <h1 className="country-name">{current.country}</h1>

            <div className="capitals-options">
              {options.map((capital, i) => (
                <button
                  key={i}
                  className="capital-option"
                  onClick={() => handleCapitalAnswer(capital)}
                >
                  {capital}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
