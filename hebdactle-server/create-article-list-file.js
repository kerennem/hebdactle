function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const fs = require("fs");
const articleNames = fs.readdirSync("./data/");
for (article in articleNames) {
  const text = fs.readFileSync("./data/" + articleNames[0]).toString();
  console.log(text.length);
}
shuffle(articleNames);
fs.writeFileSync(".article-list.txt", JSON.stringify(articleNames));
