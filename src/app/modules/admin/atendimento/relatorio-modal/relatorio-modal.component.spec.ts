import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioModalComponent } from './relatorio-modal.component';

describe('RelatorioModalComponent', () => {
  let component: RelatorioModalComponent;
  let fixture: ComponentFixture<RelatorioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatorioModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
