const puppeteer = require('puppeteer')
const puppeteer_config = {
  headless: false
}
const BASE_URL = "https://www.quia.com"


class Quia {
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

  async scrapeWords(url){
    await this.page.goto(BASE_URL + url)
    await this.page.waitForSelector('.quia_standard_non_fixed')

    let total = await this.page.$eval('.quia_standard_non_fixed', (element) => {
      return element.querySelectorAll('tr').length
    })
    console.log(total)
    let words = []
    for(let i=2; i<=total; i++){
      words.push(
        await this.page.$eval('.quia_standard_non_fixed tr:nth-child(' + i + ')', (el) => {
          return {
            image:  el.querySelector('img').src,
            note: el.querySelectorAll('td')[1].innerText
          }
        })
      )
    }
    return words
  }
}



module.exports = new Quia()
