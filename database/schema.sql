-- =====================================================================
-- DATABASE SCHEMA FOR FUMiniHotelSystem (Assignment 03)
-- Project: A3OanhTP_SE1910
-- Target DBMS: Microsoft SQL Server 2016+
-- =====================================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'A3OanhTP_SE1910')
BEGIN
    CREATE DATABASE [A3OanhTP_SE1910];
END
GO

USE [A3OanhTP_SE1910];
GO

-- 1. Drop existing tables if re-running script (in proper FK order)
-- Supports both PascalCase and lowercase table names
IF OBJECT_ID(N'dbo.BookingDetail', N'U') IS NOT NULL DROP TABLE dbo.BookingDetail;
IF OBJECT_ID(N'dbo.booking_detail', N'U') IS NOT NULL DROP TABLE dbo.booking_detail;
GO

IF OBJECT_ID(N'dbo.BookingReservation', N'U') IS NOT NULL DROP TABLE dbo.BookingReservation;
IF OBJECT_ID(N'dbo.booking_reservation', N'U') IS NOT NULL DROP TABLE dbo.booking_reservation;
GO

IF OBJECT_ID(N'dbo.RoomInformation', N'U') IS NOT NULL DROP TABLE dbo.RoomInformation;
IF OBJECT_ID(N'dbo.room_information', N'U') IS NOT NULL DROP TABLE dbo.room_information;
GO

IF OBJECT_ID(N'dbo.RoomType', N'U') IS NOT NULL DROP TABLE dbo.RoomType;
IF OBJECT_ID(N'dbo.room_type', N'U') IS NOT NULL DROP TABLE dbo.room_type;
GO

IF OBJECT_ID(N'dbo.Customer', N'U') IS NOT NULL DROP TABLE dbo.Customer;
IF OBJECT_ID(N'dbo.customer', N'U') IS NOT NULL DROP TABLE dbo.customer;
GO

-- 2. Create Customer Table
CREATE TABLE dbo.Customer (
    CustomerID INT IDENTITY(1,1) NOT NULL,
    CustomerFullName NVARCHAR(150) NOT NULL,
    Telephone VARCHAR(20) NOT NULL,
    EmailAddress VARCHAR(150) NOT NULL,
    CustomerBirthday DATE NULL,
    CustomerStatus TINYINT NOT NULL DEFAULT 1, -- 1: Active, 2: Inactive/Disabled
    Password VARCHAR(255) NOT NULL,
    CONSTRAINT PK_Customer PRIMARY KEY CLUSTERED (CustomerID ASC),
    CONSTRAINT UQ_Customer_EmailAddress UNIQUE (EmailAddress)
);
GO

-- 3. Create RoomType Table
CREATE TABLE dbo.RoomType (
    RoomTypeID INT IDENTITY(1,1) NOT NULL,
    RoomTypeName NVARCHAR(100) NOT NULL,
    TypeDescription NVARCHAR(500) NULL,
    TypeNote NVARCHAR(500) NULL,
    CONSTRAINT PK_RoomType PRIMARY KEY CLUSTERED (RoomTypeID ASC)
);
GO

-- 4. Create RoomInformation Table
CREATE TABLE dbo.RoomInformation (
    RoomID INT IDENTITY(1,1) NOT NULL,
    RoomNumber VARCHAR(50) NOT NULL,
    RoomDetailDescription NVARCHAR(1000) NULL,
    RoomMaxCapacity INT NOT NULL,
    RoomTypeID INT NOT NULL,
    RoomStatus TINYINT NOT NULL DEFAULT 1, -- 1: Active/Available, 2: Inactive/Maintenance
    RoomPricePerDay DECIMAL(18,2) NOT NULL,
    CONSTRAINT PK_RoomInformation PRIMARY KEY CLUSTERED (RoomID ASC),
    CONSTRAINT UQ_RoomInformation_RoomNumber UNIQUE (RoomNumber),
    CONSTRAINT FK_RoomInformation_RoomType FOREIGN KEY (RoomTypeID)
        REFERENCES dbo.RoomType (RoomTypeID) ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT CK_RoomInformation_Capacity CHECK (RoomMaxCapacity > 0),
    CONSTRAINT CK_RoomInformation_Price CHECK (RoomPricePerDay > 0)
);
GO

-- 5. Create BookingReservation Table
CREATE TABLE dbo.BookingReservation (
    BookingReservationID INT IDENTITY(1,1) NOT NULL,
    BookingDate DATE NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    CustomerID INT NOT NULL,
    BookingStatus TINYINT NOT NULL DEFAULT 1, -- 1: Confirmed/Active, 2: Completed, 3: Cancelled
    CONSTRAINT PK_BookingReservation PRIMARY KEY CLUSTERED (BookingReservationID ASC),
    CONSTRAINT FK_BookingReservation_Customer FOREIGN KEY (CustomerID)
        REFERENCES dbo.Customer (CustomerID) ON DELETE NO ACTION ON UPDATE CASCADE
);
GO

-- 6. Create BookingDetail Table (Composite Primary Key)
CREATE TABLE dbo.BookingDetail (
    BookingReservationID INT NOT NULL,
    RoomID INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    ActualPrice DECIMAL(18,2) NOT NULL,
    CONSTRAINT PK_BookingDetail PRIMARY KEY CLUSTERED (BookingReservationID ASC, RoomID ASC),
    CONSTRAINT FK_BookingDetail_BookingReservation FOREIGN KEY (BookingReservationID)
        REFERENCES dbo.BookingReservation (BookingReservationID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_BookingDetail_RoomInformation FOREIGN KEY (RoomID)
        REFERENCES dbo.RoomInformation (RoomID) ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT CK_BookingDetail_Dates CHECK (StartDate < EndDate),
    CONSTRAINT CK_BookingDetail_ActualPrice CHECK (ActualPrice >= 0)
);
GO

-- Indexes for performance
CREATE NONCLUSTERED INDEX IX_Customer_EmailAddress ON dbo.Customer (EmailAddress);
CREATE NONCLUSTERED INDEX IX_RoomInformation_RoomTypeID ON dbo.RoomInformation (RoomTypeID);
CREATE NONCLUSTERED INDEX IX_BookingReservation_CustomerID ON dbo.BookingReservation (CustomerID);
CREATE NONCLUSTERED INDEX IX_BookingDetail_RoomID ON dbo.BookingDetail (RoomID);
CREATE NONCLUSTERED INDEX IX_BookingDetail_Dates ON dbo.BookingDetail (RoomID, StartDate, EndDate);
GO

