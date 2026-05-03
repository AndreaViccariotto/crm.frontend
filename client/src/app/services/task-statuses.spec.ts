import { TestBed } from '@angular/core/testing';

import { TaskStatuses } from './task-statuses';

describe('TaskStatuses', () => {
  let service: TaskStatuses;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskStatuses);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
