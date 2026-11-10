package com.oanhtp.fuminihotel.repository;

import com.oanhtp.fuminihotel.entity.BookingDetail;
import com.oanhtp.fuminihotel.entity.BookingDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetailId> {

    boolean existsByIdRoomID(Integer roomID);

    List<BookingDetail> findByIdBookingReservationID(Integer bookingReservationID);

    /**
     * Checks if a room has an active booking that overlaps with [startDate, endDate].
     * An overlap occurs if (startDate < existing.endDate) AND (endDate > existing.startDate).
     * Booking status 3 means Cancelled, so cancelled bookings are excluded.
     */
    @Query("SELECT COUNT(bd) > 0 FROM BookingDetail bd " +
           "WHERE bd.room.roomID = :roomID " +
           "AND bd.bookingReservation.bookingStatus <> 3 " +
           "AND bd.startDate < :endDate " +
           "AND bd.endDate > :startDate")
    boolean existsOverlappingBooking(@Param("roomID") Integer roomID,
                                    @Param("startDate") LocalDate startDate,
                                    @Param("endDate") LocalDate endDate);

    /**
     * Same as above, but excluding the reservation currently being updated.
     */
    @Query("SELECT COUNT(bd) > 0 FROM BookingDetail bd " +
           "WHERE bd.room.roomID = :roomID " +
           "AND bd.bookingReservation.bookingReservationID <> :reservationID " +
           "AND bd.bookingReservation.bookingStatus <> 3 " +
           "AND bd.startDate < :endDate " +
           "AND bd.endDate > :startDate")
    boolean existsOverlappingBookingExcludingReservation(@Param("roomID") Integer roomID,
                                                        @Param("reservationID") Integer reservationID,
                                                        @Param("startDate") LocalDate startDate,
                                                        @Param("endDate") LocalDate endDate);
}

