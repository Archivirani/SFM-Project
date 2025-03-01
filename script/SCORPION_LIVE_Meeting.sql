DROP TABLE IF EXISTS MeetingCheckInOut
GO

CREATE TABLE MeetingCheckInOut (
    MeetingID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID VARCHAR(50) NOT NULL,
    IsAttendee BIT NOT NULL,
    Date DATE NOT NULL,
    CheckIn DATETIME NOT NULL,
    CheckOut DATETIME NULL,
    Lat DECIMAL(10, 6) NOT NULL,
    Lng DECIMAL(10, 6) NOT NULL
);

DROP TABLE IF EXISTS UserMeetingTrack
GO

CREATE TABLE UserMeetingTrack (
    MeetingID UNIQUEIDENTIFIER NOT NULL,
    UserID VARCHAR(50) NOT NULL,
    StartDateTime DATETIME NOT NULL,
    EndDateTime DATETIME NULL,
    DistanceTravelled DECIMAL(10, 2) NOT NULL DEFAULT 0,
    PRIMARY KEY (MeetingID, UserID)
);
GO


ALTER TABLE MeetingCheckInOut 
ALTER COLUMN Lat DECIMAL(10,6) NULL;
GO

ALTER TABLE MeetingCheckInOut 
ALTER COLUMN Lng DECIMAL(10,6) NULL;
GO

ALTER TABLE UserMeetingTrack
ALTER COLUMN DistanceTravelled DECIMAL(10, 2) NULL;
GO

CREATE OR ALTER    PROCEDURE [dbo].[Usp_GetMeeting]        
    @Id UNIQUEIDENTIFIER = NULL,        
    @FiltersJson NVARCHAR(MAX) = NULL,        
    @Export BIT = 0        
AS        
BEGIN        
        
    IF (@Export = 1)        
    BEGIN        
        SELECT L.CompanyName as [Customer Name],        
               CONVERT(VARCHAR, MeetingDate, 103) [Meeting Date],        
      StartTime [Start Time],        
               EndTime [End Time],        
               DATEDIFF(        
                           HOUR,        
                           CAST(MeetingDate + ' ' + StartTime AS DATETIME),        
                           CAST(MeetingDate + ' ' + EndTime AS DATETIME)        
                       ) AS [TAT IN Hours],     
       
     CASE        
     WHEN EXISTS (SELECT 1 FROM MeetingExpenses ME WHERE ME.MeetingId = M.MeetingId)            OR EXISTS (SELECT 1 FROM Meetings WHERE MeetingId = M.MeetingId AND ISNULL(MeetingMOM,'') <> '')               
     THEN        
                       'Completed'        
                   ELSE        
                       'Pending'        
               END [Status]        
        FROM Meetings M        
            INNER JOIN Leads L        
                ON L.LeadId = M.LeadId        
    END        
    ELSE IF (@Id IS NOT NULL)        
    BEGIN        
        SELECT M.LeadId,        
               MeetingId,        
               L.CompanyName as CustomerName,        
      FORMAT(CAST(StartTime AS DATETIME), 'HH:mm') AS [StartTime],           FORMAT(CAST(EndTime AS DATETIME), 'HH:mm') AS [EndTime],     
               CONVERT(VARCHAR, MeetingDate, 103) MeetingDate,        
               AttendeeIDS as Attendees,        
               MeetingPurpose,        
               M.ContactNo,        
               M.Email,        
               M.ContactName,        
               M.Address,        
               MeetingTypeId,        
               MeetingLocation,        
               MeetingPurpose,        
               MeetingMOM,        
      LS.CodeDesc LeadSource,        
      UM.Name CreatedBy,        
      MM.Name ModifiedBy,        
      MT.CodeDesc as MeetingType,        
      MeetingLocation,        
      GeoLocation,        
      Latitude,        
      Longitude,        
       STUFF((        
    SELECT ',' + MT.Name        
    FROM CYGNUS_Master_Users MT        
    JOIN STRING_SPLIT(M.AttendeeIDs, ',') AS SplitIds        
        ON MT.UserId = SplitIds.value         
    FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, '') as AttendeeNames        
      
 , GeoLocation AS MeetingLocationName      
  
   , M.CreatedDate  
   , M.ModifiedDate  
  
        FROM Meetings M        
            INNER JOIN Leads L        
                ON L.LeadId = M.LeadId        
       
    
  
  
    LEFT JOIN CYGNUS_Master_General LS        
                ON LS.CodeId = Cast(L.LeadSourceId as varchar)        
    And LS.CodeType = 'LEADSRC'        
        
    LEFT JOIN CYGNUS_Master_General MT        
                ON MT.CodeId = Cast(M.MeetingTypeId as varchar)        
    And MT.CodeType = 'METNGTYPE'        
        
    LEFT JOIN CYGNUS_MASTER_USERS UM        
                ON M.CreatedBy = UM.UserId        
        
    LEFT JOIN CYGNUS_MASTER_USERS MM        
                ON M.ModifiedBy = MM.UserId        
        
        WHERE MeetingId = @Id        
    END        
    ELSE        
    BEGIN        
        DECLARE @Offset INT;        
        SET @Offset = (JSON_VALUE(@FiltersJson, '$.Page') - 1) * JSON_VALUE(@FiltersJson, '$.PageSize');        
        
        WITH FilteredData        
        AS (SELECT M.LeadId,        
                   M.MeetingId,        
                   L.CompanyName as CustomerName,        
                   StartTime,        
                   EndTime,        
                   MeetingDate,        
                   AttendeeIDS as Attendees,        
                   MeetingPurpose,        
                   M.ContactNo,        
                   M.Email,        
    M.ContactName,        
                   M.Address,        
                   MeetingTypeId,        
                   MeetingLocation,        
                   MeetingMOM,        
                   ROW_NUMBER() OVER (ORDER BY M.MeetingId) AS RowNum,        
                   COUNT(*) OVER () AS TotalCount,      
       GeoLocation AS MeetingLocationName,
	   

					CheckIn = ISNULL(FORMAT(MCIO.CheckIn, 'HH:mm'), '-'),
					CheckOut = ISNULL(FORMAT(MCIO.CheckOut, 'HH:mm'), '-'),

					MeetingTimeInMins = DATEDIFF(MINUTE, MCIO.CheckIn, MCIO.CheckOut)

            FROM Meetings M
			
			LEFT OUTER JOIN 
			MeetingCheckInOut MCIO
			ON M.MeetingId = MCIO.MeetingID

                INNER JOIN Leads L        
                    ON L.LeadId = M.LeadId        
                       -- Customer Name        
                       AND (        
                               JSON_VALUE(@FiltersJson, '$.CustomerName') IS NULL        
                               OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.CustomerName'))) = ''        
                               OR L.CompanyName LIKE '%' + JSON_VALUE(@FiltersJson, '$.CustomerName') + '%'        
                           )        
     -- MeetingDate        
                      AND  (JSON_VALUE(@FiltersJson, '$.MeetingDate') IS NULL         
     OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.MeetingDate'))) = ''         
     OR CONVERT(DATE, MeetingDate,105) = CONVERT(DATE, JSON_VALUE(@FiltersJson, '$.MeetingDate'),105))        
        
      AND (        
                               JSON_VALUE(@FiltersJson, '$.StartTime') IS NULL        
                               OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.StartTime'))) = ''        
                               OR StartTime LIKE '%' + JSON_VALUE(@FiltersJson, '$.StartTime') + '%'        
                           )        
          AND (        
                               JSON_VALUE(@FiltersJson, '$.EndTime') IS NULL        
                               OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.EndTime'))) = ''        
                               OR EndTime LIKE '%' + JSON_VALUE(@FiltersJson, '$.EndTime') + '%'        
                           ) AND (        
                               JSON_VALUE(@FiltersJson, '$.Tat') IS NULL        
                               OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.Tat'))) = ''        
                               OR DATEDIFF(        
                           HOUR,        
                           CAST(MeetingDate + ' ' + StartTime AS DATETIME),        
                           CAST(MeetingDate + ' ' + EndTime AS DATETIME)        
                       )  LIKE '%' + JSON_VALUE(@FiltersJson, '$.Tat') + '%'        
                           )        
           )        
        SELECT LeadId,        
               MeetingId,        
               CustomerName,        
               StartTime,        
               EndTime,        
               CONVERT(VARCHAR, MeetingDate, 103) MeetingDate,        
               Attendees,        
               MeetingPurpose,        
               ContactNo,        
               Email,        
               ContactName,        
               Address,        
               MeetingTypeId,        
               MeetingLocation,        
               MeetingMOM,        
               TotalCount,        

			   CheckIn,
			   CheckOut,
			   MeetingTimeInMins,
   CASE         WHEN EXISTS (SELECT 1 FROM MeetingExpenses ME WHERE ME.MeetingId = C.MeetingId)           OR EXISTS (SELECT 1 FROM Meetings WHERE MeetingId = C.MeetingId AND ISNULL(MeetingMOM,'') <> '')         THEN 'Completed'         ELSE 'Pending'     
  
   END AS MeetingStatus,       
               DATEDIFF(        
                           HOUR,        
                           CAST(MeetingDate + ' ' + StartTime AS DATETIME),        
                           CAST(MeetingDate + ' ' + EndTime AS DATETIME)        
                       ) as TATinHrs,      
              
  MeetingLocationName      
        FROM FilteredData C        
        WHERE RowNum > @Offset        
              AND RowNum <= (@Offset + JSON_VALUE(@FiltersJson, '$.PageSize')) -- Fetch rows within the current page range        
        ORDER BY RowNum;        
    END        
END;        
GO

CREATE OR ALTER  PROCEDURE Usp_AddMeetingCheckInOut   
    @jsonData NVARCHAR(MAX)    
AS    
BEGIN    
    SET NOCOUNT ON;    
    BEGIN TRANSACTION;    
    
    BEGIN TRY    
        -- Extract values from JSON    
        DECLARE @MeetingID UNIQUEIDENTIFIER = JSON_VALUE(@jsonData, '$.MeetingID');    
        DECLARE @UserID VARCHAR(50) = JSON_VALUE(@jsonData, '$.UserID');    
        DECLARE @IsAttendee BIT = JSON_VALUE(@jsonData, '$.IsAttendee');    
        DECLARE @Date DATE = JSON_VALUE(@jsonData, '$.Date');    
        DECLARE @CheckIn DATETIME = JSON_VALUE(@jsonData, '$.CheckIn');    
        DECLARE @CheckOut DATETIME = JSON_VALUE(@jsonData, '$.CheckOut');    
        DECLARE @Lat DECIMAL(10,6) = JSON_VALUE(@jsonData, '$.Lat');    
        DECLARE @Lng DECIMAL(10,6) = JSON_VALUE(@jsonData, '$.Lng');    
    
        DECLARE @LastLat DECIMAL(10,6) = NULL;    
        DECLARE @LastLng DECIMAL(10,6) = NULL;    
        DECLARE @DistanceTravelled DECIMAL(10,2) = 0;    
        DECLARE @HasMeetingsToday BIT = 0;    
        DECLARE @HasPunchedOut BIT = 0;    
        DECLARE @IsFirstMeeting BIT = 0;    
    
        DECLARE @MeetingLat DECIMAL(10,6) = NULL;    
        DECLARE @MeetingLng DECIMAL(10,6) = NULL;    
		DECLARE @MeetingAndCheckInOutDistanceCheck DECIMAL(10,2) = 0; 

		SELECT @MeetingLat = Latitude , @MeetingLng = Longitude
		FROM
		Meetings WHERE MeetingId = @MeetingID

		IF @CheckOut IS NOT NULL
		SELECT @MeetingLat = Lat , @MeetingLng = Lng
		FROM
		MeetingCheckInOut WHERE MeetingId = @MeetingID


		IF @CheckOut IS NULL AND (@MeetingLat IS NULL OR @MeetingLng IS NULL)
			THROW 50001, 'Meeting Lat/Lng not defined', 1;

		IF @CheckOut IS NOT NULL AND (@MeetingLat IS NULL OR @MeetingLng IS NULL)
			THROW 50001, 'Check In Lat/Lng not defined', 1;


		SET @MeetingAndCheckInOutDistanceCheck = 
			(6371000 * ACOS(
				COS(RADIANS(@MeetingLat)) * COS(RADIANS(@Lat)) 
				* COS(RADIANS(@Lng) - RADIANS(@MeetingLng)) 
				+ SIN(RADIANS(@MeetingLat)) * SIN(RADIANS(@Lat))
			));

		IF @CheckOut IS NULL AND @MeetingAndCheckInOutDistanceCheck > 500
			THROW 50001, 'Check In is out of 500mts of Meeting Location', 1;

		IF @CheckOut IS NOT NULL AND @MeetingAndCheckInOutDistanceCheck > 500
			THROW 50001, 'Check Out is out of 500mts of Check In Location', 1;


  --SELECT @UserID, @Date    
    
        -- Check if this is the first meeting of the day    
  IF (SELECT COUNT(*) FROM MeetingCheckInOut WHERE UserID = @UserID AND Date = @Date) = 1    
        --IF NOT EXISTS (SELECT 1 FROM MeetingCheckInOut WHERE UserID = @UserID AND Date = @Date)    
        BEGIN    
            SET @IsFirstMeeting = 1;    
        END    
    
  --SELECT @IsFirstMeeting    
    
    
        -- Determine the last location based on conditions    
        IF @IsFirstMeeting = 1    
        BEGIN    
            -- If first meeting, use PunchOut location if available, else PunchIn location    
            SELECT TOP 1 @LastLat = COALESCE(PunchOutLat, PunchInLat),     
                         @LastLng = COALESCE(PunchOutLng, PunchInLng)    
            FROM Attendance WHERE UserID = @UserID AND Date = @Date;    
    
			IF @IsFirstMeeting = 1 AND (@LastLat IS NULL OR @LastLng IS NULL)
				THROW 50001, 'Attendance Punch In was not done for the day', 1;

   --SELECT '@Attendance', @LastLat, @LastLng    
        END    
        ELSE    
        BEGIN    
            -- Get last meeting's location    
            SELECT TOP 1 @LastLat = Lat, @LastLng = Lng    
            FROM MeetingCheckInOut WHERE UserID = @UserID AND Date = @Date     
   AND MeetingID NOT IN (@MeetingID)  AND CheckOut is NOT NULL  
   ORDER BY CheckIn DESC;    

			IF @IsFirstMeeting = 0 AND (@LastLat IS NULL OR @LastLng IS NULL)
				THROW 50001, 'Last Meeting Check out Lat/Lng is not defined', 1;


        END    
    
  --SELECT @LastLat, @LastLng    
    
        -- Calculate Distance if previous location exists    
        IF @LastLat IS NOT NULL AND @LastLng IS NOT NULL    
        BEGIN    
            SET @DistanceTravelled =     
                (111.045 * DEGREES(ACOS(COS(RADIANS(@LastLat))    
                * COS(RADIANS(@Lat))    
                * COS(RADIANS(@Lng) - RADIANS(@LastLng))    
                + SIN(RADIANS(@LastLat)) * SIN(RADIANS(@Lat)) )));    
        END    
    
  --SELECT @DistanceTravelled    
    
        -- **CHECK-IN HANDLING**    
        IF @CheckIn IS NOT NULL AND @CheckOut IS NULL    
        BEGIN    
            -- Insert into MeetingCheckInOut    
            INSERT INTO MeetingCheckInOut (MeetingID, UserID, IsAttendee, Date, CheckIn, Lat, Lng, CheckOut)    
            VALUES (@MeetingID, @UserID, @IsAttendee, @Date, @CheckIn, @Lat, @Lng, NULL);    
    
            -- Insert into UserMeetingTrack    
            INSERT INTO UserMeetingTrack (MeetingID, UserID, StartDateTime, DistanceTravelled)    
            VALUES (@MeetingID, @UserID, @CheckIn, @DistanceTravelled);    
        END    
        ELSE IF @CheckOut IS NOT NULL  -- **CHECK-OUT HANDLING**    
        BEGIN    
            -- Update MeetingCheckInOut with CheckOut    
            UPDATE MeetingCheckInOut    
            SET CheckOut = @CheckOut, Lat = @Lat, Lng = @Lng    
            WHERE MeetingID = @MeetingID AND UserID = @UserID AND Date = @Date;    
    
            -- Update UserMeetingTrack with EndDateTime & distance traveled    
            UPDATE UserMeetingTrack    
            SET EndDateTime = @CheckOut, DistanceTravelled = ISNULL(DistanceTravelled,0) + @DistanceTravelled    
            WHERE MeetingID = @MeetingID AND UserID = @UserID;    
        END    
    
        COMMIT TRANSACTION;    
        SELECT 1 AS [Status], 'Meeting Check-In/Out recorded successfully!', @MeetingID AS [MeetingID];    
    END TRY    
    BEGIN CATCH    
        ROLLBACK TRANSACTION;    
        SELECT 0 AS [Status], ERROR_MESSAGE() AS [Message];    
    END CATCH;  
   
END; 
GO

