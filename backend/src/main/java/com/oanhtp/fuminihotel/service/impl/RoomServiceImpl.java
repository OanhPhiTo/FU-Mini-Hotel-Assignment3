package com.oanhtp.fuminihotel.service.impl;

import com.oanhtp.fuminihotel.dto.request.RoomCreateRequest;
import com.oanhtp.fuminihotel.dto.request.RoomUpdateRequest;
import com.oanhtp.fuminihotel.dto.response.PageResponse;
import com.oanhtp.fuminihotel.dto.response.RoomResponse;
import com.oanhtp.fuminihotel.dto.response.RoomTypeResponse;
import com.oanhtp.fuminihotel.entity.RoomInformation;
import com.oanhtp.fuminihotel.entity.RoomType;
import com.oanhtp.fuminihotel.exception.BadRequestException;
import com.oanhtp.fuminihotel.exception.ConflictException;
import com.oanhtp.fuminihotel.exception.ResourceNotFoundException;
import com.oanhtp.fuminihotel.repository.BookingDetailRepository;
import com.oanhtp.fuminihotel.repository.RoomInformationRepository;
import com.oanhtp.fuminihotel.repository.RoomTypeRepository;
import com.oanhtp.fuminihotel.service.RoomService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomInformationRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BookingDetailRepository bookingDetailRepository;

    public RoomServiceImpl(RoomInformationRepository roomRepository,
                           RoomTypeRepository roomTypeRepository,
                           BookingDetailRepository bookingDetailRepository) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.bookingDetailRepository = bookingDetailRepository;
    }

    private RoomResponse mapToResponse(RoomInformation room) {
        if (room == null) return null;
        RoomTypeResponse typeDto = null;
        if (room.getRoomType() != null) {
            typeDto = new RoomTypeResponse(
                    room.getRoomType().getRoomTypeID(),
                    room.getRoomType().getRoomTypeName(),
                    room.getRoomType().getTypeDescription(),
                    room.getRoomType().getTypeNote()
            );
        }
        return new RoomResponse(
                room.getRoomID(),
                room.getRoomNumber(),
                room.getRoomDetailDescription(),
                room.getRoomMaxCapacity(),
                typeDto,
                room.getRoomStatus(),
                room.getRoomPricePerDay()
        );
    }

    @Override
    public PageResponse<RoomResponse> getRooms(String keyword, Integer roomTypeId, Integer roomStatus,
                                              BigDecimal maxPrice, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("roomID").ascending());
        Page<RoomInformation> roomPage = roomRepository.searchRooms(
                keyword != null ? keyword.trim() : null,
                roomTypeId,
                roomStatus,
                maxPrice,
                pageable
        );
        return PageResponse.from(roomPage, this::mapToResponse);
    }

    @Override
    public List<RoomResponse> getAllAvailableRooms() {
        return roomRepository.findByRoomStatus(1).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomResponse getRoomById(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
        return mapToResponse(room);
    }

    @Override
    @Transactional
    public RoomResponse createRoom(RoomCreateRequest request) {
        String roomNumber = request.getRoomNumber().trim();

        if (roomRepository.existsByRoomNumber(roomNumber)) {
            throw new ConflictException("Room number '" + roomNumber + "' already exists");
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeID())
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + request.getRoomTypeID()));

        RoomInformation room = new RoomInformation();
        room.setRoomNumber(roomNumber);
        room.setRoomDetailDescription(request.getRoomDetailDescription());
        room.setRoomMaxCapacity(request.getRoomMaxCapacity());
        room.setRoomType(roomType);
        room.setRoomStatus(request.getRoomStatus() != null ? request.getRoomStatus() : 1);
        room.setRoomPricePerDay(request.getRoomPricePerDay());

        RoomInformation saved = roomRepository.save(room);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public RoomResponse updateRoom(Integer id, RoomUpdateRequest request) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

        String roomNumber = request.getRoomNumber().trim();

        if (roomRepository.existsByRoomNumberAndRoomIDNot(roomNumber, id)) {
            throw new ConflictException("Room number '" + roomNumber + "' is already in use by another room");
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeID())
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + request.getRoomTypeID()));

        room.setRoomNumber(roomNumber);
        room.setRoomDetailDescription(request.getRoomDetailDescription());
        room.setRoomMaxCapacity(request.getRoomMaxCapacity());
        room.setRoomType(roomType);
        room.setRoomStatus(request.getRoomStatus());
        room.setRoomPricePerDay(request.getRoomPricePerDay());

        RoomInformation updated = roomRepository.save(room);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteRoom(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

        // CRITICAL BUSINESS RULE:
        // If Room has been referenced in BookingDetail, do NOT physically delete; set RoomStatus = 2 (Inactive).
        // If Room has never been referenced in BookingDetail, physically delete from DB.
        boolean referencedInBooking = bookingDetailRepository.existsByIdRoomID(id);

        if (referencedInBooking) {
            room.setRoomStatus(2); // Set status to Inactive / Unavailable
            roomRepository.save(room);
        } else {
            roomRepository.delete(room);
        }
    }
}

