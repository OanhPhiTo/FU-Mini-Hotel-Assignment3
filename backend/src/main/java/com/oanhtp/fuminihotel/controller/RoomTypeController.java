package com.oanhtp.fuminihotel.controller;

import com.oanhtp.fuminihotel.dto.request.RoomTypeRequest;
import com.oanhtp.fuminihotel.dto.response.ApiResponse;
import com.oanhtp.fuminihotel.dto.response.RoomTypeResponse;
import com.oanhtp.fuminihotel.service.RoomTypeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    public RoomTypeController(RoomTypeService roomTypeService) {
        this.roomTypeService = roomTypeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomTypeResponse>>> getAllRoomTypes() {
        List<RoomTypeResponse> list = roomTypeService.getAllRoomTypes();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomTypeResponse>> getRoomTypeById(@PathVariable Integer id) {
        RoomTypeResponse response = roomTypeService.getRoomTypeById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<RoomTypeResponse>> createRoomType(@Valid @RequestBody RoomTypeRequest request) {
        RoomTypeResponse response = roomTypeService.createRoomType(request);
        return new ResponseEntity<>(ApiResponse.ok("Room type created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<RoomTypeResponse>> updateRoomType(@PathVariable Integer id,
                                                                        @Valid @RequestBody RoomTypeRequest request) {
        RoomTypeResponse response = roomTypeService.updateRoomType(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Room type updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Void> deleteRoomType(@PathVariable Integer id) {
        roomTypeService.deleteRoomType(id);
        return ResponseEntity.noContent().build();
    }
}

