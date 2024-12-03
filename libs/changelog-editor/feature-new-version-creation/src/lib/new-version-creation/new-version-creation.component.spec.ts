import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewVersionCreationComponent } from './new-version-creation.component';

describe('NewVersionCreationComponent', () => {
  let component: NewVersionCreationComponent;
  let fixture: ComponentFixture<NewVersionCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NewVersionCreationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVersionCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
