import { TestBed, inject } from '@angular/core/testing';

import { GoogleTranslateService } from './google-translate.service';

describe('TranslateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleTranslateService]
    });
  });

  it('should be created', inject([GoogleTranslateService], (service: GoogleTranslateService) => {
    expect(service).toBeTruthy();
  }));
});
