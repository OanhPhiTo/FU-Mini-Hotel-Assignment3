package com.oanhtp.fuminihotel.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class UpdateBookingStatusRequest {

    @NotNull(message = "Booking status is required")
    @Min(value = 1, message = "Status: 1 (Confirmed/Active), 2 (Completed), 3 (Cancelled)")
    @Max(value = 3, message = "Status: 1 (Confirmed/Active), 2 (Completed), 3 (Cancelled)")
    private Integer bookingStatus;

    public UpdateBookingStatusRequest() {
    }

    public UpdateBookingStatusRequest(Integer bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public Integer getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(Integer bookingStatus) {
        this.bookingStatus = bookingStatus;
    }
}

