package com.oanhtp.fuminihotel.controller;

import com.oanhtp.fuminihotel.dto.request.CreateBookingRequest;
import com.oanhtp.fuminihotel.dto.request.UpdateBookingStatusRequest;
import com.oanhtp.fuminihotel.dto.response.ApiResponse;
import com.oanhtp.fuminihotel.dto.response.BookingReservationResponse;
import com.oanhtp.fuminihotel.dto.response.PageResponse;
import com.oanhtp.fuminihotel.security.UserPrincipal;
import com.oanhtp.fuminihotel.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingReservationResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        BookingReservationResponse response = bookingService.createBooking(request, currentUser);
        return new ResponseEntity<>(ApiResponse.ok("Booking created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<PageResponse<BookingReservationResponse>>> getAllBookings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<BookingReservationResponse> bookings = bookingService.getAllBookings(keyword, status, page, size);
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PageResponse<BookingReservationResponse>>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<BookingReservationResponse> bookings = bookingService.getCustomerBookings(currentUser.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingReservationResponse>> getBookingById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        BookingReservationResponse response = bookingService.getBookingById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<BookingReservationResponse>> updateBookingStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateBookingStatusRequest request
    ) {
        BookingReservationResponse response = bookingService.updateBookingStatus(id, request.getBookingStatus());
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated successfully", response));
    }
}

