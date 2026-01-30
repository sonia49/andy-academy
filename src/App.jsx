import React, { useState } from 'react';
import './App.css';

// --- TES 60 EXERCICES (20 MATHS, 20 FR, 20 EN) ---
const QUESTIONS_6EME = {
  math: [
    { q: "15 × 12 ?", a: "180" }, { q: "1/4 de 100 ?", a: "25" }, { q: "456 + 789 ?", a: "1245" },
    { q: "144 ÷ 12 ?", a: "12" }, { q: "25 × 4 ?", a: "100" }, { q: "1000 - 347 ?", a: "653" },
    { q: "Côtés d'un hexagone ?", a: "6" }, { q: "2.5 + 3.5 ?", a: "6" }, { q: "Moitié de 50 ?", a: "25" },
    { q: "Angles droits d'un carré ?", a: "4" }, { q: "10.5 - 4.2 ?", a: "6.3" }, { q: "0.5 × 10 ?", a: "5" },
    { q: "Périmètre carré côté 5 ?", a: "20" }, { q: "3/4 de 80 ?", a: "60" }, { q: "9 × 9 ?", a: "81" },
    { q: "Triple de 15 ?", a: "45" }, { q: "1/2 + 1/2 ?", a: "1" }, { q: "Minutes dans 2h ?", a: "120" },
    { q: "10% de 500 ?", a: "50" }, { q: "Somme angles triangle ?", a: "180" }
  ],
  french: [
    { q: "Pluriel de 'cheval' ?", a: "chevaux" }, { q: "Féminin de 'acteur' ?", a: "actrice" }, { q: "Contraire de 'grand' ?", a: "petit" },
    { q: "Synonyme de 'joyeux' ?", a: "heureux" }, { q: "Verbe : 'Le chat dort' ?", a: "dort" }, { q: "Sujet : 'Léa mange' ?", a: "léa" },
    { q: "Nature de 'rapidement' ?", a: "adverbe" }, { q: "Pluriel de 'bateau' ?", a: "bateaux" }, { q: "Passé de 'être' (il) ?", a: "était" },
    { q: "Futur de 'aller' (tu) ?", a: "iras" }, { q: "COD : 'Je vois l'oiseau' ?", a: "l'oiseau" }, { q: "Type de 'Stop !' ?", a: "impérative" },
    { q: "Homonyme de 'mer' ?", a: "mère" }, { q: "Verbe 'faire' (nous) ?", a: "faisons" }, { q: "Pluriel de 'hibou' ?", a: "hiboux" },
    { q: "Genre de 'table' ?", a: "féminin" }, { q: "Adjectif : 'La rose rouge' ?", a: "rouge" }, { q: "Verbe 'avoir' (ils) ?", a: "ont" },
    { q: "Orthographe : 'des (sac)' ?", a: "sacs" }, { q: "Le petit de la vache ?", a: "veau" }
  ],
  english: [
    { q: "Chien ?", a: "dog" }, { q: "Chat ?", a: "cat" }, { q: "Rouge ?", a: "red" }, { q: "Pomme ?", a: "apple" },
    { q: "Bonjour (matin) ?", a: "good morning" }, { q: "15 ?", a: "fifteen" }, { q: "20 ?", a: "twenty" },
    { q: "Bleu ?", a: "blue" }, { q: "Maison ?", a: "house" }, { q: "École ?", a: "school" },
    { q: "Vert ?", a: "green" }, { q: "Jaune ?", a: "yellow" }, { q: "Livre ?", a: "book" },
    { q: "Père ?", a: "father" }, { q: "Mère ?", a: "mother" }, { q: "Soleil ?", a: "sun" },
    { q: "Eau ?", a: "water" }, { q: "Merci ?", a: "thank you" }, { q: "Frère ?", a: "brother" }, { q: "Sœur ?", a: "sister" }
  ]
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [diamonds, setDiamonds] = useState(100);
  const [currentCat, setCurrentCat] = useState('math');
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) setIsLoggedIn(true);
  };

  const checkAnswer = () => {
    const correct = QUESTIONS_6EME[currentCat][qIdx].a.toLowerCase();
    if (answer.toLowerCase().trim() === correct) {
      setDiamonds(d => d + 20);
      setQIdx(prev => (prev + 1) % 20);
      setAnswer('');
      alert("BRAVO ! +20 💎");
    } else {
      alert("ERREUR ❌ Réessaie !");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="app candy-theme auth-screen">
        <div className="glass-card auth-card">
          <h1 className="logo">CANDY ACADEMY</h1>
          <form onSubmit={handleLogin}>
            <input className="input-premium" placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} />
            <input className="input-premium" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="btn-premium">SE CONNECTER</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app candy-theme">
      <div className="container">
        <div className="glass-card header-card">
          <h2>Salut {username} ! 🍭</h2>
          <div className="stat-badge">💎 {diamonds} Diamants</div>
        </div>

        <div className="categories" style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
          <button className={`cat-btn ${currentCat === 'math' ? 'active' : ''}`} onClick={() => {setCurrentCat('math'); setQIdx(0);}}>MATHS</button>
          <button className={`cat-btn ${currentCat === 'french' ? 'active' : ''}`} onClick={() => {setCurrentCat('french'); setQIdx(0);}}>FRANÇAIS</button>
          <button className={`cat-btn ${currentCat === 'english' ? 'active' : ''}`} onClick={() => {setCurrentCat('english'); setQIdx(0);}}>ANGLAIS</button>
        </div>

        <div className="glass-card question-card">
          <h3 className="question-title">{QUESTIONS_6EME[currentCat][qIdx].q}</h3>
          <input className="input-premium" placeholder="Ta réponse..." value={answer} onChange={e => setAnswer(e.target.value)} />
          <button className="btn-premium" onClick={checkAnswer}>VALIDER ✅</button>
        </div>
      </div>
    </div>
  );
}

export default App;
