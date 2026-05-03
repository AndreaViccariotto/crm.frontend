import { TestBed } from '@angular/core/testing';

import { ConfirmElimination } from './confirm-elimination';

describe('ConfirmElimination', () => {
  let service: ConfirmElimination;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmElimination);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
