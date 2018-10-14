const Ein = require('./einstein')
const Jisho = require('./jisho')
const Google = require('./google')

async function main(){
  let words = await getJishoWords()
  await getImages(words)
  await createJishoBook(words)
  console.log("done")
}

async function getJishoWords(){
  // Get First page of Jisho common words
  await Jisho.init()
  await Jisho.search("#word #common")
  let words = await Jisho.scrapeWords()
  await Jisho.destroy()
  return words
}

async function getImages(words){
  await Google.init()
  for(let i=0; i<words.length; i++){
    let word = words[i]
    word.image = await Google.getFirstImage(word.wiki_definition)
  }
  await Google.destroy()
}


async function createJishoBook(words){
  console.log(words)

  await Ein.init()
  await Ein.login('test@test.com', "eueueu")
  await Ein.newBook("advanced")
  await Ein.setBookName("Jisho Common 1-20")

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

      // TODO can't add page field on second page
      !first2 ? await Ein.addPageField(i+1) : void(0)
      first2 = false

      console.log("key:", key)
      console.log("value:", word[key])
      console.log("i:", i)
      console.log("j:", j)
      await Ein.setPageField(key, word[key], i+1, j+1)
      console.log("done key", j)
    }
    console.log("done page:", i)
  }


  // await Ein.saveBook()


}

main()
