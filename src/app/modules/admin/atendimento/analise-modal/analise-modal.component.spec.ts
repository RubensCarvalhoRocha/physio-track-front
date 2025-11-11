import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliseModalComponent } from './analise-modal.component';

describe('AnaliseModalComponent', () => {
  let component: AnaliseModalComponent;
  let fixture: ComponentFixture<AnaliseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnaliseModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
