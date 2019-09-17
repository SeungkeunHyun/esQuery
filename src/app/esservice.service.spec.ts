import { TestBed } from '@angular/core/testing';

import { ESServiceService } from './esservice.service';

describe('ESServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ESServiceService = TestBed.get(ESServiceService);
    expect(service).toBeTruthy();
  });
});
