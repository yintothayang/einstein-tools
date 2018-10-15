const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const puppeteer_config = {
  headless: true
}
const GOOGLE_URL = "https://google.com"
const GOOGLE_IMAGES_URL = "https://images.google.com"

class Google {
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

  async getFirstImage(query){
    await this.page.goto(GOOGLE_IMAGES_URL)

    await this.page.waitForSelector('input')
    await this.page.type('input', query)
    await this.page.click('button')

    await this.page.waitForSelector('#search #rg a')
    await this.page.click('#search #rg a')

    await delay(2000)

    await this.page.waitForSelector('#irc_cc > div:nth-child(2)  div.irc_mic > div.irc_mimg.irc_hic > a > img')
    return await this.page.$eval('#irc_cc > div:nth-child(2)  div.irc_mic > div.irc_mimg.irc_hic > a > img', (element) => {
      return element.src
    })
  }
}

function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}

module.exports = new Google()
