package com.oanhtp.fuminihotel.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "RoomInformation", uniqueConstraints = {
        @UniqueConstraint(name = "UQ_RoomInformation_RoomNumber", columnNames = "RoomNumber")
})
public class RoomInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID")
    private Integer roomID;

    @Column(name = "RoomNumber", nullable = false, length = 50, unique = true)
    private String roomNumber;

    @Column(name = "RoomDetailDescription", length = 1000)
    private String roomDetailDescription;

    @Column(name = "RoomMaxCapacity", nullable = false)
    private Integer roomMaxCapacity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "RoomTypeID", nullable = false, foreignKey = @ForeignKey(name = "FK_RoomInformation_RoomType"))
    private RoomType roomType;

    @Column(name = "RoomStatus", nullable = false)
    private Integer roomStatus = 1; // 1: Active, 2: Inactive/Maintenance

    @Column(name = "RoomPricePerDay", nullable = false, precision = 18, scale = 2)
    private BigDecimal roomPricePerDay;

    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<BookingDetail> bookingDetails = new ArrayList<>();

    public RoomInformation() {
    }

    public RoomInformation(Integer roomID, String roomNumber, String roomDetailDescription,
                           Integer roomMaxCapacity, RoomType roomType, Integer roomStatus, BigDecimal roomPricePerDay) {
        this.roomID = roomID;
        this.roomNumber = roomNumber;
        this.roomDetailDescription = roomDetailDescription;
        this.roomMaxCapacity = roomMaxCapacity;
        this.roomType = roomType;
        this.roomStatus = roomStatus;
        this.roomPricePerDay = roomPricePerDay;
    }

    public Integer getRoomID() {
        return roomID;
    }

    public void setRoomID(Integer roomID) {
        this.roomID = roomID;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomDetailDescription() {
        return roomDetailDescription;
    }

    public void setRoomDetailDescription(String roomDetailDescription) {
        this.roomDetailDescription = roomDetailDescription;
    }

    public Integer getRoomMaxCapacity() {
        return roomMaxCapacity;
    }

    public void setRoomMaxCapacity(Integer roomMaxCapacity) {
        this.roomMaxCapacity = roomMaxCapacity;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public Integer getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(Integer roomStatus) {
        this.roomStatus = roomStatus;
    }

    public BigDecimal getRoomPricePerDay() {
        return roomPricePerDay;
    }

    public void setRoomPricePerDay(BigDecimal roomPricePerDay) {
        this.roomPricePerDay = roomPricePerDay;
    }

    public List<BookingDetail> getBookingDetails() {
        return bookingDetails;
    }

    public void setBookingDetails(List<BookingDetail> bookingDetails) {
        this.bookingDetails.clear();
        if (bookingDetails != null) {
            this.bookingDetails.addAll(bookingDetails);
        }
    }
}

