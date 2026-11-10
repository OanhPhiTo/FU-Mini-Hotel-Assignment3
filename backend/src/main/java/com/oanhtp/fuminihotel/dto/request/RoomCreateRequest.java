package com.oanhtp.fuminihotel.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class RoomCreateRequest {

    @NotBlank(message = "Room number is required")
    @Size(max = 50, message = "Room number must not exceed 50 characters")
    private String roomNumber;

    @Size(max = 1000, message = "Detail description must not exceed 1000 characters")
    private String roomDetailDescription;

    @NotNull(message = "Room max capacity is required")
    @Min(value = 1, message = "Max capacity must be at least 1")
    private Integer roomMaxCapacity;

    @NotNull(message = "Room type ID is required")
    private Integer roomTypeID;

    @NotNull(message = "Room status is required")
    @Min(value = 1, message = "Status must be 1 (Active) or 2 (Inactive)")
    @Max(value = 2, message = "Status must be 1 (Active) or 2 (Inactive)")
    private Integer roomStatus = 1;

    @NotNull(message = "Room price per day is required")
    @DecimalMin(value = "0.01", message = "Price per day must be greater than 0")
    private BigDecimal roomPricePerDay;

    public RoomCreateRequest() {
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

    public Integer getRoomTypeID() {
        return roomTypeID;
    }

    public void setRoomTypeID(Integer roomTypeID) {
        this.roomTypeID = roomTypeID;
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
}

