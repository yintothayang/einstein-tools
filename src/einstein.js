const puppeteer = require('puppeteer')
const puppeteer_config = {
  headless: false
}
const EINSTEIN_URL = "localhost:8080"
// const EINSTEIN_URL = "https://einstein.software"

class Ein {
  constructor(){
    this.browser = null
    this.page = null
  }

  async init(){
    this.browser = await puppeteer.launch(puppeteer_config)
    this.page = await this.browser.newPage()
    await this.page.setViewport({ width: 680, height: 800 })
  }

  async login(email, password){
    await this.page.goto(EINSTEIN_URL + "/#/login")

    await this.page.waitForSelector('input[type="email"]')
    await this.page.type('input[type="email"]', email)

    await this.page.waitForSelector('input[type="password"]')
    await this.page.type('input[type="password"]', password)

    await this.page.waitForSelector('.card-container > .card > .v-form > .v-btn > .v-btn__content')
    await this.page.click('.card-container > .card > .v-form > .v-btn > .v-btn__content')
  }

  async newBook(type){
    await this.page.goto(EINSTEIN_URL + "/#/books/new_" + type)
  }

  // Book Edit
  async addPage(){
    await this.page.waitForSelector('#edit-book-page button.add')
    await this.page.click('#edit-book-page  button.add')
  }
  // async deletePage(){
  //   await this.page.waitForSelector('#edit-book-page > form > div.add-page > button')
  //   await this.page.click('#edit-book-page > form > div.add-page > button')
  // }
  async copyPage(index){
    await this.page.waitForSelector('#edit-book-page > form > div.pages-container > div > div > div > div.page-actions > span:nth-child(2) > span > button')
    await this.page.click('#edit-book-page > form > div.pages-container > div > div > div > div.page-actions > span:nth-child(2) > span > button')
  }
  async setPageKeys(keys){
    // Open modal
    await this.page.waitForSelector('button.edit')
    await this.page.click('button.edit')
    await this.page.waitForSelector('#page-keys-modal')

    // Delete current key
    await this.page.waitForSelector('#page-keys-modal  div.action > button')
    await this.page.click('#page-keys-modal div.action > button')

    // Add each key
    await this.page.waitForSelector('#page-keys-modal > div.header > button')
    for(let i=1; i <= keys.length; i++){
      await this.page.click('#page-keys-modal > div.header > button')
      await this.page.waitForSelector('#page-keys-modal > div.body > div > div:nth-child(' + i + ') input')
      await this.clearInput('#page-keys-modal > div.body > div > div:nth-child(' + i + ') input')
      await this.page.type('#page-keys-modal > div.body > div > div:nth-child(' + i + ')  input', keys[i-1])
    }

    // Done
    await this.page.click('#page-keys-modal > div.v-card__actions > button')
  }
  async setPageField(value, pageIndex=1, fieldIndex=1){
    pageIndex++
    fieldIndex++
    let selector = 'div.pages > div:nth-child(' + pageIndex + ') div.page-rows > div:nth-child(' + fieldIndex + ') input'
    // await this.page.waitForSelector(selector)
    await this.clearInput(selector)
    await this.page.type(selector, value)
    // await this.page.evaluate((selector, value) => {
    //   document.querySelector(selector).value = value
    // }, selector, value)
  }

  async setBookName(name){
    await this.page.waitForSelector('#edit-book-page > form > div.name-container > div.v-input.name.v-text-field > div > div.v-input__slot > div > input[type="text"]')
    await this.clearInput('#edit-book-page > form > div.name-container > div.v-input.name.v-text-field > div > div.v-input__slot > div > input[type="text"]')
    await this.page.type('#edit-book-page > form > div.name-container > div.v-input.name.v-text-field > div > div.v-input__slot > div > input[type="text"]', name)
  }

  async saveBook(){
    await this.page.waitForSelector('#edit-book-page > form > div.actions-container > span > span > button')
    await this.page.click('#edit-book-page > form > div.actions-container > span > span > button')
  }

  async clearInput(selector){
    await this.page.waitForSelector(selector)
    let el = await this.page.$(selector)
    await el.click({clickCount: 3})
    await this.page.keyboard.press('Backspace')
  }
}



module.exports = new Ein()
