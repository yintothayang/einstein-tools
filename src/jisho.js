const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const puppeteer_config = {
  headless: false
}
const JISHO_URL = "https://jisho.org"

class Jisho {
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

  async search(query){
    await this.page.goto(JISHO_URL)

    await this.page.waitForSelector('#keyword')
    await this.page.type('#keyword', query)

    await this.page.waitForSelector('#search_main > div.inner > button')
    await this.page.click('#search_main > div.inner > button')
  }

  async scrapeWords(){
    let words = []
    await this.page.waitForSelector('.concepts')
    let wordCount = await this.page.$eval('.concepts', (element) => {
      return element.children.length
    })
    for(let i=2; i<wordCount; i++){
      let selector = '#primary > div > div:nth-child(' + i + ')'
      await this.page.waitForSelector(selector)
      let word = await this.scrapeWord(selector)
      words.push(word)
    }
    return words
  }

  async scrapeWord(selector){
    let furigana = await this.page.$eval(selector, (element) => {
      return element.querySelector('.furigana').innerText
    })

    let text = await this.page.$eval(selector, (element) => {
      return element.querySelector('.text').innerText
    })

    let meaning = await this.page.$eval(selector, (element) => {
      return element.querySelector('.meaning-meaning').innerText
    })

    let audio_url = await this.page.$eval(selector, (element) => {
      if(element.querySelector('audio')){
        return element.querySelector('audio').children[0].src
      } else {
        return undefined
      }
    })
    return {
      furigana,
      text,
      meaning,
      audio_url,
    }
  }
}



module.exports = new Jisho()
