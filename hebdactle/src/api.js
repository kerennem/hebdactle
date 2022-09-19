const getArticle = async () => {
  const res = await fetch("http://localhost:3003/article");
  const article = await res.json();

  return article;
};

export default getArticle;
