package com.oanhtp.fuminihotel.service;

import com.oanhtp.fuminihotel.dto.request.RoomCreateRequest;
import com.oanhtp.fuminihotel.dto.request.RoomUpdateRequest;
import com.oanhtp.fuminihotel.dto.response.PageResponse;
import com.oanhtp.fuminihotel.dto.response.RoomResponse;

import java.math.BigDecimal;
import java.util.List;

public interface RoomService {

    PageResponse<RoomResponse> getRooms(String keyword, Integer roomTypeId, Integer roomStatus, BigDecimal maxPrice, int page, int size);

    List<RoomResponse> getAllAvailableRooms();

    RoomResponse getRoomById(Integer id);

    RoomResponse createRoom(RoomCreateRequest request);

    RoomResponse updateRoom(Integer id, RoomUpdateRequest request);

    void deleteRoom(Integer id);
}

