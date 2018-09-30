const puppeteer = require('puppeteer')
const puppeteer_config = {
  headless: false
}
const EINSTEIN_URL = "https://einstein.software"

class Ein {
  constructor(){
    this.browser = null
    this.page = null
  }

  async init(){
    this.browser = await puppeteer.launch(puppeteer_config)
    this.page = await this.browser.newPage()
    await this.page.setViewport({ width: 680, height: 8000 })
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
    await this.page.waitForSelector('#books-page > div.actions-container > div.item.add-book > button')
    await this.page.click('#books-page > div.actions-container > div.item.add-book > button')

    if(type === "basic"){
      await this.page.waitForSelector('#create-card-modal > div.types > div:nth-child(1)')
      await this.page.click('#create-card-modal > div.types > div:nth-child(1)')
    } else {
      await this.page.waitForSelector('#create-card-modal > div.types > div:nth-child(2)')
      await this.page.click('#create-card-modal > div.types > div:nth-child(2)')
    }
  }

  // Book Edit
  async addPage(){
    await this.page.waitForSelector('#edit-book-page > form > div.add-page > button')
    await this.page.click('#edit-book-page > form > div.add-page > button')
  }
  async copyPage(index){
    await this.page.waitForSelector('#edit-book-page > form > div.pages-container > div > div > div > div.page-actions > span:nth-child(2) > span > button')
    await this.page.click('#edit-book-page > form > div.pages-container > div > div > div > div.page-actions > span:nth-child(2) > span > button')
  }
  async addPageField(index=1){
    await this.page.waitForSelector('#edit-book-page > form > div.pages-container > div > div:nth-child(' + index + ') > div > div.page-actions > span:nth-child(1) > span > button')
    await this.page.click('#edit-book-page > form > div.pages-container > div > div:nth-child(' + index + ') > div > div.page-actions > span:nth-child(1) > span > button')
  }
  async setPageField(key, value, pageIndex=1, fieldIndex=1){
    if(key){
      await this.clearInput('#edit-book-page > form > div.pages-container > div > div:nth-child(' + pageIndex + ') > div > div:nth-child(' + fieldIndex + ') > div.v-input.key.v-text-field > div > div.v-input__slot > div > input[type="text"]')
      await this.page.waitForSelector('#edit-book-page > form > div.pages-container > div > div:nth-child(' + pageIndex + ') > div > div:nth-child(' + fieldIndex + ') > div.v-input.key.v-text-field > div > div.v-input__slot > div > input[type="text"]')
      await this.page.type('#edit-book-page > form > div.pages-container > div > div:nth-child(' + pageIndex + ') > div > div:nth-child(' + fieldIndex + ') > div.v-input.key.v-text-field > div > div.v-input__slot > div > input[type="text"]', key)
    }
    if(value){
      await this.clearInput('#edit-book-page > form > div.pages-container > div > div:nth-child(' + pageIndex + ') > div > div:nth-child(' + fieldIndex + ') > div.v-input.value.v-text-field > div > div.v-input__slot > div > input[type="text"]')
      await this.page.waitForSelector('#edit-book-page > form > div.pages-container > div > div:nth-child(' + pageIndex + ') > div > div:nth-child(' + fieldIndex + ') > div.v-input.value.v-text-field > div > div.v-input__slot > div > input[type="text"]')
      await this.page.type('#edit-book-page > form > div.pages-container > div > div:nth-child(' + pageIndex + ') > div > div:nth-child(' + fieldIndex + ') > div.v-input.value.v-text-field > div > div.v-input__slot > div > input[type="text"]', value)
    }
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
