import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVersionCreatationComponent } from './new-version-creatation.component';

describe('NewVersionCreatationComponent', () => {
  let component: NewVersionCreatationComponent;
  let fixture: ComponentFixture<NewVersionCreatationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [NewVersionCreatationComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVersionCreatationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
