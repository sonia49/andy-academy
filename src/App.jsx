import React, { useState } from 'react';
import './App.css';

// --- QUESTIONS 6EME ---
const QUESTIONS = {
  math: [{ q: "15 × 12 ?", a: "180", type: "🗼 Tour" }, { q: "1/4 de 100 ?", a: "25", type: "🗼 Tour" }, { q: "2.5 + 3.5 ?", a: "6", type: "🗼 Tour" }],
  french: [{ q: "Pluriel 'cheval' ?", a: "chevaux", type: "🏠 Maison" }, { q: "Féminin 'acteur' ?", a: "actrice", type: "🏠 Maison" }],
  english: [{ q: "Chien ?", a: "dog", type: "🏪 Shop" }, { q: "Chat ?", a: "cat", type: "🏪 Shop" }]
};

function App() {
  const [screen, setScreen] = useState('auth');
  const [username, setUsername] = useState('');
  const [diamonds, setDiamonds] = useState(100);
  const [currentCat, setCurrentCat] = useState('math');
  const [qIdx, setQIdx] = useState(0);
  const [ans, setAns] = useState('');
  
  // --- ÉTATS DE LA VILLE ---
  const [city, setCity] = useState([]); // Stocke les bâtiments construits
  const [isMelting, setIsMelting] = useState(false); // Effet gélatine

  const buildCity = () => {
    const q = QUESTIONS[currentCat][qIdx];
    if (ans.toLowerCase().trim() === q.a.toLowerCase()) {
      // RÉUSSITE : On construit !
      const newBuilding = {
        id: Date.now(),
        type: q.type,
        emoji: q.type === "🗼 Tour" ? "🏰" : q.type === "🏠 Maison" ? "🏡" : "🏪",
        x: Math.random() * 80, // Position aléatoire dans la ville
        y: Math.random() * 60 
      };
      setCity([...city, newBuilding]);
      setDiamonds(d => d + 20);
      setQIdx(i => (i + 1) % QUESTIONS[currentCat].length);
      setAns('');
      if (window.confetti) window.confetti({ particleCount: 100, spread: 70, colors: ['#FF6B9D', '#FFD4B8'] });
    } else {
      // ERREUR : Effet Gélatine
      setIsMelting(true);
      setTimeout(() => setIsMelting(false), 1000);
    }
  };

  return (
    <div className={`app candy-theme ${isMelting ? 'melting-anim' : ''}`}>
      
      {screen === 'auth' && (
        <div className="container"><div className="glass-card auth-card">
          <h1 className="logo">CANDY BUILDER</h1>
          <input className="input-premium" placeholder="Ton Pseudo..." onChange={e => setUsername(e.target.value)} />
          <button className="btn-premium" onClick={() => setScreen('dashboard')}>COMMENCER MA VILLE 🍭</button>
        </div></div>
      )}

      {screen === 'dashboard' && (
        <div className="container dashboard-layout">
          {/* HEADER STATS */}
          <div className="glass-card header-card">
            <h2>Maire {username} 💎 {diamonds}</h2>
            <p>Bâtiments : {city.length}</p>
          </div>

          {/* ZONE DE CONSTRUCTION (LA VILLE) */}
          <div className="city-map glass-card">
            <div className="map-overlay">TA VILLE SUCRÉE</div>
            {city.map(b => (
              <div key={b.id} className="building animate-pop" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
                {b.emoji}
                <span className="b-label">{b.type}</span>
              </div>
            ))}
            {isMelting && <div className="gelatinous-blob">🫠 OH NON ! ÇA FOND !</div>}
          </div>

          {/* ZONE D'EXERCICES */}
          <div className="glass-card build-controls">
            <div className="cat-selector">
              {['math', 'french', 'english'].map(c => (
                <button key={c} className={`btn-mini ${currentCat === c ? 'active' : ''}`} onClick={() => {setCurrentCat(c); setQIdx(0);}}>
                  {c.toUpperCase()}
                </button>
              ))}
            </div>
            <h3 className="question-text">{QUESTIONS[currentCat][qIdx].q}</h3>
            <div className="input-group">
              <input className="input-premium" value={ans} onChange={e => setAns(e.target.value)} placeholder="Réponse..." />
              <button className="btn-premium" onClick={buildCity}>BÂTIR 🔨</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .city-map { height: 300px; position: relative; background: #FFF0F5; border: 3px dashed #FF6B9D; overflow: hidden; margin: 15px 0; border-radius: 20px; }
        .map-overlay { position: absolute; top: 10px; left: 10px; font-weight: bold; color: rgba(255,107,157,0.3); font-size: 1.2rem; }
        .building { position: absolute; font-size: 2.5rem; display: flex; flex-direction: column; align-items: center; transition: all 0.5s ease; cursor: pointer; }
        .b-label { font-size: 0.6rem; background: white; padding: 2px 5px; border-radius: 5px; color: #FF6B9D; font-weight: bold; }
        
        .melting-anim { animation: melt 0.5s infinite; }
        @keyframes melt { 0% { transform: scale(1); } 50% { transform: scale(1.02) skewX(2deg); filter: blur(1px); } 100% { transform: scale(1); } }
        
        .gelatinous-blob { position: absolute; inset: 0; background: rgba(255, 182, 193, 0.6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.5rem; backdrop-filter: blur(4px); z-index: 10; }
        .cat-selector { display: flex; justify-content: space-around; margin-bottom: 10px; }
        .btn-mini { border: none; background: #eee; padding: 5px 10px; border-radius: 10px; font-size: 0.7rem; cursor: pointer; }
        .btn-mini.active { background: #FF6B9D; color: white; }
        .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes pop { 0% { transform: scale(0); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
}

export default App;
