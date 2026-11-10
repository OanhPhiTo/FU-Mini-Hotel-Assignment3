package com.oanhtp.fuminihotel.dto.response;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private String email;
    private String fullName;
    private String role; // "STAFF" or "CUSTOMER"
    private Integer customerId; // null for Staff

    public AuthResponse() {
    }

    public AuthResponse(String token, String email, String fullName, String role, Integer customerId) {
        this.token = token;
        this.tokenType = "Bearer";
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.customerId = customerId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }
}

