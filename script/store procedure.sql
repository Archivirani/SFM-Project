USE [CRMConnect]
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetAll_Assignments]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Assignments GetAll
CREATE PROCEDURE [dbo].[Usp_GetAll_Assignments]
AS
BEGIN
    SELECT * 
    FROM Assignments;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetAll_CallAttendees]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- CallAttendees GetAll
CREATE PROCEDURE [dbo].[Usp_GetAll_CallAttendees]
AS
BEGIN
    SELECT * 
    FROM CallAttendees;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetAll_ExpensesDocument]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ExpensesDocument GetAll
CREATE PROCEDURE [dbo].[Usp_GetAll_ExpensesDocument]
AS
BEGIN
    SELECT * 
    FROM ExpensesDocument;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetAll_LeadCall]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- LeadCall GetAll
CREATE PROCEDURE [dbo].[Usp_GetAll_LeadCall]
AS
BEGIN
    SELECT * 
    FROM LeadCall;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetAll_LeadServiceInterest]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- LeadServiceInterest GetAll
CREATE PROCEDURE [dbo].[Usp_GetAll_LeadServiceInterest]
AS
BEGIN
    SELECT * 
    FROM LeadServiceInterest;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetAll_MeetingAttendees]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- MeetingAttendees GetAll
CREATE PROCEDURE [dbo].[Usp_GetAll_MeetingAttendees]
AS
BEGIN
    SELECT * 
    FROM MeetingAttendees;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetAll_MeetingExpenses]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- MeetingExpenses GetAll
CREATE PROCEDURE [dbo].[Usp_GetAll_MeetingExpenses]
AS
BEGIN
    SELECT * 
    FROM MeetingExpenses;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetAll_TaskAssignments]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- TaskAssignments GetAll
CREATE PROCEDURE [dbo].[Usp_GetAll_TaskAssignments]
AS
BEGIN
    SELECT * 
    FROM TaskAssignments;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetAll_Tasks]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Tasks GetAll
CREATE PROCEDURE [dbo].[Usp_GetAll_Tasks]
AS
BEGIN
    SELECT * 
    FROM Tasks;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetDetails_Assignments]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Assignments Details
CREATE PROCEDURE [dbo].[Usp_GetDetails_Assignments]
    @AssignmentId INT
AS
BEGIN
    SELECT * 
    FROM Assignments
    WHERE AssignmentId = @AssignmentId;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetDetails_CallAttendees]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- CallAttendees Details
CREATE PROCEDURE [dbo].[Usp_GetDetails_CallAttendees]
    @CallAttendeesId INT
AS
BEGIN
    SELECT * 
    FROM CallAttendees
    WHERE CallAttendeesId = @CallAttendeesId;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetDetails_ExpensesDocument]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ExpensesDocument Details
CREATE PROCEDURE [dbo].[Usp_GetDetails_ExpensesDocument]
    @ExpensesDocumentId INT
AS
BEGIN
    SELECT * 
    FROM ExpensesDocument
    WHERE ExpensesDocumentId = @ExpensesDocumentId;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetDetails_LeadCall]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- LeadCall Details
CREATE PROCEDURE [dbo].[Usp_GetDetails_LeadCall]
    @CallId INT
AS
BEGIN
    SELECT * 
    FROM LeadCall
    WHERE CallId = @CallId;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetDetails_LeadMaster]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- LeadMaster Details
CREATE PROCEDURE [dbo].[Usp_GetDetails_LeadMaster]
    @LeadMasterId INT
AS
BEGIN
    SELECT * 
    FROM LeadMaster
    WHERE LeadMasterId = @LeadMasterId;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetDetails_LeadServiceInterest]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- LeadServiceInterest Details
CREATE PROCEDURE [dbo].[Usp_GetDetails_LeadServiceInterest]
    @LeadServiceInterest INT
AS
BEGIN
    SELECT * 
    FROM LeadServiceInterest
    WHERE LeadServiceInterest = @LeadServiceInterest;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetDetails_MeetingAttendees]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- MeetingAttendees Details
CREATE PROCEDURE [dbo].[Usp_GetDetails_MeetingAttendees]
    @MeetingAttendeesId INT
AS
BEGIN
    SELECT * 
    FROM MeetingAttendees
    WHERE MeetingAttendeesId = @MeetingAttendeesId;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetDetails_MeetingExpenses]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- MeetingExpenses Details
CREATE PROCEDURE [dbo].[Usp_GetDetails_MeetingExpenses]
    @ExpenseId INT
AS
BEGIN
    SELECT * 
    FROM MeetingExpenses
    WHERE ExpenseId = @ExpenseId;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetDetails_MeetingRequest]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- MeetingRequest Details
CREATE PROCEDURE [dbo].[Usp_GetDetails_MeetingRequest]
    @MeetingId INT
AS
BEGIN
    SELECT * 
    FROM MeetingRequest
    WHERE MeetingId = @MeetingId;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetDetails_TaskAssignments]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- TaskAssignments Details
CREATE PROCEDURE [dbo].[Usp_GetDetails_TaskAssignments]
    @TaskAssignmentsId INT
AS
BEGIN
    SELECT * 
    FROM TaskAssignments
    WHERE TaskAssignmentsId = @TaskAssignmentsId;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetDetails_Tasks]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Tasks Details
CREATE PROCEDURE [dbo].[Usp_GetDetails_Tasks]
    @TaskId INT
AS
BEGIN
    SELECT * 
    FROM Tasks
    WHERE TaskId = @TaskId;
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetLead]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- LeadMaster GetAll
CREATE PROCEDURE [dbo].[Usp_GetLead]
@Id UNIQUEIDENTIFIER = NULL
AS
BEGIN
	IF(@Id IS NOT NULL)
	BEGIN
		SELECT LeadCategoryId, CompanyName, ContactName, LeadId, LeadDate, LeadSourceId, AssignedToId, IsActive,RegionId, BranchId,
		DesignationId, IndustryTypeId,CityId,ServiceInterestedIDs
		ContactName, ContactNo, Address,Email
		FROM Leads WHERE LeadId = @Id;
    END
	ELSE
	BEGIN
	SELECT LeadCategoryId, CompanyName, ContactName, LeadId, LeadDate, LeadSourceId, AssignedToId, IsActive,
		ContactName, ContactNo, Address,Email
		FROM Leads;
	END
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_GetMeeting]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- MeetingRequest GetAll
CREATE PROCEDURE [dbo].[Usp_GetMeeting]
@Id UNIQUEIDENTIFIER = NULL
AS
BEGIN
IF(@Id IS NOT NULL)
BEGIN
   SELECT MeetingId, CustomerName, StartTime, EndTime, MeetingDate, AttendeeIDS, MeetingPurpose, ContactNo, Email, 
   ContactName, Address, MeetingTypeId,MeetingLocation, MeetingPurpose
    FROM Meetings
	WHERE MeetingId  = @Id
END
ELSE
BEGIN
    SELECT MeetingId, CustomerName, StartTime, EndTime, MeetingDate, AttendeeIDS, MeetingPurpose, ContactNo, Email, ContactName, Address
    FROM Meetings
	ORDER BY CreatedDate DESC
	END
END;
GO
/****** Object:  StoredProcedure [dbo].[Usp_Lead]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- LeadMaster Save with JSON
CREATE PROCEDURE [dbo].[Usp_Lead]
    @LeadId UNIQUEIDENTIFIER = NULL,
    @LeadJson NVARCHAR(MAX)
AS
BEGIN

BEGIN TRANSACTION
	BEGIN TRY
  
    IF @LeadId IS NULL
    BEGIN
        INSERT INTO Leads 
            (LeadCategoryId, LeadDate, CompanyName, ContactName, ContactNo, Address, Email, CityId, BranchId, 
             RegionId, DesignationId, LeadSourceId, AssignedToId, IndustryTypeId, ServiceInterestedIDs, SalesPerson, IsActive, CreatedBy, CreatedDate)
        VALUES 
            (
			 JSON_VALUE(@LeadJson, '$.LeadCategoryId'),
			 JSON_VALUE(@LeadJson, '$.LeadDate'), 
			 JSON_VALUE(@LeadJson, '$.CompanyName'),
			 JSON_VALUE(@LeadJson, '$.ContactName'),
			 JSON_VALUE(@LeadJson, '$.ContactNo'),
			 JSON_VALUE(@LeadJson, '$.Address'),
			 JSON_VALUE(@LeadJson, '$.Email'),
			 JSON_VALUE(@LeadJson, '$.CityId'),
			 JSON_VALUE(@LeadJson, '$.BranchId'),
			 JSON_VALUE(@LeadJson, '$.RegionId'),
			 JSON_VALUE(@LeadJson, '$.DesignationId'),
			 JSON_VALUE(@LeadJson, '$.LeadSourceId'),
			 JSON_VALUE(@LeadJson, '$.AssignedToId'),
			 JSON_VALUE(@LeadJson, '$.IndustryTypeId'),
			 JSON_VALUE(@LeadJson, '$.ServiceInterestedIDs'),
			 JSON_VALUE(@LeadJson, '$.SalesPerson'),
			 JSON_VALUE(@LeadJson, '$.IsActive'),
			 1,
			 GETDATE()
			)

		SELECT 1 as [Status] ,'Lead created successfully!' as [Message]

  END
    ELSE
    BEGIN
        UPDATE Leads
        SET LeadCategoryId =  JSON_VALUE(@LeadJson, '$.LeadCategoryId'),
            LeadDate =  JSON_VALUE(@LeadJson, '$.LeadDate'),
            CompanyName =  JSON_VALUE(@LeadJson, '$.CompanyName'),
            ContactName =  JSON_VALUE(@LeadJson, '$.ContactName'),
            ContactNo =  JSON_VALUE(@LeadJson, '$.ContactNo'),
            Address =  JSON_VALUE(@LeadJson, '$.Address'),
            Email =  JSON_VALUE(@LeadJson, '$.Email'),
            CityId =  JSON_VALUE(@LeadJson, '$.CityId'),
            BranchId =  JSON_VALUE(@LeadJson, '$.BranchId'),
            RegionId =  JSON_VALUE(@LeadJson, '$.RegionId'),
            DesignationId =  JSON_VALUE(@LeadJson, '$.DesignationId'),
            LeadSourceId =  JSON_VALUE(@LeadJson, '$.LeadSourceId'),
            AssignedToId =  JSON_VALUE(@LeadJson, '$.AssignedToId'),
            IndustryTypeId =  JSON_VALUE(@LeadJson, '$.IndustryTypeId'),
            SalesPerson =  JSON_VALUE(@LeadJson, '$.SalesPerson'),
            IsActive =  JSON_VALUE(@LeadJson, '$.IsActive'),
			ServiceInterestedIDs = JSON_VALUE(@LeadJson, '$.ServiceInterestedIDs'),
            ModifiedBy = 1,
            ModifiedDate = GETDATE()
        WHERE LeadId = @LeadId;
			SELECT 1 as [Status] ,'Lead updated successfully!' as [Message]
    END

COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		
		SELECT 0 as [Status] ,'At Line : ' + CONVERT(VARCHAR, ERROR_LINE()) + ' ' + ERROR_MESSAGE() as [Message]
	END CATCH
END

GO
/****** Object:  StoredProcedure [dbo].[Usp_Meeting]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- MeetingRequest Save
CREATE PROCEDURE [dbo].[Usp_Meeting]
   @Id UNIQUEIDENTIFIER = NULL,
   @MeetingJson NVARCHAR(MAX)
AS
BEGIN
	BEGIN TRANSACTION
	BEGIN TRY
    IF @Id IS NULL
    BEGIN
        INSERT INTO Meetings 
            (LeadId, CustomerName, ContactName, Email, Address, ContactNo, MeetingPurpose, MeetingDate, 
             MeetingTypeId, MeetingLocation, IsAllDayEvent, AttendeeIDs, StartTime, EndTime, MeetingMOM, CreatedBy, CreatedDate)
        VALUES 
            (JSON_VALUE(@MeetingJson,'$.LeadId'), 
			JSON_VALUE(@MeetingJson,'$.CustomerName'), 
			JSON_VALUE(@MeetingJson,'$.ContactName'),
			JSON_VALUE(@MeetingJson,'$.Email'),
			JSON_VALUE(@MeetingJson,'$.Address'),
			JSON_VALUE(@MeetingJson,'$.ContactNo'),
			JSON_VALUE(@MeetingJson,'$.MeetingPurpose'),
			JSON_VALUE(@MeetingJson,'$.MeetingDate'),
			JSON_VALUE(@MeetingJson,'$.MeetingTypeId'),
			JSON_VALUE(@MeetingJson,'$.MeetingLocation'),
			JSON_VALUE(@MeetingJson,'$.IsAllDayEvent'),
			JSON_VALUE(@MeetingJson,'$.AttendeeIDs'),
			JSON_VALUE(@MeetingJson,'$.StartTime'),
			JSON_VALUE(@MeetingJson,'$.EndTime'),
			JSON_VALUE(@MeetingJson,'$.MeetingMOM'),
			1, 
			GETDATE());

			SELECT 1 as [Status] ,'Meeting created successfully!' as [Message]
    END
    ELSE
    BEGIN
        UPDATE Meetings
        SET LeadId = JSON_VALUE(@MeetingJson,'$.LeadId'),
            CustomerName = JSON_VALUE(@MeetingJson,'$.CustomerName'),
            ContactName = JSON_VALUE(@MeetingJson,'$.ContactName'),
            Email = JSON_VALUE(@MeetingJson,'$.Email'),
            Address = JSON_VALUE(@MeetingJson,'$.Address'),
            ContactNo = JSON_VALUE(@MeetingJson,'$.ContactNo'),
            MeetingPurpose = JSON_VALUE(@MeetingJson,'$.MeetingPurpose'),
            MeetingDate = JSON_VALUE(@MeetingJson,'$.MeetingDate'),
            MeetingTypeId = JSON_VALUE(@MeetingJson,'$.MeetingTypeId'),
            MeetingLocation = JSON_VALUE(@MeetingJson,'$.MeetingLocation'),
            IsAllDayEvent = JSON_VALUE(@MeetingJson,'$.IsAllDayEvent'),
            MeetingMOM = JSON_VALUE(@MeetingJson,'$.MeetingMOM'),
			AttendeeIDs = JSON_VALUE(@MeetingJson,'$.AttendeeIDs'),
			StartTime = JSON_VALUE(@MeetingJson,'$.StartTime'),
			EndTime = JSON_VALUE(@MeetingJson,'$.EndTime'),
            ModifiedBy = 1,
            ModifiedDate = GETDATE()
        WHERE MeetingId = @Id;

		SELECT 1 as [Status] ,'Customer updated successfully!' as [Message]
    END
	COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		/*
		/*** LogActivity => Insert into TBL_Master_LogActivity && TBL_Error_Log ***/
		SET @String1 = CONCAT('EXEC USP_AddEditMasterVehicleType', '''', REPLACE('' + CAST(@CustomerJson AS VARCHAR(MAX)) + '', '', ''''), ''',', IIF(ISNULL(@Flag, '') = '', '''''''', @Flag))
		EXEC TBL_Master_LogActivity_Insert @String1 ,'AddEditVehicleType' ,0 ,'Error' ,@EntryBy
		SET @LogID = (SELECT TOP 1 ISNULL(MAX(LogID), 0) FROM TBL_Master_LogActivity WITH (NOLOCK))
		EXEC USP_Error_Log @LogID ,'AddEditVehicleType' ,@Flag ,error_message ,'' ,'' ,'SQLDB' ,1 ,@EntryBy
		/*** Over ***/
		*/
		SELECT 0 as [Status] ,'At Line : ' + CONVERT(VARCHAR, ERROR_LINE()) + ' ' + ERROR_MESSAGE() as [Message]
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[Usp_Save_Assignments]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Assignments Save
CREATE PROCEDURE [dbo].[Usp_Save_Assignments]
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
/****** Object:  StoredProcedure [dbo].[Usp_Save_CallAttendees]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- CallAttendees Save
CREATE PROCEDURE [dbo].[Usp_Save_CallAttendees]
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
/****** Object:  StoredProcedure [dbo].[Usp_Save_ExpensesDocument]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ExpensesDocument Save
CREATE PROCEDURE [dbo].[Usp_Save_ExpensesDocument]
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
/****** Object:  StoredProcedure [dbo].[Usp_Save_LeadCall]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- LeadCall Save
CREATE PROCEDURE [dbo].[Usp_Save_LeadCall]
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
/****** Object:  StoredProcedure [dbo].[Usp_Save_LeadServiceInterest]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- LeadServiceInterest Save
CREATE PROCEDURE [dbo].[Usp_Save_LeadServiceInterest]
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
/****** Object:  StoredProcedure [dbo].[Usp_Save_MeetingAttendees]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- MeetingAttendees Save
CREATE PROCEDURE [dbo].[Usp_Save_MeetingAttendees]
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
/****** Object:  StoredProcedure [dbo].[Usp_Save_MeetingExpenses]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- MeetingExpenses Save
CREATE PROCEDURE [dbo].[Usp_Save_MeetingExpenses]
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
/****** Object:  StoredProcedure [dbo].[Usp_Save_TaskAssignments]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- TaskAssignments Save
CREATE PROCEDURE [dbo].[Usp_Save_TaskAssignments]
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
/****** Object:  StoredProcedure [dbo].[Usp_Save_Tasks]    Script Date: 10/18/2024 10:48:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Tasks Save
CREATE PROCEDURE [dbo].[Usp_Save_Tasks]
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
