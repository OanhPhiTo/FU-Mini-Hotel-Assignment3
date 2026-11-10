package com.oanhtp.fuminihotel.service.impl;

import com.oanhtp.fuminihotel.dto.response.BookingDetailResponse;
import com.oanhtp.fuminihotel.dto.response.BookingReservationResponse;
import com.oanhtp.fuminihotel.dto.response.CustomerResponse;
import com.oanhtp.fuminihotel.dto.response.DashboardStatsResponse;
import com.oanhtp.fuminihotel.entity.BookingDetail;
import com.oanhtp.fuminihotel.entity.BookingReservation;
import com.oanhtp.fuminihotel.entity.Customer;
import com.oanhtp.fuminihotel.entity.RoomInformation;
import com.oanhtp.fuminihotel.repository.BookingReservationRepository;
import com.oanhtp.fuminihotel.repository.CustomerRepository;
import com.oanhtp.fuminihotel.repository.RoomInformationRepository;
import com.oanhtp.fuminihotel.service.DashboardService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final CustomerRepository customerRepository;
    private final RoomInformationRepository roomRepository;
    private final BookingReservationRepository reservationRepository;

    public DashboardServiceImpl(CustomerRepository customerRepository,
                                RoomInformationRepository roomRepository,
                                BookingReservationRepository reservationRepository) {
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
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
    public DashboardStatsResponse getDashboardStats() {
        long totalCustomers = customerRepository.count();
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.findByRoomStatus(1).size();
        long totalBookings = reservationRepository.count();

        Page<BookingReservation> recentPage = reservationRepository.findAll(
                PageRequest.of(0, 5, Sort.by("bookingReservationID").descending())
        );
        List<BookingReservationResponse> recentBookings = recentPage.getContent().stream()
                .map(this::mapReservationToResponse)
                .collect(Collectors.toList());

        return new DashboardStatsResponse(
                totalCustomers,
                totalRooms,
                availableRooms,
                totalBookings,
                recentBookings
        );
    }
}

