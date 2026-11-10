package com.oanhtp.fuminihotel.service.impl;

import com.oanhtp.fuminihotel.dto.request.RoomTypeRequest;
import com.oanhtp.fuminihotel.dto.response.RoomTypeResponse;
import com.oanhtp.fuminihotel.entity.RoomType;
import com.oanhtp.fuminihotel.exception.BadRequestException;
import com.oanhtp.fuminihotel.exception.ConflictException;
import com.oanhtp.fuminihotel.exception.ResourceNotFoundException;
import com.oanhtp.fuminihotel.repository.RoomTypeRepository;
import com.oanhtp.fuminihotel.service.RoomTypeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomTypeServiceImpl implements RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    public RoomTypeServiceImpl(RoomTypeRepository roomTypeRepository) {
        this.roomTypeRepository = roomTypeRepository;
    }

    private RoomTypeResponse mapToResponse(RoomType roomType) {
        if (roomType == null) return null;
        return new RoomTypeResponse(
                roomType.getRoomTypeID(),
                roomType.getRoomTypeName(),
                roomType.getTypeDescription(),
                roomType.getTypeNote()
        );
    }

    @Override
    public List<RoomTypeResponse> getAllRoomTypes() {
        return roomTypeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomTypeResponse getRoomTypeById(Integer id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + id));
        return mapToResponse(roomType);
    }

    @Override
    @Transactional
    public RoomTypeResponse createRoomType(RoomTypeRequest request) {
        if (roomTypeRepository.existsByRoomTypeName(request.getRoomTypeName().trim())) {
            throw new ConflictException("Room type name '" + request.getRoomTypeName() + "' already exists");
        }

        RoomType roomType = new RoomType();
        roomType.setRoomTypeName(request.getRoomTypeName().trim());
        roomType.setTypeDescription(request.getTypeDescription());
        roomType.setTypeNote(request.getTypeNote());

        RoomType saved = roomTypeRepository.save(roomType);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public RoomTypeResponse updateRoomType(Integer id, RoomTypeRequest request) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + id));

        roomType.setRoomTypeName(request.getRoomTypeName().trim());
        roomType.setTypeDescription(request.getTypeDescription());
        roomType.setTypeNote(request.getTypeNote());

        RoomType updated = roomTypeRepository.save(roomType);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteRoomType(Integer id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + id));

        if (roomType.getRoomInformations() != null && !roomType.getRoomInformations().isEmpty()) {
            throw new BadRequestException("Cannot delete room type because rooms are assigned to it");
        }

        roomTypeRepository.delete(roomType);
    }
}

