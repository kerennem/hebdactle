import fetch from 'node-fetch'
import topArticles from './top_articles.json'
import fs from 'fs'
///import fs from 'fs'

console.log(topArticles.pages.length)

// try {
//   const topArticles = fs.readFileSync('./top_articles.json', 'utf8');
//   console.log(topArticles);
// } catch (err) {
//   console.error(err);
//}

/*
// shel paam: callbacks!
const setTimeout = (callback, time) => {
    // mehake time
    callback()
}
setTimeout(() => {console.log('asdf')}, 300);

const findMeee = (name, callbackGood, callbackBad) => {
      setTimeout(() => {
        callback()
      }, 300);
}
findMeee('herth', () => {
    // ...
}, () => {

})

// shel laaharona: promises!
const findMeeeWithAPromise = (name) => {
    const promise = new Promise()
    // ...
    return promise
}
const promiseForHerth = findMeeeWithAPromise('herth')
promiseForHerth.then(() => {
    // ...
})

// hayom! async/await
const func = () => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(42)
          }, 10000);
    })
}
const func2 = async () => {
    const result = await func()
    console.log('after')
}
*/
topArticles.pages.forEach(async (title) => {
    try{
        const res = await fetch(`https://he.wikipedia.org/w/api.php?action=query&format=json&titles=${title}&prop=extracts&explaintext`)
        const json = await res.json()
        //console.log('finished ' + title, text.length)
        const keys = Object.keys(json.query.pages)
        if (keys.length > 1) {
            console.log('wtf', keys.length)
        } else {
            const pageId = keys[0]
            const extract = json.query.pages[pageId].extract
            if (extract) {
                fs.writeFileSync(`data/${title}.text`, extract.toString('utf-8'))
            }
        }    
    }catch(err) {
        console.log(err)
    }
})

//    .then(res => res.text())
  //  .then(text => {
    //    console.log(text)
//})

console.log("shalom")

