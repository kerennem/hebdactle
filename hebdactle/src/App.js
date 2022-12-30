import "./App.css";
import getArticte from "./api";
import { useState, useEffect } from "react";
import { flatten, isEmpty, trim } from "lodash";
import _ from "lodash";

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
  ",",
  ".",
  " ",
  ":",
  ";",
  "?",
  "!",
  "(",
  ")",
  '"',
  "}",
  "{",
  "]",
  "[",
  ">",
  "<",
  "-",
  "+",
  "=",
];

const prefixes = ["ש", "מ", "ל", "כ", "ו", "ה", "ב", ""];

const redactWordsArr = (wordsArr, visibleWords) => {
  let h3IsOpen = false;
  let h4IsOpen = false;
  return wordsArr.map((word) => {
    console.log(word.slice(0, 4));
    if (word === "newlinenewline") {
      return `<br/>`;
    }

    // if (word === " ") {
    //   return "&nbsp;";
    // }

    if (word === "==") {
      h3IsOpen = !h3IsOpen;
      if (h3IsOpen) {
        return "<h3>";
      } else {
        return "</h3>";
      }
    }
    if (word === "===") {
      h4IsOpen = !h4IsOpen;
      if (h4IsOpen) {
        return "<h4>";
      } else {
        return "</h4>";
      }
    }

    if (visibleWords.includes(word)) {
      return `<span>${word}</span>`;
    }
    return `<span style="background-color: #bdbbbb" >${word.replaceAll(
      /./g,
      "&nbsp;&nbsp;"
    )}</span>`;
  });
};

const pluralize = (word) => {
  let wordForPlural = word;
  if (word.slice(-1) === "ה") {
    wordForPlural = word.slice(0, word.length - 1);
  }
  if (word.slice(-1) === "ן") {
    wordForPlural = word.slice(0, word.length - 1) + "נ";
  }
  if (word.slice(-1) === "ם") {
    wordForPlural = word.slice(0, word.length - 1) + "מ";
  }
  if (word.slice(-1) === "ך") {
    wordForPlural = word.slice(0, word.length - 1) + "כ";
  }
  if (word.slice(-1) === "ף") {
    wordForPlural = word.slice(0, word.length - 1) + "פ";
  }
  if (word.slice(-1) === "ץ") {
    wordForPlural = word.slice(0, word.length - 1) + "צ";
  }
  const pluralPossibleVersionsArr = [
    word,
    wordForPlural + "ות",
    wordForPlural + "ים",
  ];
  if (word.slice(-1) === "ה") {
    pluralPossibleVersionsArr.push(word.slice(0, word.length - 1) + "אות");
  }
  return pluralPossibleVersionsArr;
};

const createAllWordVersions = (word) => {
  const wordVersionsArr = flatten(
    prefixes.map((prefix) =>
      pluralize(word).map((pluralOfGuess) => prefix + pluralOfGuess)
    )
  );
  return wordVersionsArr;
};

// const buildVisibleWordsArrByGuessList = (guessList) => {
//   const visibleWords = guessList.reduce((acc, currGuess) => {
//     return [...acc, createAllWordVersions(currGuess)];
//   }, commonWords);
//   return visibleWords;
// };

const buildVisibleWordsArrByGuessList = (guessList) => {
  const visibleWords = commonWords.concat(
    guessList.map((curGuess) => createAllWordVersions(curGuess)).flat()
  );
  return visibleWords;
};

const buildTitleHitsArrByGuessList = (guessList, title) => {
  const guessListAllVersions = guessList
    .map((curGuess) => createAllWordVersions(curGuess))
    .flat();
  const titleHits = title.filter((word) => {
    return guessListAllVersions.includes(word);
  });
  return titleHits;
};

function App() {
  const [guessList, setGuessList] = useState([]);
  const [guessInput, setGuessInput] = useState("");
  const [visibleWords, setVisibleWords] = useState(commonWords);
  const [titleHits, setTitleHits] = useState([]);
  const [title, setTitle] = useState([]);
  const [wordsArr, setWordsArr] = useState([]);

  const modifiedWordsArr = redactWordsArr(wordsArr, visibleWords);

  useEffect(() => {
    (async () => {
      setGuessList(JSON.parse(localStorage.getItem("guessList") || "[]"));
      const { title: articleTitle, text } = await getArticte();
      setTitle(articleTitle.split("_"));
      const modified_text = text.replaceAll("\n", " newlinenewline ");
      //  .replaceAll(/===.*?===/g, (x) => `h3${_.trim(x, "===")}`)
      //  .replaceAll(/==.*?==/g, (x) => `h2${_.trim(x, "==")}`);
      //setWordsArr(modified_text.split(/[ .:;?!~,`"&|()=-<>{}\[\]\r\n/\\]+/));
      console.log("modified_text: " + modified_text);
      const updatedWordsArr = modified_text
        .split(/([\.:;?!~,`"&|() <>{}\[\]\r\n/\\])/g)
        .filter((word) => word);
      setWordsArr(updatedWordsArr);
    })();
  }, []);

  // useEffect(() => {
  //   if ((title.length > 0) & (titleHits.length === title.length)) {
  //     setVisibleWords(wordsArr);
  //   }
  // }, [curDate]);

  // USING LOCAL STORAGE WITH ARRAY EXAMPLE:
  // var yesArray = [];
  // localStorage.setItem('yesArray', JSON.stringify(yesArray));
  // yesArray = JSON.parse(localStorage.getItem('yesArray'));
  // yesArray.push('yes');
  // localStorage.setItem('yesArray', JSON.stringify(yesArray));
  // JSON.parse(localStorage.getItem('yesArray')); // Returns ["yes"]

  useEffect(() => {
    if ((title.length > 0) & (titleHits.length === title.length)) {
      setVisibleWords(wordsArr);
      localStorage.setItem("solved Hebdactles history", []);
    }
  }, [titleHits]);

  useEffect(() => {
    // console.log("'wordsArr: " + wordsArr);
    // console.log("guess list: " + guessList);
    // console.log("visible words: " + visibleWords);

    if (
      localStorage.getItem("title") &&
      title.length !== 0 &&
      localStorage.getItem("title") !== title.toString()
    ) {
      setGuessList([]);
      localStorage.setItem("guessList", JSON.stringify([]));
      localStorage.setItem("title", title);
    }
    if (!localStorage.getItem("title")) {
      // setGuessList([]);
      localStorage.setItem("title", title);
    }
    if (guessList.length !== 0) {
      localStorage.setItem("guessList", JSON.stringify(guessList));
    }
    setVisibleWords(buildVisibleWordsArrByGuessList(guessList));
    setTitleHits(buildTitleHitsArrByGuessList(guessList, title));
  }, [guessList, title]);

  const guessHandler = (event) => {
    if (event.key === "Enter") {
      const curGuess = event.target.value;
      if (!visibleWords.includes(curGuess)) {
        setGuessList([...guessList, curGuess]);
      }
      setGuessInput("");
    }
  };

  const onGuessInputChange = (event) => {
    setGuessInput(event.target.value.trim());
  };

  //console.log("debug wordaarrr", modifiedWordsArr.join(""));
  //console.log(title);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <h1
          dangerouslySetInnerHTML={{
            __html: redactWordsArr(title, titleHits).join(" "),
          }}
        ></h1>
        <div
          dangerouslySetInnerHTML={{ __html: modifiedWordsArr.join("") }}
          style={{
            lineHeight: "25px",
            padding: "8px",
            height: "100%",
            flex: 1,
            overflowWrap: "break-word",
          }}
        />
      </div>
      <div
        style={{
          minWidth: "400px",
          backgroundColor: "#bdbbbb",
          padding: "8px",
        }}
      >
        <div> ספירה מאחד בנובמבר, היום, יום ה', 17 בנובמבר - תורת הקבוצות</div>
        <input
          value={guessInput}
          onChange={onGuessInputChange}
          style={{ width: "384px", padding: "4px" }}
          onKeyPress={guessHandler}
        ></input>
        <div>
          {guessList
            .slice(0)
            .reverse()
            .map((guess, index) => (
              <div>
                {"#"}
                {guessList.length - index} {guess}{" "}
                {
                  wordsArr.filter((word) => {
                    const currGuessAllVersionsArr =
                      createAllWordVersions(guess);
                    return [...currGuessAllVersionsArr].includes(word);
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

// Jenia
//   "1, 2, 3.a . b".split(/([\.,])/g)
// (9) ['1', ',', ' 2', ',', ' 3', '.', 'a ', '.', ' b']
// "1, 2, 3.a . b \r\n === abra kadabra === \r\n fasfd faf === bbbaaaa ===".replace(/===.*===/g, (x) => `<h3>${_.trim(x, '=')}</h3>`)
