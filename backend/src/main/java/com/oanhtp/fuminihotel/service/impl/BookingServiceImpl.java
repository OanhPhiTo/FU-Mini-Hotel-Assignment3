package com.oanhtp.fuminihotel.service.impl;

import com.oanhtp.fuminihotel.dto.request.BookingDetailItemRequest;
import com.oanhtp.fuminihotel.dto.request.CreateBookingRequest;
import com.oanhtp.fuminihotel.dto.response.*;
import com.oanhtp.fuminihotel.entity.BookingDetail;
import com.oanhtp.fuminihotel.entity.BookingDetailId;
import com.oanhtp.fuminihotel.entity.BookingReservation;
import com.oanhtp.fuminihotel.entity.Customer;
import com.oanhtp.fuminihotel.entity.RoomInformation;
import com.oanhtp.fuminihotel.exception.BadRequestException;
import com.oanhtp.fuminihotel.exception.ForbiddenException;
import com.oanhtp.fuminihotel.exception.ResourceNotFoundException;
import com.oanhtp.fuminihotel.repository.BookingDetailRepository;
import com.oanhtp.fuminihotel.repository.BookingReservationRepository;
import com.oanhtp.fuminihotel.repository.CustomerRepository;
import com.oanhtp.fuminihotel.repository.RoomInformationRepository;
import com.oanhtp.fuminihotel.security.UserPrincipal;
import com.oanhtp.fuminihotel.service.BookingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingReservationRepository reservationRepository;
    private final BookingDetailRepository detailRepository;
    private final CustomerRepository customerRepository;
    private final RoomInformationRepository roomRepository;

    public BookingServiceImpl(BookingReservationRepository reservationRepository,
                              BookingDetailRepository detailRepository,
                              CustomerRepository customerRepository,
                              RoomInformationRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.detailRepository = detailRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    private BookingDetailResponse mapDetailToResponse(BookingDetail detail) {
        if (detail == null) return null;
        RoomInformation room = detail.getRoom();
        long days = ChronoUnit.DAYS.between(detail.getStartDate(), detail.getEndDate());
        return new BookingDetailResponse(
                room.getRoomID(),
                room.getRoomNumber(),
                room.getRoomType() != null ? room.getRoomType().getRoomTypeName() : "",
                room.getRoomPricePerDay(),
                detail.getStartDate(),
                detail.getEndDate(),
                days,
                detail.getActualPrice()
        );
    }

    private BookingReservationResponse mapReservationToResponse(BookingReservation res) {
        if (res == null) return null;
        Customer c = res.getCustomer();
        CustomerResponse customerDto = new CustomerResponse(
                c.getCustomerID(),
                c.getCustomerFullName(),
                c.getTelephone(),
                c.getEmailAddress(),
                c.getCustomerBirthday(),
                c.getCustomerStatus()
        );

        List<BookingDetailResponse> details = res.getBookingDetails().stream()
                .map(this::mapDetailToResponse)
                .collect(Collectors.toList());

        return new BookingReservationResponse(
                res.getBookingReservationID(),
                res.getBookingDate(),
                res.getTotalPrice(),
                customerDto,
                res.getBookingStatus(),
                details
        );
    }

    @Override
    @Transactional
    public BookingReservationResponse createBooking(CreateBookingRequest request, UserPrincipal currentUser) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("A booking must contain at least one room");
        }

        // Determine customer
        Customer customer;
        if ("STAFF".equalsIgnoreCase(currentUser.getRole())) {
            if (request.getCustomerID() == null) {
                throw new BadRequestException("Customer ID is required when booking is created by staff");
            }
            customer = customerRepository.findById(request.getCustomerID())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerID()));
        } else {
            // Logged-in Customer: ALWAYS identify via JWT token, ignore customerID from request body
            customer = customerRepository.findById(currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer account not found"));
        }

        if (customer.getCustomerStatus() != null && customer.getCustomerStatus() != 1) {
            throw new BadRequestException("Customer account is deactivated and cannot place bookings");
        }

        // Create Reservation entity
        BookingReservation reservation = new BookingReservation();
        reservation.setBookingDate(LocalDate.now());
        reservation.setCustomer(customer);
        reservation.setBookingStatus(1); // 1 = Confirmed / Active
        reservation.setTotalPrice(BigDecimal.ZERO);

        // Pre-save to acquire reservation ID for composite key
        BookingReservation savedReservation = reservationRepository.save(reservation);

        BigDecimal grandTotal = BigDecimal.ZERO;
        List<BookingDetail> details = new ArrayList<>();
        Set<Integer> uniqueRoomIds = new HashSet<>();

        for (BookingDetailItemRequest item : request.getItems()) {
            if (item.getStartDate() == null || item.getEndDate() == null) {
                throw new BadRequestException("Start date and end date are required for every selected room");
            }

            if (!item.getStartDate().isBefore(item.getEndDate())) {
                throw new BadRequestException("Start date (" + item.getStartDate() + ") must be before end date (" + item.getEndDate() + ")");
            }

            // Check if duplicate room submitted in the same request
            if (!uniqueRoomIds.add(item.getRoomID())) {
                throw new BadRequestException("Duplicate room ID " + item.getRoomID() + " in the same booking request");
            }

            RoomInformation room = roomRepository.findById(item.getRoomID())
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + item.getRoomID()));

            if (room.getRoomStatus() != 1) {
                throw new BadRequestException("Room " + room.getRoomNumber() + " is currently unavailable for booking");
            }

            // Overlapping check against existing active bookings
            boolean overlaps = detailRepository.existsOverlappingBooking(
                    room.getRoomID(),
                    item.getStartDate(),
                    item.getEndDate()
            );

            if (overlaps) {
                throw new BadRequestException("Room " + room.getRoomNumber() + " is already booked between " +
                        item.getStartDate() + " and " + item.getEndDate());
            }

            long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());
            if (days <= 0) {
                throw new BadRequestException("Duration must be at least 1 day");
            }

            // Calculate actualPrice securely on backend
            BigDecimal actualPrice = room.getRoomPricePerDay().multiply(BigDecimal.valueOf(days));
            grandTotal = grandTotal.add(actualPrice);

            BookingDetail detail = new BookingDetail();
            detail.setId(new BookingDetailId(savedReservation.getBookingReservationID(), room.getRoomID()));
            detail.setBookingReservation(savedReservation);
            detail.setRoom(room);
            detail.setStartDate(item.getStartDate());
            detail.setEndDate(item.getEndDate());
            detail.setActualPrice(actualPrice);

            details.add(detail);
        }

        // Save all details
        detailRepository.saveAll(details);

        savedReservation.setTotalPrice(grandTotal);
        savedReservation.getBookingDetails().clear();
        savedReservation.getBookingDetails().addAll(details);
        savedReservation = reservationRepository.save(savedReservation);

        return mapReservationToResponse(savedReservation);
    }

    @Override
    public BookingReservationResponse getBookingById(Integer id, UserPrincipal currentUser) {
        BookingReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + id));

        // Ownership check: if Customer, ensure they own the reservation
        if ("CUSTOMER".equalsIgnoreCase(currentUser.getRole())) {
            if (!reservation.getCustomer().getCustomerID().equals(currentUser.getId())) {
                throw new ForbiddenException("You do not have permission to view this reservation");
            }
        }

        return mapReservationToResponse(reservation);
    }

    @Override
    public PageResponse<BookingReservationResponse> getAllBookings(String keyword, Integer status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("bookingReservationID").descending());
        Page<BookingReservation> bookingPage;
        if ((keyword != null && !keyword.trim().isEmpty()) || status != null) {
            bookingPage = reservationRepository.searchBookings(keyword != null ? keyword.trim() : null, status, pageable);
        } else {
            bookingPage = reservationRepository.findAll(pageable);
        }
        return PageResponse.from(bookingPage, this::mapReservationToResponse);
    }

    @Override
    public PageResponse<BookingReservationResponse> getCustomerBookings(Integer customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("bookingReservationID").descending());
        Page<BookingReservation> bookingPage = reservationRepository.findByCustomerCustomerIDOrderByBookingDateDesc(customerId, pageable);
        return PageResponse.from(bookingPage, this::mapReservationToResponse);
    }

    @Override
    @Transactional
    public BookingReservationResponse updateBookingStatus(Integer id, Integer status) {
        BookingReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + id));

        reservation.setBookingStatus(status);
        BookingReservation updated = reservationRepository.save(reservation);
        return mapReservationToResponse(updated);
    }
}

