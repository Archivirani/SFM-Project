DROP TABLE IF EXISTS Expense
GO

CREATE TABLE Expense (
    ExpenseID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    MeetingID UNIQUEIDENTIFIER NOT NULL,
    UserID VARCHAR(50) NOT NULL,
    KM DECIMAL(10, 2) NOT NULL
);

CREATE   PROCEDURE [dbo].[Usp_GetExpense_BKP_13FEB2025]    
    @Id UNIQUEIDENTIFIER = NULL,    
    @FiltersJson NVARCHAR(MAX) = NULL,    
    @Export BIT = 0    
AS    
BEGIN    
        
 IF (@Export = 1)    
    BEGIN    
        SELECT ExpenseCode as [Expense Code],    
  CONVERT(VARCHAR, ExpenseDate, 103) [Expense Date],Amount,     
  (Select top 1 CASE WHEN EA.ApprovalStatus = 1 THEN 'Approved'  WHEN EA.ApprovalStatus=2 THEN 'Rejected' ELSE 'Pending' end [Status]     
  from ExpenseApproval EA where EA.ExpenseId = M.ExpenseId    
   AND IsLastStatus = 1  
  order by CreatedDate desc)[Status]    
        FROM MeetingExpenses M    
      
    END    
    ELSE  IF (@Id IS NOT NULL)    
    BEGIN    
        SELECT ExpenseCode, CONVERT(VARCHAR, ExpenseDate, 103) as ExpenseDate, Amount,  TransportModeId, CheckedInLocation, PunchedInLocation,SupportingDocument,    
  DistanceInKm, ExpenseId, MeetingId, Remarks, UM.Name CreatedBy, MM.Name ModifiedBy, MT.CodeDesc as TransportMode    
        FROM MeetingExpenses M    
  LEFT JOIN CYGNUS_MASTER_USERS UM    
                ON M.CreatedBy = UM.UserId    
    
  LEFT JOIN CYGNUS_MASTER_USERS MM    
                ON M.ModifiedBy = MM.UserId    
        LEFT JOIN CYGNUS_Master_General MT    
                ON MT.CodeId = Cast(M.TransportModeId as varchar)    
    And MT.CodeType = 'SERCAT'    
        WHERE ExpenseId = @Id    
    END    
    ELSE    
    BEGIN    
        DECLARE @Offset INT;    
        SET @Offset = ( JSON_VALUE(@FiltersJson, '$.Page') - 1) *  JSON_VALUE(@FiltersJson, '$.PageSize');    
    
        WITH FilteredData    
        AS (SELECT ExpenseCode, ExpenseDate, Amount,ExpenseId,MeetingId, MM.Name CreatedBy,    
                   ROW_NUMBER() OVER (ORDER BY M.ExpenseId) AS RowNum,    
                   COUNT(*) OVER () AS TotalCount    
            FROM MeetingExpenses M    
    LEFT JOIN CYGNUS_MASTER_USERS MM    
                ON M.CreatedBy = MM.UserId    
   -- Expense Code    
         WHERE (JSON_VALUE(@FiltersJson, '$.ExpenseCode') IS NULL     
        OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.ExpenseCode'))) = ''     
        OR ExpenseCode LIKE '%' + JSON_VALUE(@FiltersJson, '$.ExpenseCode') + '%')    
        -- ExpenseDate    
    
        AND  (JSON_VALUE(@FiltersJson, '$.ExpenseDate') IS NULL     
     OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.ExpenseDate'))) = ''     
     OR CONVERT(DATE, ExpenseDate,105) = CONVERT(DATE, JSON_VALUE(@FiltersJson, '$.ExpenseDate'),105))    
    
           -- Amount    
          AND (JSON_VALUE(@FiltersJson, '$.Amount') IS NULL     
        OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.Amount'))) = ''     
        OR Amount LIKE '%' + JSON_VALUE(@FiltersJson, '$.Amount') + '%')    
           )    
        SELECT ExpenseCode, CONVERT(VARCHAR, ExpenseDate, 103) ExpenseDate, Amount,ExpenseId, MeetingId,CreatedBy,    
      TotalCount, (Select top 1 CASE WHEN EA.ApprovalStatus = 1 THEN 'Approved'  WHEN EA.ApprovalStatus=2 THEN 'Rejected' ELSE 'Pending' end [Status]     
  from ExpenseApproval EA where EA.ExpenseId = C.ExpenseId  
  AND IsLastStatus = 1  
  order by CreatedDate desc)[Status]    
        FROM FilteredData C    
        WHERE RowNum > @Offset    
              AND RowNum <= (@Offset +  JSON_VALUE(@FiltersJson, '$.PageSize')) -- Fetch rows within the current page range    
        ORDER BY RowNum;    
    END    
END; 
GO

CREATE OR ALTER PROC Usp_GetExpense
    @MeetingID UNIQUEIDENTIFIER = NULL,  -- Fetch specific complaint if provided
    @UserID VARCHAR(50) = NULL,  -- Fetch specific complaint if provided
    @FiltersJson NVARCHAR(MAX) = NULL,     -- Filters in JSON format
    @Export BIT = 0                        -- 1: Export all, 0: Apply pagination
AS
SET NOCOUNT ON

IF @Export = 1
	SELECT 
	ExpenseDate = [Date]
	, M.LeadID
	, L.CompanyName
	, MCIO.MeetingID
	, MCIO.UserID
	, CMU.User_Type
	, MeetingLat = Lat 
	, MeetingLng = Lng

	, MCIO.CheckIn
	, MCIO.CheckOut

	, DistanceTravelled 

	, ExpenseCode = ''
	, RequestID = ''
	, RequestDate = CAST('01 JANUARY 1900' AS DATETIME)
	, [Status] = ''
	, Amount = 0.00
	FROM
	MeetingCheckInOut MCIO
	INNER JOIN
	UserMeetingTrack UMT
	ON MCIO.MeetingID = UMT.MeetingID
	INNER JOIN
	Meetings M
	ON UMT.MeetingID = M.MeetingID
	INNER JOIN
	Leads L
	ON M.LeadId = L.LeadId
	INNER JOIN
	CYGNUS_Master_Users CMU
	ON MCIO.UserID = CMU.UserId
	WHERE
	MCIO.CheckOut IS NOT NULL

IF (@MeetingID IS NOT NULL AND @UserID IS NOT NULL) AND (@Export = 0 OR @Export IS NULL)
SELECT 
ExpenseDate = [Date]
, M.LeadID
, L.CompanyName
, MCIO.MeetingID
, MCIO.UserID
, CMU.User_Type
, MeetingLat = Lat 
, MeetingLng = Lng

, MCIO.CheckIn
, MCIO.CheckOut

, DistanceTravelled 

, ExpenseCode = ''
, RequestID = ''
, RequestDate = CAST('01 JANUARY 1900' AS DATETIME)
, [Status] = ''
, Amount = 0.00
FROM
MeetingCheckInOut MCIO
INNER JOIN
UserMeetingTrack UMT
ON MCIO.MeetingID = UMT.MeetingID
INNER JOIN
Meetings M
ON UMT.MeetingID = M.MeetingID
INNER JOIN
Leads L
ON M.LeadId = L.LeadId
INNER JOIN
CYGNUS_Master_Users CMU
ON MCIO.UserID = CMU.UserId
WHERE
MCIO.CheckOut IS NOT NULL
AND MCIO.MeetingID = @MeetingID
AND MCIO.UserID = @UserID

--SELECT @MeetingID, @UserID, @Export, (@MeetingID IS NULL OR @UserID IS NULL)  AND (@Export = 0 OR @Export IS NULL)

IF (@MeetingID IS NULL OR @UserID IS NULL)  AND (@Export = 0 OR @Export IS NULL)
BEGIN
    -- Pagination and filtering
    DECLARE @Offset INT = (JSON_VALUE(@FiltersJson, '$.Page') - 1) * JSON_VALUE(@FiltersJson, '$.PageSize');

    WITH FilteredData AS
    (

		SELECT 
			ExpenseDate = [Date]
			, M.LeadID
			, L.CompanyName
			, MCIO.MeetingID
			, MCIO.UserID
			, CMU.User_Type
			, MeetingLat = Lat 
			, MeetingLng = Lng

			, MCIO.CheckIn
			, MCIO.CheckOut


			, DistanceTravelled 

			, ExpenseCode = ''
			, RequestID = ''
			, RequestDate = CAST('01 JANUARY 1900' AS DATETIME)
			, [Status] = ''
			, Amount = 0.00,
            ROW_NUMBER() OVER (ORDER BY MCIO.Date DESC) AS RowNum,
            COUNT(*) OVER () AS TotalCount
		FROM
		MeetingCheckInOut MCIO
		INNER JOIN
		UserMeetingTrack UMT
		ON MCIO.MeetingID = UMT.MeetingID
		INNER JOIN
		Meetings M
		ON UMT.MeetingID = M.MeetingID
		INNER JOIN
		Leads L
		ON M.LeadId = L.LeadId
		INNER JOIN
		CYGNUS_Master_Users CMU
		ON MCIO.UserID = CMU.UserId
		WHERE
		MCIO.CheckOut IS NOT NULL

		    --AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.ExpenseCode') IS NULL OR C.ComplaintCode = JSON_VALUE(@FiltersJson, '$.ComplaintCode'))
            --AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.Source') IS NULL OR C.Source = JSON_VALUE(@FiltersJson, '$.Source'))
            --AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.Type') IS NULL OR C.Type = JSON_VALUE(@FiltersJson, '$.Type'))
            --AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.SubType') IS NULL OR C.SubType = JSON_VALUE(@FiltersJson, '$.SubType'))
            --AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.Priority') IS NULL OR C.Priority = JSON_VALUE(@FiltersJson, '$.Priority'))
            --AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.UserID') IS NULL OR C.UserID = JSON_VALUE(@FiltersJson, '$.UserID'))
            --AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.AssignedTo') IS NULL OR C.AssignedTo = JSON_VALUE(@FiltersJson, '$.AssignedTo'))
            AND (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.Date') IS NULL 
                OR CONVERT(DATE, [Date]) = CONVERT(DATE, JSON_VALUE(@FiltersJson, '$.Date'), 103))

    )
    
    -- Apply Pagination
    SELECT 
			ExpenseDate
			, LeadID
			, CompanyName
			, MeetingID
			, UserID
			, User_Type
			, MeetingLat
			, MeetingLng
			, CheckIn
			, CheckOut
			, DistanceTravelled 
			, ExpenseCode
			, RequestID
			, RequestDate
			, [Status]
			, Amount,
        TotalCount
    FROM FilteredData
    WHERE RowNum > @Offset
    AND RowNum <= (@Offset + JSON_VALUE(@FiltersJson, '$.PageSize'))
    ORDER BY RowNum;
END



GO