package com.oanhtp.fuminihotel.config;

import com.oanhtp.fuminihotel.entity.*;
import com.oanhtp.fuminihotel.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoomTypeRepository roomTypeRepository;
    private final RoomInformationRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final BookingReservationRepository reservationRepository;
    private final BookingDetailRepository detailRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoomTypeRepository roomTypeRepository,
                           RoomInformationRepository roomRepository,
                           CustomerRepository customerRepository,
                           BookingReservationRepository reservationRepository,
                           BookingDetailRepository detailRepository,
                           PasswordEncoder passwordEncoder) {
        this.roomTypeRepository = roomTypeRepository;
        this.roomRepository = roomRepository;
        this.customerRepository = customerRepository;
        this.reservationRepository = reservationRepository;
        this.detailRepository = detailRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            seedRoomTypesAndRooms();
        } catch (Exception ex) {
            log.warn("Room/RoomType seeding skipped or already present: {}", ex.getMessage());
        }

        try {
            seedCustomers();
        } catch (Exception ex) {
            log.warn("Customer seeding skipped or already present: {}", ex.getMessage());
        }

        try {
            seedBookings();
        } catch (Exception ex) {
            log.warn("Booking seeding skipped or already present: {}", ex.getMessage());
        }

        log.info("FUMiniHotel initialization check completed successfully.");
    }

    @Transactional
    public void seedRoomTypesAndRooms() {
        if (roomTypeRepository.count() > 0) {
            return;
        }

        RoomType standard = roomTypeRepository.save(new RoomType(null, "Standard Room", "Cozy standard room with queen bed and city view", "Standard amenities"));
        RoomType deluxe = roomTypeRepository.save(new RoomType(null, "Deluxe Room", "Spacious deluxe room with king bed, balcony and ocean view", "Includes buffet breakfast"));
        RoomType suite = roomTypeRepository.save(new RoomType(null, "Executive Suite", "Luxurious suite with separate living area, work desk and jacuzzi", "VIP lounge access"));
        RoomType family = roomTypeRepository.save(new RoomType(null, "Family Suite", "Ideal for families with 2 bedrooms, kitchenette and smart TV", "Kids welcome kit"));

        roomRepository.save(new RoomInformation(null, "101", "Standard Double Room - 1st Floor", 2, standard, 1, new BigDecimal("45.00")));
        roomRepository.save(new RoomInformation(null, "102", "Standard Twin Room - 1st Floor", 2, standard, 1, new BigDecimal("45.00")));
        roomRepository.save(new RoomInformation(null, "201", "Deluxe Ocean View Room - 2nd Floor", 2, deluxe, 1, new BigDecimal("75.00")));
        roomRepository.save(new RoomInformation(null, "202", "Deluxe King Bed Room - 2nd Floor", 3, deluxe, 1, new BigDecimal("85.00")));
        roomRepository.save(new RoomInformation(null, "301", "Executive Penthouse Suite - 3rd Floor", 4, suite, 1, new BigDecimal("150.00")));
        roomRepository.save(new RoomInformation(null, "302", "Executive Business Suite - 3rd Floor", 2, suite, 1, new BigDecimal("130.00")));
        roomRepository.save(new RoomInformation(null, "401", "Family Garden Suite - 4th Floor", 5, family, 1, new BigDecimal("180.00")));
    }

    @Transactional
    public void seedCustomers() {
        if (customerRepository.count() > 0) {
            return;
        }

        Customer c1 = new Customer(
                null,
                "John Doe",
                "0901234567",
                "customer@fuminihotel.com",
                LocalDate.of(1995, 5, 20),
                1,
                passwordEncoder.encode("Customer@123")
        );

        Customer c2 = new Customer(
                null,
                "Alice Smith",
                "0912345678",
                "alice@gmail.com",
                LocalDate.of(1998, 8, 15),
                1,
                passwordEncoder.encode("Customer@123")
        );

        Customer c3 = new Customer(
                null,
                "Bob Johnson",
                "0987654321",
                "bob@gmail.com",
                LocalDate.of(1990, 12, 10),
                1,
                passwordEncoder.encode("Customer@123")
        );

        customerRepository.saveAll(List.of(c1, c2, c3));
    }

    @Transactional
    public void seedBookings() {
        if (reservationRepository.count() > 0) {
            return;
        }

        Customer customer = customerRepository.findByEmailAddress("customer@fuminihotel.com").orElse(null);
        List<RoomInformation> rooms = roomRepository.findAll();

        if (customer != null && !rooms.isEmpty()) {
            RoomInformation r101 = rooms.get(0);
            LocalDate start = LocalDate.now().plusDays(10);
            LocalDate end = LocalDate.now().plusDays(13);
            long days = ChronoUnit.DAYS.between(start, end);
            BigDecimal price = r101.getRoomPricePerDay().multiply(BigDecimal.valueOf(days));

            BookingReservation res = new BookingReservation();
            res.setBookingDate(LocalDate.now());
            res.setCustomer(customer);
            res.setBookingStatus(1);
            res.setTotalPrice(price);

            BookingReservation savedRes = reservationRepository.save(res);

            BookingDetail detail = new BookingDetail();
            detail.setId(new BookingDetailId(savedRes.getBookingReservationID(), r101.getRoomID()));
            detail.setBookingReservation(savedRes);
            detail.setRoom(r101);
            detail.setStartDate(start);
            detail.setEndDate(end);
            detail.setActualPrice(price);

            detailRepository.save(detail);
        }
    }
}

