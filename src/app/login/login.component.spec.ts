/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { Router } from '@angular/router'

import { LoginComponent } from './login.component';
import { AccountService } from "../shared/";

describe('Component: Login', () => {
  it('should create an instance', inject([Router, AccountService], (router: Router, account: AccountService) => {
    let component = new LoginComponent(router, account);
    expect(component).toBeTruthy();
  }));
});
