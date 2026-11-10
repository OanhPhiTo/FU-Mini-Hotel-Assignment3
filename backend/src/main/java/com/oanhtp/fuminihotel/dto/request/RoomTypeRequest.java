package com.oanhtp.fuminihotel.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RoomTypeRequest {

    @NotBlank(message = "Room type name is required")
    @Size(max = 100, message = "Room type name must not exceed 100 characters")
    private String roomTypeName;

    @Size(max = 500, message = "Type description must not exceed 500 characters")
    private String typeDescription;

    @Size(max = 500, message = "Type note must not exceed 500 characters")
    private String typeNote;

    public RoomTypeRequest() {
    }

    public RoomTypeRequest(String roomTypeName, String typeDescription, String typeNote) {
        this.roomTypeName = roomTypeName;
        this.typeDescription = typeDescription;
        this.typeNote = typeNote;
    }

    public String getRoomTypeName() {
        return roomTypeName;
    }

    public void setRoomTypeName(String roomTypeName) {
        this.roomTypeName = roomTypeName;
    }

    public String getTypeDescription() {
        return typeDescription;
    }

    public void setTypeDescription(String typeDescription) {
        this.typeDescription = typeDescription;
    }

    public String getTypeNote() {
        return typeNote;
    }

    public void setTypeNote(String typeNote) {
        this.typeNote = typeNote;
    }
}

