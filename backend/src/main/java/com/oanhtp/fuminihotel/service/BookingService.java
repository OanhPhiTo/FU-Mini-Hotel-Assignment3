package com.oanhtp.fuminihotel.service;

import com.oanhtp.fuminihotel.dto.request.CreateBookingRequest;
import com.oanhtp.fuminihotel.dto.response.BookingReservationResponse;
import com.oanhtp.fuminihotel.dto.response.PageResponse;
import com.oanhtp.fuminihotel.security.UserPrincipal;

public interface BookingService {

    BookingReservationResponse createBooking(CreateBookingRequest request, UserPrincipal currentUser);

    BookingReservationResponse getBookingById(Integer id, UserPrincipal currentUser);

    PageResponse<BookingReservationResponse> getAllBookings(String keyword, Integer status, int page, int size);

    PageResponse<BookingReservationResponse> getCustomerBookings(Integer customerId, int page, int size);

    BookingReservationResponse updateBookingStatus(Integer id, Integer status);
}

