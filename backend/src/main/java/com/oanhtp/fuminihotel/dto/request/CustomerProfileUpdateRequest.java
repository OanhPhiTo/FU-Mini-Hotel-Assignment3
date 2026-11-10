package com.oanhtp.fuminihotel.dto.request;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class CustomerProfileUpdateRequest {

    @NotBlank(message = "Customer full name is required")
    @Size(max = 150, message = "Customer full name must not exceed 150 characters")
    private String customerFullName;

    @NotBlank(message = "Telephone is required")
    @Pattern(regexp = "^[0-9+() -]{7,20}$", message = "Telephone number format is invalid")
    private String telephone;

    @Past(message = "Birthday must be in the past")
    private LocalDate customerBirthday;

    @Size(min = 6, max = 100, message = "If updating password, it must be between 6 and 100 characters")
    private String password;

    public CustomerProfileUpdateRequest() {
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

    public LocalDate getCustomerBirthday() {
        return customerBirthday;
    }

    public void setCustomerBirthday(LocalDate customerBirthday) {
        this.customerBirthday = customerBirthday;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

