import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLogItemComponent } from './change-log-item.component';

describe('ChangeLogItemComponent', () => {
  let component: ChangeLogItemComponent;
  let fixture: ComponentFixture<ChangeLogItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [ChangeLogItemComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLogItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
