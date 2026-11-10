package com.oanhtp.fuminihotel.dto.request;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class RegisterRequest {

    @NotBlank(message = "Customer full name is required")
    @Size(max = 150, message = "Customer full name must not exceed 150 characters")
    private String customerFullName;

    @NotBlank(message = "Telephone is required")
    @Pattern(regexp = "^[0-9+() -]{7,20}$", message = "Telephone number format is invalid")
    private String telephone;

    @NotBlank(message = "Email address is required")
    @Email(message = "Email address format is invalid")
    @Size(max = 150, message = "Email address must not exceed 150 characters")
    private String emailAddress;

    @Past(message = "Birthday must be in the past")
    private LocalDate customerBirthday;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;

    public RegisterRequest() {
    }

    public RegisterRequest(String customerFullName, String telephone, String emailAddress,
                           LocalDate customerBirthday, String password) {
        this.customerFullName = customerFullName;
        this.telephone = telephone;
        this.emailAddress = emailAddress;
        this.customerBirthday = customerBirthday;
        this.password = password;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

