package com.oanhtp.fuminihotel;

import com.oanhtp.fuminihotel.dto.request.BookingDetailItemRequest;
import com.oanhtp.fuminihotel.dto.request.CreateBookingRequest;
import com.oanhtp.fuminihotel.dto.response.BookingReservationResponse;
import com.oanhtp.fuminihotel.entity.BookingReservation;
import com.oanhtp.fuminihotel.entity.Customer;
import com.oanhtp.fuminihotel.entity.RoomInformation;
import com.oanhtp.fuminihotel.entity.RoomType;
import com.oanhtp.fuminihotel.exception.BadRequestException;
import com.oanhtp.fuminihotel.repository.BookingDetailRepository;
import com.oanhtp.fuminihotel.repository.BookingReservationRepository;
import com.oanhtp.fuminihotel.repository.CustomerRepository;
import com.oanhtp.fuminihotel.repository.RoomInformationRepository;
import com.oanhtp.fuminihotel.security.UserPrincipal;
import com.oanhtp.fuminihotel.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingReservationRepository reservationRepository;

    @Mock
    private BookingDetailRepository detailRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private RoomInformationRepository roomRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    @Test
    @DisplayName("Should successfully create booking and calculate correct prices on backend")
    void testCreateBookingSuccess() {
        UserPrincipal customerUser = new UserPrincipal(1, "cust@fumini.com", "pass", "Customer One", "CUSTOMER", true);
        Customer customer = new Customer(1, "Customer One", "0900000000", "cust@fumini.com", LocalDate.of(1995, 1, 1), 1, "pass");

        RoomType standardType = new RoomType(1, "Standard", "Desc", "Note");
        RoomInformation room101 = new RoomInformation(101, "101", "Room 101", 2, standardType, 1, new BigDecimal("50.00"));

        LocalDate start = LocalDate.now().plusDays(2);
        LocalDate end = LocalDate.now().plusDays(5); // 3 days

        BookingDetailItemRequest item = new BookingDetailItemRequest(101, start, end);
        CreateBookingRequest request = new CreateBookingRequest(null, List.of(item));

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(roomRepository.findById(101)).thenReturn(Optional.of(room101));
        when(detailRepository.existsOverlappingBooking(101, start, end)).thenReturn(false);

        BookingReservation preSaved = new BookingReservation();
        preSaved.setBookingReservationID(1);
        preSaved.setCustomer(customer);
        preSaved.setBookingDate(LocalDate.now());
        when(reservationRepository.save(any(BookingReservation.class))).thenReturn(preSaved);

        BookingReservationResponse response = bookingService.createBooking(request, customerUser);

        assertNotNull(response);
        assertEquals(1, response.getBookingReservationID());
        // 3 days * 50.00 = 150.00
        assertEquals(new BigDecimal("150.00"), response.getTotalPrice());
        assertEquals(1, response.getBookingDetails().size());
        assertEquals(new BigDecimal("150.00"), response.getBookingDetails().get(0).getActualPrice());
        assertEquals(3, response.getBookingDetails().get(0).getNumberOfDays());
    }

    @Test
    @DisplayName("Should reject booking when startDate is not before endDate")
    void testCreateBookingInvalidDates() {
        UserPrincipal customerUser = new UserPrincipal(1, "cust@fumini.com", "pass", "Customer One", "CUSTOMER", true);
        Customer customer = new Customer(1, "Customer One", "0900000000", "cust@fumini.com", LocalDate.of(1995, 1, 1), 1, "pass");

        LocalDate start = LocalDate.now().plusDays(5);
        LocalDate end = LocalDate.now().plusDays(2); // End is BEFORE start!

        BookingDetailItemRequest item = new BookingDetailItemRequest(101, start, end);
        CreateBookingRequest request = new CreateBookingRequest(null, List.of(item));

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));

        BookingReservation preSaved = new BookingReservation();
        preSaved.setBookingReservationID(1);
        when(reservationRepository.save(any(BookingReservation.class))).thenReturn(preSaved);

        assertThrows(BadRequestException.class, () -> bookingService.createBooking(request, customerUser));
    }

    @Test
    @DisplayName("Should reject booking when requested room has overlapping schedule")
    void testCreateBookingOverlapping() {
        UserPrincipal customerUser = new UserPrincipal(1, "cust@fumini.com", "pass", "Customer One", "CUSTOMER", true);
        Customer customer = new Customer(1, "Customer One", "0900000000", "cust@fumini.com", LocalDate.of(1995, 1, 1), 1, "pass");

        RoomType standardType = new RoomType(1, "Standard", "Desc", "Note");
        RoomInformation room101 = new RoomInformation(101, "101", "Room 101", 2, standardType, 1, new BigDecimal("50.00"));

        LocalDate start = LocalDate.now().plusDays(2);
        LocalDate end = LocalDate.now().plusDays(5);

        BookingDetailItemRequest item = new BookingDetailItemRequest(101, start, end);
        CreateBookingRequest request = new CreateBookingRequest(null, List.of(item));

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(roomRepository.findById(101)).thenReturn(Optional.of(room101));
        when(detailRepository.existsOverlappingBooking(101, start, end)).thenReturn(true); // OVERLAPS!

        BookingReservation preSaved = new BookingReservation();
        preSaved.setBookingReservationID(1);
        when(reservationRepository.save(any(BookingReservation.class))).thenReturn(preSaved);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> bookingService.createBooking(request, customerUser));
        assertTrue(ex.getMessage().contains("already booked"));
    }
}

