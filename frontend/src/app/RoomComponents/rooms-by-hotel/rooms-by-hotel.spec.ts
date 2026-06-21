import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsByHotel } from './rooms-by-hotel';

describe('RoomsByHotel', () => {
  let component: RoomsByHotel;
  let fixture: ComponentFixture<RoomsByHotel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsByHotel],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomsByHotel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
