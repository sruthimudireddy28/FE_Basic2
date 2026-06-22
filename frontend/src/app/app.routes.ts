import { Routes } from '@angular/router';
import { Hotels } from './HotelComponents/hotels/hotels';
import { HotelSearch } from './HotelComponents/hotel-search/hotel-search';
import { HotelAmenities } from './HotelComponents/hotel-amenities/hotel-amenities';
import { UpdateHotel } from './HotelComponents/update-hotel/update-hotel';
import { CreateAmenity } from './HotelComponents/create-amenity/create-amenity';
import { UpdateAmenity } from './HotelComponents/update-amenity/update-amenity';
import { DeleteHotel } from './HotelComponents/delete-hotel/delete-hotel';
import { DeleteAmenity } from './HotelComponents/delete-amenity/delete-amenity';
import { CreateHotel } from './HotelComponents/create-hotel/create-hotel';
import { DashboardComponent } from './AuthComponents/dashboard/dashboard/dashboard';
import { LoginComponent } from './AuthComponents/login/login/login';
import { RegisterComponent } from './AuthComponents/register/register/register';
import { RoomsByHotel } from './RoomComponents/rooms-by-hotel/rooms-by-hotel';
import { AvailableRooms } from './RoomComponents/available-rooms/available-rooms';
import { CreateBooking } from './BookingComponents/create-booking/create-booking';
import { MyBookings } from './BookingComponents/my-bookings/my-bookings';
import { AllBookings } from './BookingComponents/all-bookings/all-bookings';
import { ProcessPayment } from './PaymentComponents/process-payment/process-payment';
import { MyPayments } from './PaymentComponents/my-payments/my-payments';
import { CreateReview } from './ReviewComponents/create-review/create-review';
import { HotelReviews } from './ReviewComponents/hotel-reviews/hotel-reviews';
import { LoyaltyStatus } from './LoyaltyComponents/loyalty/loyalty';

// New Admin Components
import { CreateRoom } from './RoomComponents/create-room/create-room';
import { UpdateRoom } from './RoomComponents/update-room/update-room';
import { ManageReviews } from './ReviewComponents/manage-reviews/manage-reviews';

// Guard
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {path:'hotels',component:Hotels},
    {path:'hotel-search',component:HotelSearch},
    {path:'create-hotel',component:CreateHotel, canActivate: [adminGuard]},
    {path:'update-hotel',component:UpdateHotel, canActivate: [adminGuard]},
    {path:'update-hotel/:id',component:UpdateHotel, canActivate: [adminGuard]},
    {path:'delete-hotel',component:DeleteHotel, canActivate: [adminGuard]},
    {path:'delete-hotel/:id',component:DeleteHotel, canActivate: [adminGuard]},
    {path:'hotel-amenities',component:HotelAmenities, canActivate: [adminGuard]},
    {path:'create-amenity',component:CreateAmenity, canActivate: [adminGuard]},
    {path:'update-amenity',component:UpdateAmenity, canActivate: [adminGuard]},
    {path:'update-amenity/:id',component:UpdateAmenity, canActivate: [adminGuard]},
    {path:'delete-amenity',component:DeleteAmenity, canActivate: [adminGuard]},
    {path:'delete-amenity/:id',component:DeleteAmenity, canActivate: [adminGuard]},
    {path:'dashboard',component:DashboardComponent, canActivate: [adminGuard]},
    {path:'',component:LoginComponent},
    {path:'register',component:RegisterComponent},  
    {path:'rooms-by-hotel',component:RoomsByHotel},
    {path:'rooms-by-hotel/:id',component:RoomsByHotel},
    {path:'available-rooms',component:AvailableRooms},
    {path:'available-rooms/:id',component:AvailableRooms},
    {path:'create-booking/:hotelId/:roomId',component:CreateBooking},
    {path:'my-bookings',component:MyBookings},
    {path:'all-bookings',component:AllBookings, canActivate: [adminGuard]},
    {path:'process-payment/:bookingId/:amount',component:ProcessPayment},
    {path:'my-payments',component:MyPayments},
    {path:'create-review/:hotelId/:bookingId',component:CreateReview},
    {path:'hotel-reviews/:hotelId',component:HotelReviews},
    {path:'loyalty',component:LoyaltyStatus},
    
    // New Admin Routes
    {path:'create-room/:hotelId',component:CreateRoom, canActivate: [adminGuard]},
    {path:'update-room/:id',component:UpdateRoom, canActivate: [adminGuard]},
    {path:'manage-reviews',component:ManageReviews, canActivate: [adminGuard]}
];

