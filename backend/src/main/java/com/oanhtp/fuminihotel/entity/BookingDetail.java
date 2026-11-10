package com.oanhtp.fuminihotel.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "BookingDetail")
public class BookingDetail {

    @EmbeddedId
    private BookingDetailId id = new BookingDetailId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bookingReservationID")
    @JoinColumn(name = "BookingReservationID", nullable = false, foreignKey = @ForeignKey(name = "FK_BookingDetail_BookingReservation"))
    @JsonIgnore
    private BookingReservation bookingReservation;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("roomID")
    @JoinColumn(name = "RoomID", nullable = false, foreignKey = @ForeignKey(name = "FK_BookingDetail_RoomInformation"))
    private RoomInformation room;

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "ActualPrice", nullable = false, precision = 18, scale = 2)
    private BigDecimal actualPrice;

    public BookingDetail() {
    }

    public BookingDetail(BookingReservation bookingReservation, RoomInformation room,
                         LocalDate startDate, LocalDate endDate, BigDecimal actualPrice) {
        this.bookingReservation = bookingReservation;
        this.room = room;
        this.startDate = startDate;
        this.endDate = endDate;
        this.actualPrice = actualPrice;
        if (bookingReservation != null && bookingReservation.getBookingReservationID() != null &&
            room != null && room.getRoomID() != null) {
            this.id = new BookingDetailId(bookingReservation.getBookingReservationID(), room.getRoomID());
        }
    }

    public BookingDetailId getId() {
        return id;
    }

    public void setId(BookingDetailId id) {
        this.id = id;
    }

    public BookingReservation getBookingReservation() {
        return bookingReservation;
    }

    public void setBookingReservation(BookingReservation bookingReservation) {
        this.bookingReservation = bookingReservation;
        if (bookingReservation != null && bookingReservation.getBookingReservationID() != null) {
            if (this.id == null) {
                this.id = new BookingDetailId();
            }
            this.id.setBookingReservationID(bookingReservation.getBookingReservationID());
        }
    }

    public RoomInformation getRoom() {
        return room;
    }

    public void setRoom(RoomInformation room) {
        this.room = room;
        if (room != null && room.getRoomID() != null) {
            if (this.id == null) {
                this.id = new BookingDetailId();
            }
            this.id.setRoomID(room.getRoomID());
        }
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getActualPrice() {
        return actualPrice;
    }

    public void setActualPrice(BigDecimal actualPrice) {
        this.actualPrice = actualPrice;
    }
}

