import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanegeListComponent } from './chanege-list.component';

describe('ChanegeListComponent', () => {
  let component: ChanegeListComponent;
  let fixture: ComponentFixture<ChanegeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChanegeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChanegeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
