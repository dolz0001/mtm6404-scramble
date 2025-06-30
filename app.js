const wordsList = [
  'apple', 'banana', 'orange', 'grape', 'lemon',
  'mango', 'peach', 'plum', 'cherry', 'melon'
];

function shuffle(src) {
  const copy = [...src];
  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }
  return typeof src === 'string' ? copy.join('') : copy;
}

function App() {
  const maxStrikes = 3;
  const maxPasses = 2;

  const [words, setWords] = React.useState(() => {
    const saved = JSON.parse(localStorage.getItem("words"));
    return saved || shuffle(wordsList);
  });

  const [currentWord, setCurrentWord] = React.useState("");
  const [scrambled, setScrambled] = React.useState("");
  const [guess, setGuess] = React.useState("");
  const [points, setPoints] = React.useState(() => Number(localStorage.getItem("points")) || 0);
  const [strikes, setStrikes] = React.useState(() => Number(localStorage.getItem("strikes")) || 0);
  const [passes, setPasses] = React.useState(() => Number(localStorage.getItem("passes")) || maxPasses);
  const [message, setMessage] = React.useState("");
  const [gameOver, setGameOver] = React.useState(false);

  React.useEffect(() => {
    if (!currentWord && words.length > 0) {
      const next = words[0];
      setCurrentWord(next);
      setScrambled(shuffle(next));
    }
    localStorage.setItem("points", points);
    localStorage.setItem("strikes", strikes);
    localStorage.setItem("passes", passes);
    localStorage.setItem("words", JSON.stringify(words));
  }, [currentWord, words, points, strikes, passes]);

  function handleGuess(e) {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord) {
      setPoints(points + 1);
      setMessage("Correct!");
      goToNextWord();
    } else {
      setStrikes(strikes + 1);
      setMessage("Incorrect!");
      if (strikes + 1 >= maxStrikes) {
        setGameOver(true);
      }
    }
    setGuess("");
  }

  function goToNextWord() {
    const remaining = words.slice(1);
    setWords(remaining);
    if (remaining.length === 0) {
      setGameOver(true);
    } else {
      setCurrentWord("");
    }
  }

  function handlePass() {
    if (passes > 0) {
      setPasses(passes - 1);
      goToNextWord();
      setMessage("Passed!");
    } else {
      setMessage("No passes left.");
    }
  }

  function handleRestart() {
    setWords(shuffle(wordsList));
    setPoints(0);
    setStrikes(0);
    setPasses(maxPasses);
    setCurrentWord("");
    setScrambled("");
    setMessage("");
    setGameOver(false);
    localStorage.clear();
  }

  return (
    <div>
      <h1>Scramble Game</h1>
      {gameOver ? (
        <>
          <h2>Game Over</h2>
          <p>Points: {points}</p>
          <p>Strikes: {strikes}</p>
          <button onClick={handleRestart}>Play Again</button>
        </>
      ) : (
        <>
          <h2>Scrambled Word: <strong>{scrambled}</strong></h2>
          <form onSubmit={handleGuess}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              autoFocus
              placeholder="Type your guess"
            />
          </form>
          <button onClick={handlePass}>Pass ({passes})</button>
          <div className="status">
            <p>{message}</p>
            <p>Points: {points} | Strikes: {strikes} / {maxStrikes}</p>
          </div>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
