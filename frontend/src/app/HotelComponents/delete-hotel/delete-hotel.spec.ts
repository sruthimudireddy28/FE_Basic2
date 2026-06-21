import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHotel } from './delete-hotel';

describe('DeleteHotel', () => {
  let component: DeleteHotel;
  let fixture: ComponentFixture<DeleteHotel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteHotel],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteHotel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
