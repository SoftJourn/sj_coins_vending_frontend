/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import {AccountPhoto} from './account-photo';

describe('AccountPhoto', () => {
  it('should create an instance', () => {
    expect(new AccountPhoto(1, 'someurl', 'test.jpg', 80, 80)).toBeTruthy();
  });
});
