-- LeadMaster GetAll
CREATE PROCEDURE sp_GetAll_LeadMaster
AS
BEGIN
    SELECT * 
    FROM LeadMaster;
END;
GO

-- LeadMaster Details
CREATE PROCEDURE sp_GetDetails_LeadMaster
    @LeadMasterId INT
AS
BEGIN
    SELECT * 
    FROM LeadMaster
    WHERE LeadMasterId = @LeadMasterId;
END;
GO

-- LeadMaster Save with JSON
CREATE PROCEDURE sp_Save_LeadMaster
    @LeadMasterJson NVARCHAR(MAX)
AS
BEGIN
    DECLARE @LeadMasterId INT,
            @LeadCategoryId INT,
            @LeadDate DATETIME,
            @CompanyName NVARCHAR(255),
            @ContactName NVARCHAR(255),
            @ContactNo NVARCHAR(50),
            @Address NVARCHAR(MAX),
            @Email NVARCHAR(255),
            @CityId INT,
            @BranchId INT,
            @RegionId INT,
            @DesignationId INT,
            @LeadSourceId INT,
            @AssignedToId INT,
            @IndustryTypeId INT,
            @SalesPerson INT,
            @IsActive BIT,
            @CreatedBy INT,
            @ModifiedBy INT;

    -- Parse JSON and assign values to variables
    SELECT 
        @LeadMasterId = JSON_VALUE(@LeadMasterJson, '$.LeadMasterId'),
        @LeadCategoryId = JSON_VALUE(@LeadMasterJson, '$.LeadCategoryId'),
        @LeadDate = JSON_VALUE(@LeadMasterJson, '$.LeadDate'),
        @CompanyName = JSON_VALUE(@LeadMasterJson, '$.CompanyName'),
        @ContactName = JSON_VALUE(@LeadMasterJson, '$.ContactName'),
        @ContactNo = JSON_VALUE(@LeadMasterJson, '$.ContactNo'),
        @Address = JSON_VALUE(@LeadMasterJson, '$.Address'),
        @Email = JSON_VALUE(@LeadMasterJson, '$.Email'),
        @CityId = JSON_VALUE(@LeadMasterJson, '$.CityId'),
        @BranchId = JSON_VALUE(@LeadMasterJson, '$.BranchId'),
        @RegionId = JSON_VALUE(@LeadMasterJson, '$.RegionId'),
        @DesignationId = JSON_VALUE(@LeadMasterJson, '$.DesignationId'),
        @LeadSourceId = JSON_VALUE(@LeadMasterJson, '$.LeadSourceId'),
        @AssignedToId = JSON_VALUE(@LeadMasterJson, '$.AssignedToId'),
        @IndustryTypeId = JSON_VALUE(@LeadMasterJson, '$.IndustryTypeId'),
        @SalesPerson = JSON_VALUE(@LeadMasterJson, '$.SalesPerson'),
        @IsActive = JSON_VALUE(@LeadMasterJson, '$.IsActive'),
        @CreatedBy = JSON_VALUE(@LeadMasterJson, '$.CreatedBy'),
        @ModifiedBy = JSON_VALUE(@LeadMasterJson, '$.ModifiedBy');

    IF @LeadMasterId IS NULL
    BEGIN
        INSERT INTO LeadMaster 
            (LeadCategoryId, LeadDate, CompanyName, ContactName, ContactNo, Address, Email, CityId, BranchId, 
             RegionId, DesignationId, LeadSourceId, AssignedToId, IndustryTypeId, SalesPerson, IsActive, CreatedBy, CreatedDate)
        VALUES 
            (@LeadCategoryId, @LeadDate, @CompanyName, @ContactName, @ContactNo, @Address, @Email, @CityId, @BranchId, 
             @RegionId, @DesignationId, @LeadSourceId, @AssignedToId, @IndustryTypeId, @SalesPerson, @IsActive, @CreatedBy, GETDATE());
    END
    ELSE
    BEGIN
        UPDATE LeadMaster
        SET LeadCategoryId = @LeadCategoryId,
            LeadDate = @LeadDate,
            CompanyName = @CompanyName,
            ContactName = @ContactName,
            ContactNo = @ContactNo,
            Address = @Address,
            Email = @Email,
            CityId = @CityId,
            BranchId = @BranchId,
            RegionId = @RegionId,
            DesignationId = @DesignationId,
            LeadSourceId = @LeadSourceId,
            AssignedToId = @AssignedToId,
            IndustryTypeId = @IndustryTypeId,
            SalesPerson = @SalesPerson,
            IsActive = @IsActive,
            ModifiedBy = @ModifiedBy,
            ModifiedDate = GETDATE()
        WHERE LeadMasterId = @LeadMasterId;
    END
END;
GO


-- LeadServiceInterest GetAll
CREATE PROCEDURE sp_GetAll_LeadServiceInterest
AS
BEGIN
    SELECT * 
    FROM LeadServiceInterest;
END;
GO

-- LeadServiceInterest Details
CREATE PROCEDURE sp_GetDetails_LeadServiceInterest
    @LeadServiceInterest INT
AS
BEGIN
    SELECT * 
    FROM LeadServiceInterest
    WHERE LeadServiceInterest = @LeadServiceInterest;
END;
GO

-- LeadServiceInterest Save
CREATE PROCEDURE sp_Save_LeadServiceInterest
    @LeadServiceInterest INT = NULL,
    @LeadId INT,
    @ServiceInterestedID INT
AS
BEGIN
    IF @LeadServiceInterest IS NULL
    BEGIN
        INSERT INTO LeadServiceInterest 
            (LeadId, ServiceInterestedID)
        VALUES 
            (@LeadId, @ServiceInterestedID);
    END
    ELSE
    BEGIN
        UPDATE LeadServiceInterest
        SET LeadId = @LeadId,
            ServiceInterestedID = @ServiceInterestedID
        WHERE LeadServiceInterest = @LeadServiceInterest;
    END
END;
GO

-- MeetingRequest GetAll
CREATE PROCEDURE sp_GetAll_MeetingRequest
AS
BEGIN
    SELECT * 
    FROM MeetingRequest;
END;
GO

-- MeetingRequest Details
CREATE PROCEDURE sp_GetDetails_MeetingRequest
    @MeetingId INT
AS
BEGIN
    SELECT * 
    FROM MeetingRequest
    WHERE MeetingId = @MeetingId;
END;
GO

-- MeetingRequest Save
CREATE PROCEDURE sp_Save_MeetingRequest
    @MeetingId INT = NULL,
    @LeadId INT,
    @CustomerId INT = NULL,
    @ContactId INT = NULL,
    @Email NVARCHAR(255) = NULL,
    @Address NVARCHAR(MAX) = NULL,
    @ContactNo NVARCHAR(50) = NULL,
    @MeetingPurpose NVARCHAR(MAX),
    @MeetingDateTime DATETIME = NULL,
    @MeetingTypeId INT = NULL,
    @MeetingLocation NVARCHAR(255),
    @IsAllDayEvent BIT,
    @MeetingMOM NVARCHAR(MAX) = NULL,
    @CreatedBy INT,
    @ModifiedBy INT = NULL
AS
BEGIN
    IF @MeetingId IS NULL
    BEGIN
        INSERT INTO MeetingRequest 
            (LeadId, CustomerId, ContactId, Email, Address, ContactNo, MeetingPurpose, MeetingDateTime, 
             MeetingTypeId, MeetingLocation, IsAllDayEvent, MeetingMOM, CreatedBy, CreatedDate)
        VALUES 
            (@LeadId, @CustomerId, @ContactId, @Email, @Address, @ContactNo, @MeetingPurpose, @MeetingDateTime, 
             @MeetingTypeId, @MeetingLocation, @IsAllDayEvent, @MeetingMOM, @CreatedBy, GETDATE());
    END
    ELSE
    BEGIN
        UPDATE MeetingRequest
        SET LeadId = @LeadId,
            CustomerId = @CustomerId,
            ContactId = @ContactId,
            Email = @Email,
            Address = @Address,
            ContactNo = @ContactNo,
            MeetingPurpose = @MeetingPurpose,
            MeetingDateTime = @MeetingDateTime,
            MeetingTypeId = @MeetingTypeId,
            MeetingLocation = @MeetingLocation,
            IsAllDayEvent = @IsAllDayEvent,
            MeetingMOM = @MeetingMOM,
            ModifiedBy = @ModifiedBy,
            ModifiedDate = GETDATE()
        WHERE MeetingId = @MeetingId;
    END
END;
GO

-- MeetingAttendees GetAll
CREATE PROCEDURE sp_GetAll_MeetingAttendees
AS
BEGIN
    SELECT * 
    FROM MeetingAttendees;
END;
GO

-- MeetingAttendees Details
CREATE PROCEDURE sp_GetDetails_MeetingAttendees
    @MeetingAttendeesId INT
AS
BEGIN
    SELECT * 
    FROM MeetingAttendees
    WHERE MeetingAttendeesId = @MeetingAttendeesId;
END;
GO

-- MeetingAttendees Save
CREATE PROCEDURE sp_Save_MeetingAttendees
    @MeetingAttendeesId INT = NULL,
    @MeetingId INT,
    @AttendeeID INT
AS
BEGIN
    IF @MeetingAttendeesId IS NULL
    BEGIN
        INSERT INTO MeetingAttendees 
            (MeetingId, AttendeeID)
        VALUES 
            (@MeetingId, @AttendeeID);
    END
    ELSE
    BEGIN
        UPDATE MeetingAttendees
        SET MeetingId = @MeetingId,
            AttendeeID = @AttendeeID
        WHERE MeetingAttendeesId = @MeetingAttendeesId;
    END
END;
GO

-- MeetingExpenses GetAll
CREATE PROCEDURE sp_GetAll_MeetingExpenses
AS
BEGIN
    SELECT * 
    FROM MeetingExpenses;
END;
GO

-- MeetingExpenses Details
CREATE PROCEDURE sp_GetDetails_MeetingExpenses
    @ExpenseId INT
AS
BEGIN
    SELECT * 
    FROM MeetingExpenses
    WHERE ExpenseId = @ExpenseId;
END;
GO

-- MeetingExpenses Save
CREATE PROCEDURE sp_Save_MeetingExpenses
    @ExpenseId INT = NULL,
    @MeetingId INT,
    @ExpenseCode NVARCHAR(50),
    @CustomerName NVARCHAR(255),
    @TransportMode NVARCHAR(100),
    @ExpenseDate DATETIME,
    @PunchedInLocation NVARCHAR(255) = NULL,
    @CheckedInLocation NVARCHAR(255) = NULL,
    @DistanceInKm FLOAT,
    @Amount DECIMAL(18,2),
    @SupportingDocument NVARCHAR(MAX) = NULL,
    @Remarks NVARCHAR(500) = NULL,
    @CreatedBy INT,
    @ModifiedBy INT = NULL
AS
BEGIN
    IF @ExpenseId IS NULL
    BEGIN
        INSERT INTO MeetingExpenses 
            (MeetingId, ExpenseCode, CustomerName, TransportMode, ExpenseDate, PunchedInLocation, CheckedInLocation, 
             DistanceInKm, Amount, SupportingDocument, Remarks, CreatedBy, CreatedDate)
        VALUES 
            (@MeetingId, @ExpenseCode, @CustomerName, @TransportMode, @ExpenseDate, @PunchedInLocation, 
             @CheckedInLocation, @DistanceInKm, @Amount, @SupportingDocument, @Remarks, @CreatedBy, GETDATE());
    END
    ELSE
    BEGIN
        UPDATE MeetingExpenses
        SET MeetingId = @MeetingId,
            ExpenseCode = @ExpenseCode,
            CustomerName = @CustomerName,
            TransportMode = @TransportMode,
            ExpenseDate = @ExpenseDate,
            PunchedInLocation = @PunchedInLocation,
            CheckedInLocation = @CheckedInLocation,
            DistanceInKm = @DistanceInKm,
            Amount = @Amount,
            SupportingDocument = @SupportingDocument,
            Remarks = @Remarks,
            ModifiedBy = @ModifiedBy,
            ModifiedDate = GETDATE()
        WHERE ExpenseId = @ExpenseId;
    END
END;
GO

-- ExpensesDocument GetAll
CREATE PROCEDURE sp_GetAll_ExpensesDocument
AS
BEGIN
    SELECT * 
    FROM ExpensesDocument;
END;
GO

-- ExpensesDocument Details
CREATE PROCEDURE sp_GetDetails_ExpensesDocument
    @ExpensesDocumentId INT
AS
BEGIN
    SELECT * 
    FROM ExpensesDocument
    WHERE ExpensesDocumentId = @ExpensesDocumentId;
END;
GO

-- ExpensesDocument Save
CREATE PROCEDURE sp_Save_ExpensesDocument
    @ExpensesDocumentId INT = NULL,
    @ExpenseId INT,
    @FileName NVARCHAR(255),
    @FileExtension VARCHAR(10) = NULL,
    @FileType VARCHAR(250),
    @FileContent VARBINARY(MAX) = NULL
AS
BEGIN
    IF @ExpensesDocumentId IS NULL
    BEGIN
        INSERT INTO ExpensesDocument 
            (ExpenseId, FileName, FileExtension, FileType, FileContent)
        VALUES 
            (@ExpenseId, @FileName, @FileExtension, @FileType, @FileContent);
    END
    ELSE
    BEGIN
        UPDATE ExpensesDocument
        SET ExpenseId = @ExpenseId,
            FileName = @FileName,
            FileExtension = @FileExtension,
            FileType = @FileType,
            FileContent = @FileContent
        WHERE ExpensesDocumentId = @ExpensesDocumentId;
    END
END;
GO

-- LeadCall GetAll
CREATE PROCEDURE sp_GetAll_LeadCall
AS
BEGIN
    SELECT * 
    FROM LeadCall;
END;
GO

-- LeadCall Details
CREATE PROCEDURE sp_GetDetails_LeadCall
    @CallId INT
AS
BEGIN
    SELECT * 
    FROM LeadCall
    WHERE CallId = @CallId;
END;
GO

-- LeadCall Save
CREATE PROCEDURE sp_Save_LeadCall
    @CallId INT = NULL,
    @LeadId INT,
    @CallPurpose NVARCHAR(255),
    @CallDateTime DATETIME = NULL,
    @CallCategoryId INT = NULL,
    @CustomerId INT = NULL,
    @Remarks NVARCHAR(500) = NULL,
    @CallMoM NVARCHAR(MAX) = NULL,
    @CreatedBy INT,
    @ModifiedBy INT = NULL
AS
BEGIN
    IF @CallId IS NULL
    BEGIN
        INSERT INTO LeadCall 
            (LeadId, CallPurpose, CallDateTime, CallCategoryId, CustomerId, Remarks, CallMoM, CreatedBy, CreatedDate)
        VALUES 
            (@LeadId, @CallPurpose, @CallDateTime, @CallCategoryId, @CustomerId, @Remarks, @CallMoM, @CreatedBy, GETDATE());
    END
    ELSE
    BEGIN
        UPDATE LeadCall
        SET LeadId = @LeadId,
            CallPurpose = @CallPurpose,
            CallDateTime = @CallDateTime,
            CallCategoryId = @CallCategoryId,
            CustomerId = @CustomerId,
            Remarks = @Remarks,
            CallMoM = @CallMoM,
            ModifiedBy = @ModifiedBy,
            ModifiedDate = GETDATE()
        WHERE CallId = @CallId;
    END
END;
GO

-- CallAttendees GetAll
CREATE PROCEDURE sp_GetAll_CallAttendees
AS
BEGIN
    SELECT * 
    FROM CallAttendees;
END;
GO

-- CallAttendees Details
CREATE PROCEDURE sp_GetDetails_CallAttendees
    @CallAttendeesId INT
AS
BEGIN
    SELECT * 
    FROM CallAttendees
    WHERE CallAttendeesId = @CallAttendeesId;
END;
GO

-- CallAttendees Save
CREATE PROCEDURE sp_Save_CallAttendees
    @CallAttendeesId INT = NULL,
    @CallId INT,
    @AttendeeID INT
AS
BEGIN
    IF @CallAttendeesId IS NULL
    BEGIN
        INSERT INTO CallAttendees 
            (CallId, AttendeeID)
        VALUES 
            (@CallId, @AttendeeID);
    END
    ELSE
    BEGIN
        UPDATE CallAttendees
        SET CallId = @CallId,
            AttendeeID = @AttendeeID
        WHERE CallAttendeesId = @CallAttendeesId;
    END
END;
GO

-- Tasks GetAll
CREATE PROCEDURE sp_GetAll_Tasks
AS
BEGIN
    SELECT * 
    FROM Tasks;
END;
GO

-- Tasks Details
CREATE PROCEDURE sp_GetDetails_Tasks
    @TaskId INT
AS
BEGIN
    SELECT * 
    FROM Tasks
    WHERE TaskId = @TaskId;
END;
GO

-- Tasks Save
CREATE PROCEDURE sp_Save_Tasks
    @TaskId INT = NULL,
    @TaskName NVARCHAR(255),
    @TaskDate DATETIME = NULL,
    @LeadCategoryId INT = NULL,
    @CustomerId INT = NULL,
    @PriorityId INT = NULL,
    @TaskDescription NVARCHAR(MAX) = NULL,
    @CreatedBy INT,
    @ModifiedBy INT = NULL
AS
BEGIN
    IF @TaskId IS NULL
    BEGIN
        INSERT INTO Tasks 
            (TaskName, TaskDate, LeadCategoryId, CustomerId, PriorityId, TaskDescription, CreatedBy, CreatedDate)
        VALUES 
            (@TaskName, @TaskDate, @LeadCategoryId, @CustomerId, @PriorityId, @TaskDescription, @CreatedBy, GETDATE());
    END
    ELSE
    BEGIN
        UPDATE Tasks
        SET TaskName = @TaskName,
            TaskDate = @TaskDate,
            LeadCategoryId = @LeadCategoryId,
            CustomerId = @CustomerId,
            PriorityId = @PriorityId,
            TaskDescription = @TaskDescription,
            ModifiedBy = @ModifiedBy,
            ModifiedDate = GETDATE()
        WHERE TaskId = @TaskId;
    END
END;
GO

-- TaskAssignments GetAll
CREATE PROCEDURE sp_GetAll_TaskAssignments
AS
BEGIN
    SELECT * 
    FROM TaskAssignments;
END;
GO

-- TaskAssignments Details
CREATE PROCEDURE sp_GetDetails_TaskAssignments
    @TaskAssignmentsId INT
AS
BEGIN
    SELECT * 
    FROM TaskAssignments
    WHERE TaskAssignmentsId = @TaskAssignmentsId;
END;
GO

-- TaskAssignments Save
CREATE PROCEDURE sp_Save_TaskAssignments
    @TaskAssignmentsId INT = NULL,
    @TaskId INT,
    @AssignedToId INT
AS
BEGIN
    IF @TaskAssignmentsId IS NULL
    BEGIN
        INSERT INTO TaskAssignments 
            (TaskId, AssignedToId)
        VALUES 
            (@TaskId, @AssignedToId);
    END
    ELSE
    BEGIN
        UPDATE TaskAssignments
        SET TaskId = @TaskId,
            AssignedToId = @AssignedToId
        WHERE TaskAssignmentsId = @TaskAssignmentsId;
    END
END;
GO

-- Assignments GetAll
CREATE PROCEDURE sp_GetAll_Assignments
AS
BEGIN
    SELECT * 
    FROM Assignments;
END;
GO

-- Assignments Details
CREATE PROCEDURE sp_GetDetails_Assignments
    @AssignmentId INT
AS
BEGIN
    SELECT * 
    FROM Assignments
    WHERE AssignmentId = @AssignmentId;
END;
GO

-- Assignments Save
CREATE PROCEDURE sp_Save_Assignments
    @AssignmentId INT = NULL,
    @LeadCategoryId INT,
    @CustomerId INT,
    @RegionId INT,
    @BranchId INT,
    @UserId INT,
    @AssignToId INT
AS
BEGIN
    IF @AssignmentId IS NULL
    BEGIN
        INSERT INTO Assignments 
            (LeadCategoryId, CustomerId, RegionId, BranchId, UserId, AssignToId)
        VALUES 
            (@LeadCategoryId, @CustomerId, @RegionId, @BranchId, @UserId, @AssignToId);
    END
    ELSE
    BEGIN
        UPDATE Assignments
        SET LeadCategoryId = @LeadCategoryId,
            CustomerId = @CustomerId,
            RegionId = @RegionId,
            BranchId = @BranchId,
            UserId = @UserId,
            AssignToId = @AssignToId
        WHERE AssignmentId = @AssignmentId;
    END
END;
GO
