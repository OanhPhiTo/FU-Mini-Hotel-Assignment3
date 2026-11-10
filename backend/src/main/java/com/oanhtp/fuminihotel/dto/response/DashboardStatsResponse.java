package com.oanhtp.fuminihotel.dto.response;

import java.util.List;

public class DashboardStatsResponse {

    private long totalCustomers;
    private long totalRooms;
    private long availableRooms;
    private long totalBookings;
    private List<BookingReservationResponse> recentBookings;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long totalCustomers, long totalRooms, long availableRooms,
                                  long totalBookings, List<BookingReservationResponse> recentBookings) {
        this.totalCustomers = totalCustomers;
        this.totalRooms = totalRooms;
        this.availableRooms = availableRooms;
        this.totalBookings = totalBookings;
        this.recentBookings = recentBookings;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public long getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(long availableRooms) {
        this.availableRooms = availableRooms;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public List<BookingReservationResponse> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(List<BookingReservationResponse> recentBookings) {
        this.recentBookings = recentBookings;
    }
}

