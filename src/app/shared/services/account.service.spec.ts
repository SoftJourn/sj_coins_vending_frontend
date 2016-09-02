/* tslint:disable:no-unused-variable */

import { inject } from "@angular/core/testing";
import { AccountService } from "./account.service";

describe('Account Service', () => {
  beforeEach(() => [AccountService]);

  it('should ...',
      inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));
});
