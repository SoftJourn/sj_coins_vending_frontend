import { VendingAdminPage } from './app.po';

describe('vending-admin App', function() {
  let page: VendingAdminPage;

  beforeEach(() => {
    page = new VendingAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
