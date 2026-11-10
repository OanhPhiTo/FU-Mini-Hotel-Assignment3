package com.oanhtp.fuminihotel.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CreateBookingRequest {

    // For Staff creating booking on behalf of customer; ignored for customer self-booking
    private Integer customerID;

    @NotEmpty(message = "Booking must contain at least one room")
    @Valid
    private List<BookingDetailItemRequest> items;

    public CreateBookingRequest() {
    }

    public CreateBookingRequest(Integer customerID, List<BookingDetailItemRequest> items) {
        this.customerID = customerID;
        this.items = items;
    }

    public Integer getCustomerID() {
        return customerID;
    }

    public void setCustomerID(Integer customerID) {
        this.customerID = customerID;
    }

    public List<BookingDetailItemRequest> getItems() {
        return items;
    }

    public void setItems(List<BookingDetailItemRequest> items) {
        this.items = items;
    }
}

