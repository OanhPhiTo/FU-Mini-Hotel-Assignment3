package com.oanhtp.fuminihotel.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BookingDetailItemRequest {

    @NotNull(message = "Room ID is required")
    private Integer roomID;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    public BookingDetailItemRequest() {
    }

    public BookingDetailItemRequest(Integer roomID, LocalDate startDate, LocalDate endDate) {
        this.roomID = roomID;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Integer getRoomID() {
        return roomID;
    }

    public void setRoomID(Integer roomID) {
        this.roomID = roomID;
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
}

