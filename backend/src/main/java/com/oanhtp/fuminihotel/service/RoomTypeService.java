package com.oanhtp.fuminihotel.service;

import com.oanhtp.fuminihotel.dto.request.RoomTypeRequest;
import com.oanhtp.fuminihotel.dto.response.RoomTypeResponse;
import java.util.List;

public interface RoomTypeService {

    List<RoomTypeResponse> getAllRoomTypes();

    RoomTypeResponse getRoomTypeById(Integer id);

    RoomTypeResponse createRoomType(RoomTypeRequest request);

    RoomTypeResponse updateRoomType(Integer id, RoomTypeRequest request);

    void deleteRoomType(Integer id);
}

