const Ein = require('./einstein')
const Jisho = require('./jisho')
const Google = require('./google')
const Genki = require('./genki')
const Quia = require('./quia')

async function main(){

  await Quia.init()
  let words = await Quia.scrapeWords('/jg/1622622list.html')
  await Quia.destroy()
  console.log(words)
  await createBook(words, "Treble Clef")
}

// async function createGenkiLesson(lesson){
//   await Genki.init()
//   let words = await Genki.scrapeLesson(lesson)
//   await Genki.destroy()
//   for(let i=0; i<words.length; i++){
//     let word = words[i]
//     word.image = await getImage(word.english)
//     word.$audio = await getAudio(word.kana)
//   }
//   await createBook(words, "Genki Lesson " + lesson)
// }

// async function getJishoWords(){
//   // Get First page of Jisho common words
//   await Jisho.init()
//   await Jisho.search("#word #common")
//   let words = await Jisho.scrapeWords()
//   await Jisho.destroy()
//   return words
// }

async function getImage(query){
  await Google.init()
  let result = await Google.getFirstImage(query)
  await Google.destroy()
  return result
}

async function getAudio(query){
  await Jisho.init()
  await Jisho.search(query)
  let audio = await Jisho.getAudio(query)
  await Jisho.destroy()
  return audio
}


async function createBook(words, name, type="advanced"){
  console.log(words)
  await Ein.init()
  await Ein.login('test@test.com', "eueueu")
  await Ein.newBook(type)
  await Ein.setBookName(name)

  // Hack, already a init page on form
  let first = true
  for(let i=0; i<words.length; i++){
    !first ? await Ein.addPage() : void(0)
    first = false

    let word = words[i]
    let wordKeys = Object.keys(word)

    let first2 = true
    for(let j=0; j<wordKeys.length; j++){
      let key = wordKeys[j]

      !first2 ? await Ein.addPageField(i+1) : void(0)
      first2 = false

      console.log("key:", key)
      console.log("value:", word[key])
      console.log("i:", i)
      console.log("j:", j)
      await Ein.setPageField(key, word[key], i+1, j+1)
    }
    console.log("done page:", i)
  }

  // await Ein.saveBook()
}

main()
