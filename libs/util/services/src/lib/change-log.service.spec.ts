import { TestBed, inject } from '@angular/core/testing';

import { ChangeLogService } from './change-log.service';

describe('ChangeLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChangeLogService]
    });
  });

  it('should be created', inject([ChangeLogService], (service: ChangeLogService) => {
    expect(service).toBeTruthy();
  }));
});
