package com.oanhtp.fuminihotel.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Customer", uniqueConstraints = {
        @UniqueConstraint(name = "UQ_Customer_EmailAddress", columnNames = "EmailAddress")
})
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerID")
    private Integer customerID;

    @Column(name = "CustomerFullName", nullable = false, length = 150)
    private String customerFullName;

    @Column(name = "Telephone", length = 20)
    private String telephone;

    @Column(name = "EmailAddress", nullable = false, length = 150, unique = true)
    private String emailAddress;

    @Column(name = "CustomerBirthday")
    private LocalDate customerBirthday;

    @Column(name = "CustomerStatus", nullable = false)
    private Integer customerStatus = 1; // 1: Active, 2: Inactive

    @Column(name = "Password", nullable = false, length = 255)
    private String password;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<BookingReservation> bookingReservations = new ArrayList<>();

    public Customer() {
    }

    public Customer(Integer customerID, String customerFullName, String telephone, String emailAddress,
                    LocalDate customerBirthday, Integer customerStatus, String password) {
        this.customerID = customerID;
        this.customerFullName = customerFullName;
        this.telephone = telephone;
        this.emailAddress = emailAddress;
        this.customerBirthday = customerBirthday;
        this.customerStatus = customerStatus;
        this.password = password;
    }

    public Integer getCustomerID() {
        return customerID;
    }

    public void setCustomerID(Integer customerID) {
        this.customerID = customerID;
    }

    public String getCustomerFullName() {
        return customerFullName;
    }

    public void setCustomerFullName(String customerFullName) {
        this.customerFullName = customerFullName;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public LocalDate getCustomerBirthday() {
        return customerBirthday;
    }

    public void setCustomerBirthday(LocalDate customerBirthday) {
        this.customerBirthday = customerBirthday;
    }

    public Integer getCustomerStatus() {
        return customerStatus;
    }

    public void setCustomerStatus(Integer customerStatus) {
        this.customerStatus = customerStatus;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<BookingReservation> getBookingReservations() {
        return bookingReservations;
    }

    public void setBookingReservations(List<BookingReservation> bookingReservations) {
        this.bookingReservations.clear();
        if (bookingReservations != null) {
            this.bookingReservations.addAll(bookingReservations);
        }
    }
}

