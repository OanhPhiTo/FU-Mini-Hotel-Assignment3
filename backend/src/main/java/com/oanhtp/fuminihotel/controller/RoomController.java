package com.oanhtp.fuminihotel.controller;

import com.oanhtp.fuminihotel.dto.request.RoomCreateRequest;
import com.oanhtp.fuminihotel.dto.request.RoomUpdateRequest;
import com.oanhtp.fuminihotel.dto.response.ApiResponse;
import com.oanhtp.fuminihotel.dto.response.PageResponse;
import com.oanhtp.fuminihotel.dto.response.RoomResponse;
import com.oanhtp.fuminihotel.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<RoomResponse>>> getRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer roomTypeId,
            @RequestParam(required = false) Integer roomStatus,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<RoomResponse> rooms = roomService.getRooms(keyword, roomTypeId, roomStatus, maxPrice, page, size);
        return ResponseEntity.ok(ApiResponse.ok(rooms));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<RoomResponse>>> searchRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer roomTypeId,
            @RequestParam(required = false) Integer roomStatus,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<RoomResponse> rooms = roomService.getRooms(keyword, roomTypeId, roomStatus, maxPrice, page, size);
        return ResponseEntity.ok(ApiResponse.ok(rooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoomById(@PathVariable Integer id) {
        RoomResponse room = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.ok(room));
    }

    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<RoomResponse>> createRoom(@Valid @RequestBody RoomCreateRequest request) {
        RoomResponse response = roomService.createRoom(request);
        return new ResponseEntity<>(ApiResponse.ok("Room created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<RoomResponse>> updateRoom(@PathVariable Integer id,
                                                                @Valid @RequestBody RoomUpdateRequest request) {
        RoomResponse response = roomService.updateRoom(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Room updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(@PathVariable Integer id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok(ApiResponse.ok("Room deleted / deactivated successfully", null));
    }
}

