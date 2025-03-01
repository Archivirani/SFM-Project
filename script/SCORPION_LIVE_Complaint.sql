DROP TABLE IF EXISTS Complaint
GO

CREATE TABLE Complaint (
    ComplaintID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ComplaintCode NVARCHAR(50) NOT NULL,
    Date DATE NOT NULL,
    Source INT NOT NULL,
    Type INT NOT NULL,
    SubType INT NOT NULL,
    Priority INT NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    CustomerID UNIQUEIDENTIFIER NULL,
    CustomerEmail NVARCHAR(100) NULL,
    UserID VARCHAR(50) NOT NULL,
    Document NVARCHAR(255) NULL,
    DocumentNo NVARCHAR(50) NULL,
    AssignedTo UNIQUEIDENTIFIER NULL,
    CloseDate DATETIME NULL,
    CloseBy UNIQUEIDENTIFIER NULL,
    CloseRemark NVARCHAR(500) NULL,
    SupportDocumentsId UNIQUEIDENTIFIER NULL
);
GO


CREATE OR ALTER PROCEDURE Usp_Add_Complaint
    @jsonData NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @ComplaintID UNIQUEIDENTIFIER = NEWID();
        DECLARE @NewComplaintCode NVARCHAR(20);
        DECLARE @LastComplaintCode NVARCHAR(20);
        DECLARE @NextNumber INT;

        -- Get the last ComplaintCode and extract the numeric part
        SELECT TOP 1 @LastComplaintCode = ComplaintCode
        FROM Complaint
        WHERE ISNUMERIC(RIGHT(ComplaintCode, 6)) = 1
        ORDER BY ComplaintID DESC; -- Assuming ComplaintID is sequential

        -- Determine the next ComplaintCode
        SET @NextNumber = COALESCE(CAST(RIGHT(@LastComplaintCode, 6) AS INT), 0) + 1;
        SET @NewComplaintCode = 'COMP' + FORMAT(@NextNumber, '000000');

        -- Insert new record
        INSERT INTO Complaint (
            ComplaintID, ComplaintCode, Date, Source, Type, SubType, Priority, Description,
            CustomerID, CustomerEmail, UserID, Document, DocumentNo, AssignedTo
        )
        VALUES (
            @ComplaintID,
            @NewComplaintCode,  -- Auto-generated ComplaintCode
            JSON_VALUE(@jsonData, '$.Date'),
            JSON_VALUE(@jsonData, '$.Source'),
            JSON_VALUE(@jsonData, '$.Type'),
            JSON_VALUE(@jsonData, '$.SubType'),
            JSON_VALUE(@jsonData, '$.Priority'),
            JSON_VALUE(@jsonData, '$.Description'),
            JSON_VALUE(@jsonData, '$.CustomerID'),
            JSON_VALUE(@jsonData, '$.CustomerEmail'),
            JSON_VALUE(@jsonData, '$.UserID'),
            JSON_VALUE(@jsonData, '$.Document'),
            JSON_VALUE(@jsonData, '$.DocumentNo'),
            JSON_VALUE(@jsonData, '$.AssignedTo')
        );

        COMMIT TRANSACTION;

        SELECT 1 AS [Status], 'Complaint record created successfully!' AS [Message], 
               @ComplaintID AS [ComplaintID], @NewComplaintCode AS [ComplaintCode];
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 0 AS [Status], ERROR_MESSAGE() AS [Message];
    END CATCH;
END;
GO


CREATE OR ALTER PROCEDURE Usp_Close_Complaint
    @jsonData NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @ComplaintID UNIQUEIDENTIFIER = JSON_VALUE(@jsonData, '$.ComplaintID');
        DECLARE @CloseBy UNIQUEIDENTIFIER = JSON_VALUE(@jsonData, '$.CloseBy');
        DECLARE @CloseRemark NVARCHAR(500) = JSON_VALUE(@jsonData, '$.CloseRemark');
        --DECLARE @SupportDocumentsId UNIQUEIDENTIFIER = JSON_VALUE(@jsonData, '$.SupportDocumentsId');
        DECLARE @CloseDate DATETIME = GETDATE();

        -- Check if the complaint exists
        IF NOT EXISTS (SELECT 1 FROM Complaint WHERE ComplaintID = @ComplaintID)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS [Status], 'Complaint not found' AS [Message];
            RETURN;
        END

        -- Update the complaint record
        UPDATE Complaint
        SET 
            CloseDate = @CloseDate,
            CloseBy = @CloseBy,
            CloseRemark = @CloseRemark
            --SupportDocumentsId = COALESCE(@SupportDocumentsId, SupportDocumentsId)
        WHERE ComplaintID = @ComplaintID;

        COMMIT TRANSACTION;
        
        SELECT 1 AS [Status], 'Complaint closed successfully!' AS [Message], @ComplaintID AS [ComplaintID];
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 0 AS [Status], ERROR_MESSAGE() AS [Message];
    END CATCH;
END;
GO

CREATE OR ALTER PROCEDURE Usp_Get_Complaint
    @ComplaintID UNIQUEIDENTIFIER = NULL,  -- Fetch specific complaint if provided
    @FiltersJson NVARCHAR(MAX) = NULL,     -- Filters in JSON format
    @Export BIT = 0                        -- 1: Export all, 0: Apply pagination
AS
BEGIN
    SET NOCOUNT ON;

    -- Export Mode: Return all records
    IF @Export = 1
    BEGIN
        SELECT 
            C.ComplaintID, 
            C.ComplaintCode, 
            C.Date, 
            C.Source, 
            C.Type, 
            C.SubType, 
            C.Priority, 
            C.Description, 
            C.CustomerID, 
            C.CustomerEmail, 
            C.UserID, 
            C.Document, 
            C.DocumentNo, 
            C.AssignedTo, 
            C.CloseDate, 
            C.CloseBy, 
            C.CloseRemark, 
            C.SupportDocumentsId
        FROM Complaint C;
        RETURN;
    END

    -- Fetch specific complaint by ID
    IF @ComplaintID IS NOT NULL
    BEGIN
        SELECT 
            C.ComplaintID, 
            C.ComplaintCode, 
            C.Date, 
            C.Source, 
            C.Type, 
            C.SubType, 
            C.Priority, 
            C.Description, 
            C.CustomerID, 
            C.CustomerEmail, 
            C.UserID, 
            C.Document, 
            C.DocumentNo, 
            C.AssignedTo, 
            C.CloseDate, 
            C.CloseBy, 
            C.CloseRemark, 
            C.SupportDocumentsId
        FROM Complaint C
        WHERE C.ComplaintID = @ComplaintID;
        RETURN;
    END

    -- Pagination and filtering
    DECLARE @Offset INT = (JSON_VALUE(@FiltersJson, '$.Page') - 1) * JSON_VALUE(@FiltersJson, '$.PageSize');

    WITH FilteredData AS
    (
        SELECT 
            C.ComplaintID, 
            C.ComplaintCode, 
            C.Date, 
            C.Source, 
            C.Type, 
            C.SubType, 
            C.Priority, 
            C.Description, 
            C.CustomerID, 
            C.CustomerEmail, 
            C.UserID, 
            C.Document, 
            C.DocumentNo, 
            C.AssignedTo, 
            C.CloseDate, 
            C.CloseBy, 
            C.CloseRemark, 
            C.SupportDocumentsId,
            ROW_NUMBER() OVER (ORDER BY C.Date DESC) AS RowNum,
            COUNT(*) OVER () AS TotalCount
        FROM Complaint C
        WHERE
            (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.ComplaintCode') IS NULL OR C.ComplaintCode = JSON_VALUE(@FiltersJson, '$.ComplaintCode'))
            AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.Source') IS NULL OR C.Source = JSON_VALUE(@FiltersJson, '$.Source'))
            AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.Type') IS NULL OR C.Type = JSON_VALUE(@FiltersJson, '$.Type'))
            AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.SubType') IS NULL OR C.SubType = JSON_VALUE(@FiltersJson, '$.SubType'))
            AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.Priority') IS NULL OR C.Priority = JSON_VALUE(@FiltersJson, '$.Priority'))
            AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.UserID') IS NULL OR C.UserID = JSON_VALUE(@FiltersJson, '$.UserID'))
            AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.AssignedTo') IS NULL OR C.AssignedTo = JSON_VALUE(@FiltersJson, '$.AssignedTo'))
            AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.Date') IS NULL 
                OR CONVERT(DATE, C.Date) = CONVERT(DATE, JSON_VALUE(@FiltersJson, '$.Date'), 103))
    )
    
    -- Apply Pagination
    SELECT 
        ComplaintID, 
        ComplaintCode, 
        Date, 
        Source, 
        Type, 
        SubType, 
        Priority, 
        Description, 
        CustomerID, 
        CustomerEmail, 
        UserID, 
        Document, 
        DocumentNo, 
        AssignedTo, 
        CloseDate, 
        CloseBy, 
        CloseRemark, 
        SupportDocumentsId,
        TotalCount
    FROM FilteredData
    WHERE RowNum > @Offset
    AND RowNum <= (@Offset + JSON_VALUE(@FiltersJson, '$.PageSize'))
    ORDER BY RowNum;
END;
GO
