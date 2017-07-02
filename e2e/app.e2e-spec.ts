import { CatasAmctClientPage } from './app.po';

describe('catas-amct-client App', () => {
  let page: CatasAmctClientPage;

  beforeEach(() => {
    page = new CatasAmctClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('cata works!');
  });
});
