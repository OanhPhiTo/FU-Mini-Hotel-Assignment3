package com.oanhtp.fuminihotel.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingDetailResponse {

    private Integer roomID;
    private String roomNumber;
    private String roomTypeName;
    private BigDecimal roomPricePerDay;
    private LocalDate startDate;
    private LocalDate endDate;
    private long numberOfDays;
    private BigDecimal actualPrice;

    public BookingDetailResponse() {
    }

    public BookingDetailResponse(Integer roomID, String roomNumber, String roomTypeName,
                                 BigDecimal roomPricePerDay, LocalDate startDate, LocalDate endDate,
                                 long numberOfDays, BigDecimal actualPrice) {
        this.roomID = roomID;
        this.roomNumber = roomNumber;
        this.roomTypeName = roomTypeName;
        this.roomPricePerDay = roomPricePerDay;
        this.startDate = startDate;
        this.endDate = endDate;
        this.numberOfDays = numberOfDays;
        this.actualPrice = actualPrice;
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

    public String getRoomTypeName() {
        return roomTypeName;
    }

    public void setRoomTypeName(String roomTypeName) {
        this.roomTypeName = roomTypeName;
    }

    public BigDecimal getRoomPricePerDay() {
        return roomPricePerDay;
    }

    public void setRoomPricePerDay(BigDecimal roomPricePerDay) {
        this.roomPricePerDay = roomPricePerDay;
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

    public long getNumberOfDays() {
        return numberOfDays;
    }

    public void setNumberOfDays(long numberOfDays) {
        this.numberOfDays = numberOfDays;
    }

    public BigDecimal getActualPrice() {
        return actualPrice;
    }

    public void setActualPrice(BigDecimal actualPrice) {
        this.actualPrice = actualPrice;
    }
}

