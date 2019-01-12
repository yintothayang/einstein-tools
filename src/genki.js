const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const puppeteer_config = {
  headless: true
}
const BASE_URL = "http://ohelo.org/japn/lang/genki_vocab_table.php"

class Genki {
  constructor(){
    this.browser = null
    this.page = null
  }

  async init(){
    this.browser = await puppeteer.launch(puppeteer_config)
    this.page = await this.browser.newPage()
    await this.page.setViewport({ width: 900, height: 800 })
  }

  async destroy(){
    this.browser.close()
  }

  async scrapeLesson(lesson){
    await this.page.goto(BASE_URL + "?lesson=" + lesson)
    await this.page.waitForSelector('table')

    let total = await this.page.$eval('tbody', (element) => {
      return element.children.length
    })
    let words = []
    for(let i=2; i<=total; i++){
      words.push(
        await this.page.$eval('body > p > table > tbody > tr:nth-child(' + i + ')', (el) => {
          return {
            kana: el.children[0].innerText.replace("\t", ''),
            kanji: el.children[1].innerText.replace("\t", ''),
            english: el.children[2].innerText.replace("\t", ''),
            // english: el.children[3].innerText.replace("\t", ''),
          }
        })
      )
    }

    return words
  }
}



module.exports = new Genki()
