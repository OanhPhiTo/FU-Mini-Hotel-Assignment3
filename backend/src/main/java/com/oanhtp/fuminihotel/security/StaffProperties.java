package com.oanhtp.fuminihotel.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StaffProperties {

    @Value("${app.staff.email:staff@fuminihotel.com}")
    private String email;

    @Value("${app.staff.password:Admin@123}")
    private String password;

    @Value("${app.staff.name:Hotel Administrator}")
    private String name;

    public StaffProperties() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

