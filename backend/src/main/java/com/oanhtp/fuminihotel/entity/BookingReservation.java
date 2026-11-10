package com.oanhtp.fuminihotel.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "BookingReservation")
public class BookingReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingReservationID")
    private Integer bookingReservationID;

    @Column(name = "BookingDate", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "TotalPrice", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalPrice = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CustomerID", nullable = false, foreignKey = @ForeignKey(name = "FK_BookingReservation_Customer"))
    private Customer customer;

    @Column(name = "BookingStatus", nullable = false)
    private Integer bookingStatus = 1; // 1: Confirmed/Active, 2: Completed, 3: Cancelled

    @OneToMany(mappedBy = "bookingReservation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<BookingDetail> bookingDetails = new ArrayList<>();

    public BookingReservation() {
    }

    public BookingReservation(Integer bookingReservationID, LocalDate bookingDate, BigDecimal totalPrice,
                              Customer customer, Integer bookingStatus) {
        this.bookingReservationID = bookingReservationID;
        this.bookingDate = bookingDate;
        this.totalPrice = totalPrice;
        this.customer = customer;
        this.bookingStatus = bookingStatus;
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

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Integer getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(Integer bookingStatus) {
        this.bookingStatus = bookingStatus;
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

    public void addBookingDetail(BookingDetail detail) {
        this.bookingDetails.add(detail);
        detail.setBookingReservation(this);
    }
}

