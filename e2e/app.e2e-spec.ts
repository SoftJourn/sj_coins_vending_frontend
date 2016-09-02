import { ConfigurationTrackingSystemPage } from './app.po';

describe('configuration-tracking-system App', function() {
  let page: ConfigurationTrackingSystemPage;

  beforeEach(() => {
    page = new ConfigurationTrackingSystemPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
