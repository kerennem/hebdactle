import logo from "./logo.svg";
import "./App.css";
import getArticte from "./api";
import { useState, useEffect } from "react";

const commonWords = [
  "את",
  "של",
  "גם",
  "כמו",
  "עד",
  "עם",
  "על",
  "כל",
  "כדי",
  "br",
];

const prefixes = ["ש", "מ", "ל", "כ", "ו", "ה", "ב"];

const redactWordsArr = (wordsArr, visibleWords) => {
  return wordsArr.map((word) => {
    if (word === "br") {
      return `<br/>`;
    }
    if (visibleWords.includes(word)) {
      return `<span>${word}</span>`;
    }
    return `<span style="background-color: #bdbbbb" >${word.replaceAll(
      /./g,
      "&nbsp;" + "&nbsp;"
    )}</span>`;
  });
};

function App() {
  const [guessList, setGuessList] = useState([]);
  const [guessInput, setGuessInput] = useState("");
  const [visibleWords, setVisibleWords] = useState(commonWords);

  const [titleHits, setTitleHits] = useState([]);
  const [title, setTitle] = useState("");
  const [wordsArr, setWordsArr] = useState([]);

  const modifiedWordsArr = redactWordsArr(wordsArr, visibleWords);

  useEffect(() => {
    (async () => {
      const { title: articleTitle, text } = await getArticte();
      setTitle(articleTitle.replace("_", " "));
      const modified_text = text.replaceAll("\n", "<br/>");
      setWordsArr(modified_text.split(/[ .:;?!~,`"&|()=<>{}\[\]\r\n/\\]+/));
    })();
  }, []);

  useEffect(() => {
    if (titleHits.length === title.split(" ").length * (prefixes.length + 1)) {
      setVisibleWords(wordsArr);
    }
  }, [titleHits]);

  const guessHandler = (event) => {
    if (event.key === "Enter") {
      const curGuess = event.target.value;
      const curGuessWithPrefix = prefixes.map((prefix) => prefix + curGuess);
      if (title.includes(curGuess)) {
        setTitleHits([...titleHits, curGuess, ...curGuessWithPrefix]);
      }
      if (!guessList.includes(curGuess)) {
        setGuessList([...guessList, curGuess]);
        setVisibleWords([...visibleWords, curGuess, ...curGuessWithPrefix]);
      }

      setGuessInput("");
    }
  };

  const onGuessInputChange = (event) => {
    setGuessInput(event.target.value.trim());
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <h1
          dangerouslySetInnerHTML={{
            __html: redactWordsArr(title.split(" "), titleHits).join(" "),
          }}
        ></h1>
        <div
          dangerouslySetInnerHTML={{ __html: modifiedWordsArr.join(" ") }}
          style={{ lineHeight: "25px", padding: "8px" }}
        />
      </div>
      <div
        style={{
          minWidth: "400px",
          backgroundColor: "#bdbbbb",
          padding: "8px",
        }}
      >
        <div> אצא לי השוקה תרנגולאי קטן אקנה לי</div>
        <input
          value={guessInput}
          onChange={onGuessInputChange}
          style={{ width: "384px", padding: "4px" }}
          onKeyPress={guessHandler}
        ></input>
        <div>
          {guessList.map((guess) => (
            <div>
              {guess}{" "}
              {
                wordsArr.filter((word) => {
                  const currGuessWithPrefixArr = prefixes.map(
                    (prefix) => prefix + guess
                  );
                  return [...currGuessWithPrefixArr, guess].includes(word);
                }).length
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
