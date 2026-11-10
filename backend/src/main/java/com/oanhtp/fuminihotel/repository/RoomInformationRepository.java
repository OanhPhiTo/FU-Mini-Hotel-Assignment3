package com.oanhtp.fuminihotel.repository;

import com.oanhtp.fuminihotel.entity.RoomInformation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomInformationRepository extends JpaRepository<RoomInformation, Integer> {

    Optional<RoomInformation> findByRoomNumber(String roomNumber);

    boolean existsByRoomNumber(String roomNumber);

    boolean existsByRoomNumberAndRoomIDNot(String roomNumber, Integer roomID);

    List<RoomInformation> findByRoomStatus(Integer roomStatus);

    @Query("SELECT r FROM RoomInformation r WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.roomDetailDescription) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.roomType.roomTypeName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:roomTypeId IS NULL OR r.roomType.roomTypeID = :roomTypeId) AND " +
           "(:roomStatus IS NULL OR r.roomStatus = :roomStatus) AND " +
           "(:maxPrice IS NULL OR r.roomPricePerDay <= :maxPrice)")
    Page<RoomInformation> searchRooms(@Param("keyword") String keyword,
                                      @Param("roomTypeId") Integer roomTypeId,
                                      @Param("roomStatus") Integer roomStatus,
                                      @Param("maxPrice") BigDecimal maxPrice,
                                      Pageable pageable);
}

