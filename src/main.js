const Ein = require('./einstein')
const Jisho = require('./jisho')
const Google = require('./google')
const Genki = require('./genki')
const Quia = require('./quia')

async function main(){
  await createGenkiLesson(4)
}

// async function createMusicLesson(){
//   await Quia.init()
//   let words = await Quia.scrapeWords('/jg/1622622list.html')
//   await Quia.destroy()
//   console.log(words)
//   await createBook(words, "Treble Clef")
// }

async function createGenkiLesson(lesson){
  await Genki.init()
  let words = await Genki.scrapeLesson(lesson)
  await Genki.destroy()
  // for(let i=0; i<words.length; i++){
  //   let word = words[i]
  //   word.image = await getImage(word.english)
  //   word.$audio = await getAudio(word.kana)
  // }
  // console.log(words)
  await createBook(words, "Genki Ch " + lesson)
}

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
  // console.log(words)
  await Ein.init()
  await Ein.login('test@test.com', "eueueu")
  // wait
  await Ein.page.waitForSelector("#books-page")
  await Ein.newBook(type)
  await Ein.setBookName(name)

  // Set the pageKeys
  await Ein.setPageKeys(Object.keys(words[0]))

  // Add the pages
  for(let i=0; i< words.length; i++){
    i != 0 ? await Ein.addPage() : void(0)
    let word = words[i]
    let values = Object.values(word)
    console.log("values: ", values)
    for(let j=0; j<values.length; j++){
      let value = values[j]
      await Ein.setPageField(value, i, j)
    }
  }
  // await Ein.saveBook()
}

main()
