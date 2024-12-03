import { TestBed, inject } from '@angular/core/testing';

import { ActualService } from './actual.service';

describe('ActualService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActualService]
    });
  });

  it('should be created', inject([ActualService], (service: ActualService) => {
    expect(service).toBeTruthy();
  }));
});
