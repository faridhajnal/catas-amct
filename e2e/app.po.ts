import { browser, element, by } from 'protractor';

export class CatasAmctClientPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('cata-root h1')).getText();
  }
}
