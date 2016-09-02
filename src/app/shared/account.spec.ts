/* tslint:disable:no-unused-variable */

import {Account} from './account';
import { AccountPhoto } from "./";

describe('Account', () => {
  it('should create an instance', () => {
    expect(new Account(
      1,
      'Andy Bob',
      'ab@gm.com',
      new AccountPhoto(1, 'someurl', 'test.jpg', 80, 80)
    )).toBeTruthy();
  });
});
