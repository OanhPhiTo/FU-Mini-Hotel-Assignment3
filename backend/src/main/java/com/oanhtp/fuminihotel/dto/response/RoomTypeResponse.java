package com.oanhtp.fuminihotel.dto.response;

public class RoomTypeResponse {

    private Integer roomTypeID;
    private String roomTypeName;
    private String typeDescription;
    private String typeNote;

    public RoomTypeResponse() {
    }

    public RoomTypeResponse(Integer roomTypeID, String roomTypeName, String typeDescription, String typeNote) {
        this.roomTypeID = roomTypeID;
        this.roomTypeName = roomTypeName;
        this.typeDescription = typeDescription;
        this.typeNote = typeNote;
    }

    public Integer getRoomTypeID() {
        return roomTypeID;
    }

    public void setRoomTypeID(Integer roomTypeID) {
        this.roomTypeID = roomTypeID;
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

