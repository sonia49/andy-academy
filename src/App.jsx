import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

// --- CONFIGURATION DU JEU ---
const ROWS = 15;
const COLS = 10;
const COLORS = ['#FF6B9D', '#C8A2E8', '#C1F7DC', '#A5E7FF', '#FFD4B8', '#FFB347', '#4ECDC4'];
const TETROMINOS = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  L: [[1, 0], [1, 0], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0]]
};

function App() {
  const [screen, setScreen] = useState('auth');
  const [username, setUsername] = useState('');
  const [diamonds, setDiamonds] = useState(100);
  const [board, setBoard] = useState(Array(ROWS).fill().map(() => Array(COLS).fill(0)));
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [piece, setPiece] = useState(TETROMINOS.T);
  const [color, setColor] = useState(COLORS[0]);
  const [gameOver, setGameOver] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);

  // --- LOGIQUE DU TETRIS ---
  const spawnPiece = useCallback(() => {
    const keys = Object.keys(TETROMINOS);
    const shape = TETROMINOS[keys[Math.floor(Math.random() * keys.length)]];
    setPiece(shape);
    setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setPos({ x: Math.floor(COLS / 2) - 1, y: 0 });
  }, []);

  const collide = (newPos, newPiece = piece) => {
    for (let y = 0; y < newPiece.length; y++) {
      for (let x = 0; x < newPiece[y].length; x++) {
        if (newPiece[y][x] !== 0) {
          if (!board[y + newPos.y] || board[y + newPos.y][x + newPos.x] !== 0) return true;
        }
      }
    }
    return false;
  };

  const rotate = () => {
    const rotated = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
    if (!collide(pos, rotated)) setPiece(rotated);
  };

  const move = (dir) => {
    if (!collide({ x: pos.x + dir, y: pos.y })) setPos(prev => ({ ...prev, x: prev.x + dir }));
  };

  const drop = useCallback(() => {
    if (!collide({ x: pos.x, y: pos.y + 1 })) {
      setPos(prev => ({ ...prev, y: prev.y + 1 }));
    } else {
      // Bloquer la pièce
      const newBoard = [...board.map(row => [...row])];
      piece.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) newBoard[y + pos.y][x + pos.x] = color;
        });
      });

      // BOOM ! Check des lignes
      let linesCleared = 0;
      const finalBoard = newBoard.reduce((acc, row) => {
        if (row.every(cell => cell !== 0)) {
          linesCleared++;
          acc.unshift(Array(COLS).fill(0));
          if (window.confetti) window.confetti({ particleCount: 50, spread: 60, colors: [color] });
          return acc;
        }
        acc.push(row);
        return acc;
      }, []);

      if (linesCleared > 0) setDiamonds(d => d + (linesCleared * 50));
      setBoard(finalBoard);
      if (pos.y === 0) setGameOver(true);
      else spawnPiece();
    }
  }, [board, color, piece, pos, spawnPiece]);

  useEffect(() => {
    if (screen === 'tetris' && !gameOver) {
      const interval = setInterval(drop, 800);
      return () => clearInterval(interval);
    }
  }, [screen, gameOver, drop]);

  // --- CONTROLES TACTILES ---
  const touchStart = useRef(0);
  const onTouchStart = (e) => touchStart.current = e.touches[0].clientX;
  const onTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(deltaX) < 10) rotate();
    else if (deltaX > 30) move(1);
    else if (deltaX < -30) move(-1);
  };

  return (
    <div className="app candy-theme">
      {screen === 'auth' && (
        <div className="glass-card auth-card">
          <h1 className="logo">CANDY ACADEMY</h1>
          <input className="input-premium" placeholder="Pseudo..." onChange={e => setUsername(e.target.value)} />
          <button className="btn-premium" onClick={() => setScreen('dashboard')}>ENTRER 💎</button>
        </div>
      )}

      {screen === 'dashboard' && (
        <div className="container">
          <div className="glass-card header-card">
            <h2>Salut {username} ! 🍭</h2>
            <div className="stat-badge">💎 {diamonds}</div>
            <button className="btn-premium" onClick={() => { setScreen('tetris'); spawnPiece(); }}>JOUER AU TETRIS 🎮</button>
          </div>
        </div>
      )}

      {screen === 'tetris' && (
        <div className="tetris-layout" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="tetris-board">
            {board.map((row, y) => (
              <div key={y} className="t-row">
                {row.map((cell, x) => {
                  let active = false;
                  if (y >= pos.y && y < pos.y + piece.length && x >= pos.x && x < pos.x + piece[0].length) {
                    if (piece[y - pos.y][x - pos.x]) active = true;
                  }
                  return (
                    <div 
                      key={x} 
                      className="t-cell" 
                      style={{ backgroundColor: active ? color : (cell || 'rgba(255,255,255,0.1)') }} 
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="controls-hint">
            Tap: Tourner | Glisse: Bouger | 💎 {diamonds}
            <button onClick={() => setScreen('dashboard')} className="btn-mini">Quitter</button>
          </div>
        </div>
      )}

      <style>{`
        .tetris-layout { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #222; overflow: hidden; }
        .tetris-board { border: 4px solid #FF6B9D; background: #000; display: inline-block; }
        .t-row { display: flex; }
        .t-cell { width: 30px; height: 30px; border: 1px solid #333; box-sizing: border-box; }
        .controls-hint { color: white; padding: 20px; text-align: center; font-weight: bold; }
        .btn-mini { margin-left: 10px; padding: 5px 10px; border-radius: 10px; background: #FF6B9D; color: white; border: none; }
      `}</style>
    </div>
  );
}

export default App;
