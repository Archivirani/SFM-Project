-- ADDED  	 , M.CreatedDate, M.ModifiedDate IF @id IS NOT NULL

CREATE  OR ALTER  PROCEDURE [dbo].[Usp_GetMeeting]      
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
                   MeetingId,      
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
       GeoLocation AS MeetingLocationName    
            FROM Meetings M      
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