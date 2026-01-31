import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  'https://lcbwehiwjowgthazrydy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYndlaGl3am93Z3RoYXpyeWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTg4NjIsImV4cCI6MjA4NDkzNDg2Mn0.2nP42Uh262Jt-1stolzSVM8_EEzrAdCutKgd7B2MurY'
);

// --- TES 60 EXERCICES ---
const QUESTIONS = {
  math: { '6ème': Array(20).fill({ q: "15 × 12 ?", r: "180" }).map((ex, i) => i === 0 ? ex : { q: `Calcul n°${i+1} : ${10+i} + ${5+i}`, r: `${15+(2*i)}` }) },
  french: { '6ème': Array(20).fill({ q: "Nature de 'vite' ?", r: "adverbe" }) },
  english: { '6ème': Array(20).fill({ q: "Dog ?", r: "chien" }) }
};
// Note: J'ai raccourci l'affichage ici pour la clarté, mais garde bien tes listes complètes dans ton fichier.

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gameMode, setGameMode] = useState('menu');
  const [category, setCategory] = useState('math');
  const [level, setLevel] = useState('6ème');
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('avatar') || '🧁');

  // --- LE RADAR DE SESSION (LE SECRET) ---
  useEffect(() => {
    // 1. On vérifie la session actuelle au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // 2. On écoute les changements (Connexion / Déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Changement d'état Auth:", _event);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    console.log("Récupération du profil pour:", userId);
    try {
      let { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      
      if (error && error.code === 'PGRST116') { // Profil inexistant
        console.log("Création d'un nouveau profil...");
        const { data: newProf } = await supabase.from('profiles').insert([
          { id: userId, email: username || 'Élève', diamonds: 100, level: 1, streak: 0 }
        ]).select().single();
        setProfile(newProf);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Erreur fetchProfile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (type) => {
    setLoading(true);
    const email = `${username.toLowerCase().trim()}@candy.app`;
    
    const { error } = type === 'signup' 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Erreur: " + error.message);
      setLoading(false);
    }
    // Pas besoin de setProfile ici, le "onAuthStateChange" s'en occupe !
  };

  // --- RENDU CONDITIONNEL ---
  if (loading) return <div className="app"><h1>Chargement magique... ✨</h1></div>;

  // SI PAS DE PROFIL -> ÉCRAN AUTH (TON VISUEL)
  if (!profile) {
    return (
      <div className="app">
        <div className="auth-container">
          <h1 className="logo">🍭 Candy Academy 🍬</h1>
          <input className="input-candy" placeholder="Pseudo" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="input-candy" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={() => handleAuth('login')} className="btn-primary">SE CONNECTER</button>
          <button onClick={() => handleAuth('signup')} className="btn-secondary">CRÉER COMPTE</button>
        </div>
      </div>
    );
  }

  // SI PROFIL EXISTE -> TON DASHBOARD VISUEL
  return (
    <div className="app">
      {gameMode === 'menu' ? (
        <div className="dashboard">
          <div className="header">
            <div className="avatar-big">{selectedAvatar}</div>
            <div className="user-info">
              <h2>{profile.email?.toUpperCase()}</h2>
              <div className="badges">
                <span className="badge">💎 {profile.diamonds}</span>
                <span className="badge">🔥 {profile.streak}</span>
              </div>
            </div>
            <button onClick={() => supabase.auth.signOut()} className="logout-mini">🚪</button>
          </div>
          
          <div className="game-buttons">
            <button className="game-btn math-btn" onClick={() => { setGameMode('quiz'); setCategory('math'); }}>🍩 MATHS</button>
            <button className="game-btn french-btn" onClick={() => { setGameMode('quiz'); setCategory('french'); }}>🍬 FRANÇAIS</button>
            <button className="game-btn english-btn" onClick={() => { setGameMode('quiz'); setCategory('english'); }}>🍦 ENGLISH</button>
          </div>
        </div>
      ) : (
        <div className="quiz-container">
          <button onClick={() => setGameMode('menu')}>← Retour</button>
          <h2>{QUESTIONS[category][level][currentQ].q}</h2>
          <input className="answer-input" value={answer} onChange={e => setAnswer(e.target.value)} autoFocus />
          <button className="btn-primary" onClick={() => {/* Logique check ici */}}>VALIDER</button>
        </div>
      )}
    </div>
  );
}

export default App;
