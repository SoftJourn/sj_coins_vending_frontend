/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('Service: Token', () => {
  beforeEach(() => {
    addProviders([TokenService]);
  });

  it('should ...',
    inject([TokenService],
      (service: TokenService) => {
        expect(service).toBeTruthy();
      }));
});
