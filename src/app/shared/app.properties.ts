export class AppProperties {
  static API_VENDING_ENDPOINT = 'https://sjcoins-testing.softjourn.if.ua/vending/v1';
  static AUTH_SERVER='https://sjcoins-testing.softjourn.if.ua/auth';
  static AUTH_ENDPOINT = AppProperties.AUTH_SERVER +'/oauth/token';
  static AUTH_API = AppProperties.AUTH_SERVER + '/api/v1';
  static CLIENT_AUTH_HASH = 'dXNlcl9jcmVkOnN1cGVyc2VjcmV0';
  static NOTIFICATION_OPTIONS = {
    position: ["bottom", "right"],
    timeOut: 2000,
    lastOnBottom: true
  };
}
