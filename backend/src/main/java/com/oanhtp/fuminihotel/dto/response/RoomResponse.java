package com.oanhtp.fuminihotel.dto.response;

import java.math.BigDecimal;

public class RoomResponse {

    private Integer roomID;
    private String roomNumber;
    private String roomDetailDescription;
    private Integer roomMaxCapacity;
    private RoomTypeResponse roomType;
    private Integer roomStatus;
    private BigDecimal roomPricePerDay;

    public RoomResponse() {
    }

    public RoomResponse(Integer roomID, String roomNumber, String roomDetailDescription,
                        Integer roomMaxCapacity, RoomTypeResponse roomType, Integer roomStatus,
                        BigDecimal roomPricePerDay) {
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

    public RoomTypeResponse getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomTypeResponse roomType) {
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
}

