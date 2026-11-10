package com.oanhtp.fuminihotel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class BookingDetailId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "BookingReservationID")
    private Integer bookingReservationID;

    @Column(name = "RoomID")
    private Integer roomID;

    public BookingDetailId() {
    }

    public BookingDetailId(Integer bookingReservationID, Integer roomID) {
        this.bookingReservationID = bookingReservationID;
        this.roomID = roomID;
    }

    public Integer getBookingReservationID() {
        return bookingReservationID;
    }

    public void setBookingReservationID(Integer bookingReservationID) {
        this.bookingReservationID = bookingReservationID;
    }

    public Integer getRoomID() {
        return roomID;
    }

    public void setRoomID(Integer roomID) {
        this.roomID = roomID;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BookingDetailId that = (BookingDetailId) o;
        return Objects.equals(bookingReservationID, that.bookingReservationID) &&
                Objects.equals(roomID, that.roomID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(bookingReservationID, roomID);
    }
}

