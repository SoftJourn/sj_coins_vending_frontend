/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MainInfoComponent } from './main-info.component';
import { AccountService } from "../shared/services/account.service";
import { TasksService } from "../+tasks/shared/";
import { inject } from "@angular/core/testing";

describe('Component: MainInfo', () => {
  it('should create an instance', inject([AccountService], (account: AccountService, taskService: TasksService) => {
    let component = new MainInfoComponent(account, taskService);
    expect(component).toBeTruthy();
  }));
});
