package com.oanhtp.fuminihotel.repository;

import com.oanhtp.fuminihotel.entity.BookingReservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingReservationRepository extends JpaRepository<BookingReservation, Integer> {

    List<BookingReservation> findByCustomerCustomerIDOrderByBookingDateDesc(Integer customerID);

    Page<BookingReservation> findByCustomerCustomerIDOrderByBookingDateDesc(Integer customerID, Pageable pageable);

    boolean existsByCustomerCustomerID(Integer customerID);

    @Query("SELECT b FROM BookingReservation b WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(b.customer.customerFullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.customer.emailAddress) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "b.customer.telephone LIKE CONCAT('%', :keyword, '%')) AND " +
           "(:status IS NULL OR b.bookingStatus = :status)")
    Page<BookingReservation> searchBookings(@Param("keyword") String keyword,
                                           @Param("status") Integer status,
                                           Pageable pageable);
}

