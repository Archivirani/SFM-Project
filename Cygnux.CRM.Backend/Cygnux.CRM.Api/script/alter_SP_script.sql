-- LeadMaster Save with JSON
ALTER PROCEDURE sp_Save_LeadMaster
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

-- LeadServiceInterest Save with JSON
ALTER PROCEDURE sp_Save_LeadServiceInterest
    @LeadServiceInterestJson NVARCHAR(MAX)
AS
BEGIN
    DECLARE @LeadServiceInterest INT,
            @LeadId INT,
            @ServiceInterestedID INT;

    -- Parse JSON and assign values to variables
    SELECT 
        @LeadServiceInterest = JSON_VALUE(@LeadServiceInterestJson, '$.LeadServiceInterest'),
        @LeadId = JSON_VALUE(@LeadServiceInterestJson, '$.LeadId'),
        @ServiceInterestedID = JSON_VALUE(@LeadServiceInterestJson, '$.ServiceInterestedID');

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


-- MeetingRequest Save with JSON
ALTER PROCEDURE sp_Save_MeetingRequest
    @MeetingJson NVARCHAR(MAX)
AS
BEGIN
    DECLARE @MeetingId INT,
            @LeadId INT,
            @CustomerId INT,
            @ContactId INT,
            @Email NVARCHAR(255),
            @Address NVARCHAR(MAX),
            @ContactNo NVARCHAR(50),
            @MeetingPurpose NVARCHAR(MAX),
            @MeetingDateTime DATETIME,
            @MeetingTypeId INT,
            @MeetingLocation NVARCHAR(255),
            @IsAllDayEvent BIT,
            @MeetingMOM NVARCHAR(MAX),
            @CreatedBy INT,
            @ModifiedBy INT;

    -- Parse JSON and assign values to variables
    SELECT 
        @MeetingId = JSON_VALUE(@MeetingJson, '$.MeetingId'),
        @LeadId = JSON_VALUE(@MeetingJson, '$.LeadId'),
        @CustomerId = JSON_VALUE(@MeetingJson, '$.CustomerId'),
        @ContactId = JSON_VALUE(@MeetingJson, '$.ContactId'),
        @Email = JSON_VALUE(@MeetingJson, '$.Email'),
        @Address = JSON_VALUE(@MeetingJson, '$.Address'),
        @ContactNo = JSON_VALUE(@MeetingJson, '$.ContactNo'),
        @MeetingPurpose = JSON_VALUE(@MeetingJson, '$.MeetingPurpose'),
        @MeetingDateTime = JSON_VALUE(@MeetingJson, '$.MeetingDateTime'),
        @MeetingTypeId = JSON_VALUE(@MeetingJson, '$.MeetingTypeId'),
        @MeetingLocation = JSON_VALUE(@MeetingJson, '$.MeetingLocation'),
        @IsAllDayEvent = JSON_VALUE(@MeetingJson, '$.IsAllDayEvent'),
        @MeetingMOM = JSON_VALUE(@MeetingJson, '$.MeetingMOM'),
        @CreatedBy = JSON_VALUE(@MeetingJson, '$.CreatedBy'),
        @ModifiedBy = JSON_VALUE(@MeetingJson, '$.ModifiedBy');

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

-- MeetingAttendees Save with JSON Input
ALTER PROCEDURE sp_Save_MeetingAttendees
    @MeetingAttendeesJson NVARCHAR(MAX)
AS
BEGIN
    DECLARE @MeetingAttendeesId INT,
            @MeetingId INT,
            @AttendeeID INT;

    -- Parse the JSON input into the respective variables
    SELECT 
        @MeetingAttendeesId = JSON_VALUE(@MeetingAttendeesJson, '$.MeetingAttendeesId'),
        @MeetingId = JSON_VALUE(@MeetingAttendeesJson, '$.MeetingId'),
        @AttendeeID = JSON_VALUE(@MeetingAttendeesJson, '$.AttendeeID');

    -- Insert or Update logic
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

-- MeetingExpenses Save
ALTER PROCEDURE sp_Save_MeetingExpenses
    @ExpenseId INT = NULL,
    @JsonInput NVARCHAR(MAX) -- JSON input
AS
BEGIN
    -- Declare variables to hold parsed JSON values
    DECLARE @MeetingId INT,
            @ExpenseCode NVARCHAR(50),
            @CustomerName NVARCHAR(255),
            @TransportMode NVARCHAR(100),
            @ExpenseDate DATETIME,
            @PunchedInLocation NVARCHAR(255),
            @CheckedInLocation NVARCHAR(255),
            @DistanceInKm FLOAT,
            @Amount DECIMAL(18,2),
            @SupportingDocument NVARCHAR(MAX),
            @Remarks NVARCHAR(500),
            @CreatedBy INT,
            @ModifiedBy INT = NULL;

    -- Parse JSON input
    SELECT 
        @MeetingId = JSON_VALUE(@JsonInput, '$.MeetingId'),
        @ExpenseCode = JSON_VALUE(@JsonInput, '$.ExpenseCode'),
        @CustomerName = JSON_VALUE(@JsonInput, '$.CustomerName'),
        @TransportMode = JSON_VALUE(@JsonInput, '$.TransportMode'),
        @ExpenseDate = JSON_VALUE(@JsonInput, '$.ExpenseDate'),
        @PunchedInLocation = JSON_VALUE(@JsonInput, '$.PunchedInLocation'),
        @CheckedInLocation = JSON_VALUE(@JsonInput, '$.CheckedInLocation'),
        @DistanceInKm = JSON_VALUE(@JsonInput, '$.DistanceInKm'),
        @Amount = JSON_VALUE(@JsonInput, '$.Amount'),
        @SupportingDocument = JSON_VALUE(@JsonInput, '$.SupportingDocument'),
        @Remarks = JSON_VALUE(@JsonInput, '$.Remarks'),
        @CreatedBy = JSON_VALUE(@JsonInput, '$.CreatedBy'),
        @ModifiedBy = JSON_VALUE(@JsonInput, '$.ModifiedBy');

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

-- ExpensesDocument Save
ALTER PROCEDURE sp_Save_ExpensesDocument
    @ExpensesDocumentId INT = NULL,
    @JsonInput NVARCHAR(MAX) -- JSON input
AS
BEGIN
    -- Declare variables to hold parsed JSON values
    DECLARE @ExpenseId INT,
            @FileName NVARCHAR(255),
            @FileExtension VARCHAR(10) = NULL,
            @FileType VARCHAR(250),
            @FileContent VARBINARY(MAX) = NULL;

    -- Parse JSON input
    SELECT 
        @ExpenseId = JSON_VALUE(@JsonInput, '$.ExpenseId'),
        @FileName = JSON_VALUE(@JsonInput, '$.FileName'),
        @FileExtension = JSON_VALUE(@JsonInput, '$.FileExtension'),
        @FileType = JSON_VALUE(@JsonInput, '$.FileType'),
        @FileContent = CAST(JSON_VALUE(@JsonInput, '$.FileContent') AS VARBINARY(MAX)); -- Assuming FileContent is sent as Base64 encoded string

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

-- LeadCall Save
ALTER PROCEDURE sp_Save_LeadCall    
    @CallJson NVARCHAR(MAX) -- JSON input
AS
BEGIN
    -- Declare variables to hold parsed JSON values
    DECLARE @CallId INT,
            @LeadId INT,
            @CallPurpose NVARCHAR(255),
            @CallDateTime DATETIME = NULL,
            @CallCategoryId INT = NULL,
            @CustomerId INT = NULL,
            @Remarks NVARCHAR(500) = NULL,
            @CallMoM NVARCHAR(MAX) = NULL,
            @CreatedBy INT,
            @ModifiedBy INT = NULL;

    -- Parse JSON input
    SELECT 
        @CallId = JSON_VALUE(@CallJson, '$.CallId'),
        @LeadId = JSON_VALUE(@CallJson, '$.LeadId'),
        @CallPurpose = JSON_VALUE(@CallJson, '$.CallPurpose'),
        @CallDateTime = JSON_VALUE(@CallJson, '$.CallDateTime'),
        @CallCategoryId = JSON_VALUE(@CallJson, '$.CallCategoryId'),
        @CustomerId = JSON_VALUE(@CallJson, '$.CustomerId'),
        @Remarks = JSON_VALUE(@CallJson, '$.Remarks'),
        @CallMoM = JSON_VALUE(@CallJson, '$.CallMoM'),
        @CreatedBy = JSON_VALUE(@CallJson, '$.CreatedBy'),
        @ModifiedBy = JSON_VALUE(@CallJson, '$.ModifiedBy');

    IF @CallId < 1
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

-- CallAttendees Save
ALTER PROCEDURE sp_Save_CallAttendees
    @CallAttendeesId INT = NULL,
    @JsonInput NVARCHAR(MAX) -- JSON input
AS
BEGIN
    -- Declare variables to hold parsed JSON values
    DECLARE @CallId INT,
            @AttendeeID INT;

    -- Parse JSON input
    SELECT 
        @CallId = JSON_VALUE(@JsonInput, '$.CallId'),
        @AttendeeID = JSON_VALUE(@JsonInput, '$.AttendeeID');

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


-- Tasks Save
ALTER PROCEDURE sp_Save_Tasks
    @TaskId INT = NULL,
    @JsonInput NVARCHAR(MAX) -- JSON input
AS
BEGIN
    -- Declare variables to hold parsed JSON values
    DECLARE @TaskName NVARCHAR(255),
            @TaskDate DATETIME = NULL,
            @LeadCategoryId INT = NULL,
            @CustomerId INT = NULL,
            @PriorityId INT = NULL,
            @TaskDescription NVARCHAR(MAX) = NULL,
            @CreatedBy INT,
            @ModifiedBy INT = NULL;

    -- Parse JSON input
    SELECT 
        @TaskName = JSON_VALUE(@JsonInput, '$.TaskName'),
        @TaskDate = JSON_VALUE(@JsonInput, '$.TaskDate'),
        @LeadCategoryId = JSON_VALUE(@JsonInput, '$.LeadCategoryId'),
        @CustomerId = JSON_VALUE(@JsonInput, '$.CustomerId'),
        @PriorityId = JSON_VALUE(@JsonInput, '$.PriorityId'),
        @TaskDescription = JSON_VALUE(@JsonInput, '$.TaskDescription'),
        @CreatedBy = JSON_VALUE(@JsonInput, '$.CreatedBy'),
        @ModifiedBy = JSON_VALUE(@JsonInput, '$.ModifiedBy');

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

-- TaskAssignments Save
ALTER PROCEDURE sp_Save_TaskAssignments
    @TaskAssignmentsId INT = NULL,
    @JsonInput NVARCHAR(MAX) -- JSON input
AS
BEGIN
    -- Declare variables to hold parsed JSON values
    DECLARE @TaskId INT,
            @AssignedToId INT;

    -- Parse JSON input
    SELECT 
        @TaskId = JSON_VALUE(@JsonInput, '$.TaskId'),
        @AssignedToId = JSON_VALUE(@JsonInput, '$.AssignedToId');

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

-- Assignments Save
ALTER PROCEDURE sp_Save_Assignments
    @AssignmentId INT = NULL,
    @JsonInput NVARCHAR(MAX) -- JSON input
AS
BEGIN
    -- Declare variables to hold parsed JSON values
    DECLARE @LeadCategoryId INT,
            @CustomerId INT,
            @RegionId INT,
            @BranchId INT,
            @UserId INT,
            @AssignToId INT;

    -- Parse JSON input
    SELECT 
        @LeadCategoryId = JSON_VALUE(@JsonInput, '$.LeadCategoryId'),
        @CustomerId = JSON_VALUE(@JsonInput, '$.CustomerId'),
        @RegionId = JSON_VALUE(@JsonInput, '$.RegionId'),
        @BranchId = JSON_VALUE(@JsonInput, '$.BranchId'),
        @UserId = JSON_VALUE(@JsonInput, '$.UserId'),
        @AssignToId = JSON_VALUE(@JsonInput, '$.AssignToId');

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
