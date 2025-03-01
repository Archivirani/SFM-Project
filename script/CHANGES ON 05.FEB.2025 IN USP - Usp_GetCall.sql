CREATE OR ALTER   PROCEDURE [dbo].[Usp_GetCall]    
    @Id UNIQUEIDENTIFIER = NULL,    
    @FiltersJson NVARCHAR(MAX) = NULL,    
    @Export BIT = 0    
AS    
  
-- MeetingRequest GetAll    
--EXEC Usp_GetCall @FiltersJson = '{"CallDate":"null","Page":"1","PageSize":"5"}'    
  
BEGIN    
    IF (@Export = 1)    
    BEGIN    
        SELECT CL.CodeDesc [Category Name],    
               CONVERT(VARCHAR, C.CallDate, 103) [Call Date],    
               L.CompanyName as [Customer Name],    
               StartTime [Start Time],    
               EndTime [End Time],    
               CS.CodeDesc [Status]    
        FROM Calls C    
            INNER JOIN Leads L    
                ON L.LeadId = C.LeadId    
            INNER JOIN CYGNUS_Master_General CL    
                ON Cast(C.CallCategoryId as varchar) = CL.CodeId    
                   AND CL.CodeType = 'CALLCAT'    
            LEFT JOIN CYGNUS_Master_General CS    
                ON Cast(C.CallStatusId as varchar) = CS.CodeId    
                   AND CS.CodeType = 'CALLSTATUS'    
    END    
    ELSE IF (@Id IS NOT NULL)    
    BEGIN    
        SELECT C.LeadId,    
               C.CallId,    
               L.CompanyName as CustomerName,    
               --C.StartTime,    
               --C.EndTime,
			   
      FORMAT(CAST(C.StartTime AS DATETIME), 'HH:mm') AS [StartTime],           
	  FORMAT(CAST(C.EndTime AS DATETIME), 'HH:mm') AS [EndTime], 

               CONVERT(VARCHAR, C.CallDate, 103) CallDate,    
               C.AttendeeIDS as Attendees,    
               C.CallCategoryId,    
               C.CallPurpose,    
               CL.CodeDesc CallCategoryName,    
               C.Remarks,    
               CP.CodeDesc Purpose,    
               C.CallStatusId,    
               CS.CodeDesc CallStatus,    
               C.CallMoM as CallMOM,    
               CM.Name CreatedBy,    
               MM.Name ModifiedBy,    
               STUFF(    
                        (    
                            SELECT ',' + MT.Name    
                            FROM CYGNUS_Master_Users MT    
                                JOIN STRING_SPLIT(C.AttendeeIDs, ',') AS SplitIds    
                                    ON MT.UserId = SplitIds.value    
                            FOR XML PATH(''), TYPE    
                        ).value('.', 'NVARCHAR(MAX)'),    
                        1,    
                        1,    
                        ''    
                    ) as AttendeeNames    
    , C.CreatedDate  
    , C.ModifiedDate  
        FROM Calls C    
            INNER JOIN Leads L    
                ON L.LeadId = C.LeadId    
            INNER JOIN CYGNUS_Master_General CL    
                ON Cast(C.CallCategoryId as varchar) = CL.CodeId    
                   AND CL.CodeType = 'CALLCAT'    
            LEFT JOIN CYGNUS_Master_General CP    
                ON Cast(C.CallCategoryId as varchar) = CP.CodeId    
                   AND CP.CodeType = 'CALLPUR'    
            LEFT JOIN CYGNUS_Master_General CS    
                ON Cast(C.CallStatusId as varchar) = CS.CodeId    
                   AND CS.CodeType = 'CALLSTATUS'    
            LEFT JOIN CYGNUS_MASTER_USERS CM    
                ON C.CreatedBy = CM.UserId    
            LEFT JOIN CYGNUS_MASTER_USERS MM    
                ON C.ModifiedBy = MM.UserId    
        WHERE CallId = @Id    
    END    
    ELSE    
    BEGIN    
        DECLARE @Offset INT;    
        SET @Offset = (JSON_VALUE(@FiltersJson, '$.Page') - 1) * JSON_VALUE(@FiltersJson, '$.PageSize');    
    
        WITH FilteredData    
        AS (SELECT C.LeadId,    
                   C.CallId,    
                   L.CompanyName as CustomerName,    
                   C.StartTime,    
                   C.EndTime,    
                   CONVERT(VARCHAR, C.CallDate, 103) CallDate,    
                   C.AttendeeIDS as Attendees,    
                   C.CallCategoryId,    
                   C.CallPurpose,    
                   CS.CodeDesc CallStatus,    
                   CL.CodeDesc CallCategoryName,    
                   ROW_NUMBER() OVER (ORDER BY C.CallId) AS RowNum,    
                   COUNT(*) OVER () AS TotalCount,    
       C.CreatedDate,  
       C.ModifiedDate  
            FROM Calls C    
                INNER JOIN Leads L    
                    ON L.LeadId = C.LeadId    
                INNER JOIN CYGNUS_Master_General CL    
                    ON Cast(C.CallCategoryId as varchar) = CL.CodeId    
                       AND CL.CodeType = 'CALLCAT'    
                LEFT JOIN CYGNUS_Master_General CS    
                    ON Cast(C.CallStatusId as varchar) = CS.CodeId    
                       AND CS.CodeType = 'CALLSTATUS'    
    
            -- Optional search filter    
            -- Call Category    
            WHERE (    
                      JSON_VALUE(@FiltersJson, '$.CallCategory') IS NULL    
                      OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.CallCategory'))) = ''    
                      OR CL.CodeDesc LIKE '%' + JSON_VALUE(@FiltersJson, '$.CallCategory') + '%'    
                  )    
    
                  -- CustomerName    
                  AND (    
                          JSON_VALUE(@FiltersJson, '$.CallDate') IS NULL    
                          OR JSON_VALUE(@FiltersJson, '$.CallDate') = 'null'    
                          OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.CallDate'))) = ''    
                          OR CONVERT(VARCHAR, C.CallDate, 103) = JSON_VALUE(@FiltersJson, '$.CallDate')    
                      )    
    
                  -- CustomerName    
                  AND (    
                          JSON_VALUE(@FiltersJson, '$.CustomerName') IS NULL    
                          OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.CustomerName'))) = ''    
                          OR L.CompanyName LIKE '%' + JSON_VALUE(@FiltersJson, '$.CustomerName') + '%'    
                      )    
                  AND (    
                          JSON_VALUE(@FiltersJson, '$.startTime') IS NULL    
                          OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.startTime'))) = ''    
                          OR StartTime LIKE '%' + JSON_VALUE(@FiltersJson, '$.startTime') + '%'    
                      )    
                  AND (    
                          JSON_VALUE(@FiltersJson, '$.endTime') IS NULL    
                          OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.endTime'))) = ''    
                          OR EndTime LIKE '%' + JSON_VALUE(@FiltersJson, '$.endTime') + '%'    
                      )    
           )    
        SELECT C.LeadId,    
               C.CallId,    
               C.CustomerName,    
               C.StartTime,    
               C.EndTime,    
               CONVERT(VARCHAR, C.CallDate, 103) CallDate,    
               C.Attendees,    
               C.CallCategoryId,    
               C.CallPurpose,    
               C.CallCategoryName,    
               TotalCount,    
               CallStatus    
        FROM FilteredData C    
        WHERE RowNum > @Offset    
              AND RowNum <= (@Offset + JSON_VALUE(@FiltersJson, '$.PageSize')) -- Fetch rows within the current page range    
        ORDER BY RowNum;    
    
    END    
END;    