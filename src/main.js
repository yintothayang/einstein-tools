const Ein = require('./einstein')
const Jisho = require('./jisho')

async function main(){
  // await Ein.init()
  // await Ein.login('test@test.com', "eueueu")
  // await Ein.newBook("advanced")
  // await Ein.addPage()
  // await Ein.addPageField()
  // await Ein.setPageField('taco', 'loco')
  // await Ein.setPageField('taco4', 'loco3', 2, 1)
  // await Ein.saveBook()
  // TODO broken on einstein-www
  // await Ein.copyPage()

  // Jisho
  await Jisho.init()
  await Jisho.search("#word #common")
  let words = await Jisho.scrapeWords()
  console.log(words)

  await Jisho.destroy()
}

main()
