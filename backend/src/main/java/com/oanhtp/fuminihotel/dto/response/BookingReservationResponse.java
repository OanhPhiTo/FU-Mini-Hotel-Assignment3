package com.oanhtp.fuminihotel.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class BookingReservationResponse {

    private Integer bookingReservationID;
    private LocalDate bookingDate;
    private BigDecimal totalPrice;
    private CustomerResponse customer;
    private Integer bookingStatus;
    private String bookingStatusText;
    private List<BookingDetailResponse> bookingDetails = new ArrayList<>();

    public BookingReservationResponse() {
    }

    public BookingReservationResponse(Integer bookingReservationID, LocalDate bookingDate,
                                      BigDecimal totalPrice, CustomerResponse customer,
                                      Integer bookingStatus, List<BookingDetailResponse> bookingDetails) {
        this.bookingReservationID = bookingReservationID;
        this.bookingDate = bookingDate;
        this.totalPrice = totalPrice;
        this.customer = customer;
        this.bookingStatus = bookingStatus;
        this.bookingStatusText = resolveStatusText(bookingStatus);
        this.bookingDetails = bookingDetails;
    }

    private static String resolveStatusText(Integer status) {
        if (status == null) return "Unknown";
        return switch (status) {
            case 1 -> "Confirmed";
            case 2 -> "Completed";
            case 3 -> "Cancelled";
            default -> "Status " + status;
        };
    }

    public Integer getBookingReservationID() {
        return bookingReservationID;
    }

    public void setBookingReservationID(Integer bookingReservationID) {
        this.bookingReservationID = bookingReservationID;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public CustomerResponse getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerResponse customer) {
        this.customer = customer;
    }

    public Integer getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(Integer bookingStatus) {
        this.bookingStatus = bookingStatus;
        this.bookingStatusText = resolveStatusText(bookingStatus);
    }

    public String getBookingStatusText() {
        return bookingStatusText;
    }

    public void setBookingStatusText(String bookingStatusText) {
        this.bookingStatusText = bookingStatusText;
    }

    public List<BookingDetailResponse> getBookingDetails() {
        return bookingDetails;
    }

    public void setBookingDetails(List<BookingDetailResponse> bookingDetails) {
        this.bookingDetails = bookingDetails;
    }
}

