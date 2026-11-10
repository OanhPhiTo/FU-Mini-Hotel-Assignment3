package com.oanhtp.fuminihotel.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "RoomType")
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomTypeID")
    private Integer roomTypeID;

    @Column(name = "RoomTypeName", nullable = false, length = 100)
    private String roomTypeName;

    @Column(name = "TypeDescription", length = 500)
    private String typeDescription;

    @Column(name = "TypeNote", length = 500)
    private String typeNote;

    @OneToMany(mappedBy = "roomType", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<RoomInformation> roomInformations = new ArrayList<>();

    public RoomType() {
    }

    public RoomType(Integer roomTypeID, String roomTypeName, String typeDescription, String typeNote) {
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

    public List<RoomInformation> getRoomInformations() {
        return roomInformations;
    }

    public void setRoomInformations(List<RoomInformation> roomInformations) {
        this.roomInformations = roomInformations;
    }
}

