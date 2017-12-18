import { TestBed, inject } from '@angular/core/testing';

import { NavbarService } from './navbar.service';

describe('TopNavbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavbarService]
    });
  });

  it('should be created', inject([NavbarService], (service: NavbarService) => {
    expect(service).toBeTruthy();
  }));
});
