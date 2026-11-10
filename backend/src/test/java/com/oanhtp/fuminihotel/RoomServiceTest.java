package com.oanhtp.fuminihotel;

import com.oanhtp.fuminihotel.entity.RoomInformation;
import com.oanhtp.fuminihotel.entity.RoomType;
import com.oanhtp.fuminihotel.repository.BookingDetailRepository;
import com.oanhtp.fuminihotel.repository.RoomInformationRepository;
import com.oanhtp.fuminihotel.repository.RoomTypeRepository;
import com.oanhtp.fuminihotel.service.impl.RoomServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomInformationRepository roomRepository;

    @Mock
    private RoomTypeRepository roomTypeRepository;

    @Mock
    private BookingDetailRepository bookingDetailRepository;

    @InjectMocks
    private RoomServiceImpl roomService;

    @Test
    @DisplayName("Room delete rule: Should physically delete room when never referenced in BookingDetail")
    void testDeleteRoomPhysicallyWhenNotBooked() {
        Integer roomId = 101;
        RoomType type = new RoomType(1, "Standard", "Desc", "Note");
        RoomInformation room = new RoomInformation(roomId, "101", "Desc", 2, type, 1, new BigDecimal("50.00"));

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));
        when(bookingDetailRepository.existsByIdRoomID(roomId)).thenReturn(false);

        roomService.deleteRoom(roomId);

        // Verify physical delete was called
        verify(roomRepository, times(1)).delete(room);
        verify(roomRepository, never()).save(room);
    }

    @Test
    @DisplayName("Room delete rule: Should update RoomStatus to 2 (Inactive) when room is referenced in BookingDetail")
    void testDeactivateRoomWhenReferencedInBookingDetail() {
        Integer roomId = 201;
        RoomType type = new RoomType(1, "Standard", "Desc", "Note");
        RoomInformation room = new RoomInformation(roomId, "201", "Desc", 2, type, 1, new BigDecimal("80.00"));

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));
        when(bookingDetailRepository.existsByIdRoomID(roomId)).thenReturn(true);

        roomService.deleteRoom(roomId);

        // Verify physical delete was NEVER called, and status was updated to 2
        verify(roomRepository, never()).delete(any());
        assertEquals(2, room.getRoomStatus());
        verify(roomRepository, times(1)).save(room);
    }
}

