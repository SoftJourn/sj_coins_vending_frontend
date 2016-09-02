/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import {Group} from './group';

describe('Group', () => {
  it('should create an instance', () => {
    expect(new Group(1, 'https://test.com', 'Configuration')).toBeTruthy();
  });
});
