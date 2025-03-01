CREATE OR ALTER   PROCEDURE [dbo].[Usp_GetLead]    
    @Id UNIQUEIDENTIFIER = NULL,    
    @FiltersJson NVARCHAR(MAX) = NULL,    
 @Export BIT = 0    
AS    
  
-- EXEC [Usp_GetLead] @Id = '481cddf0-6241-44e1-8b78-016626b033ec'    
  
BEGIN    
 IF (@Export = 1)    
    BEGIN    
        SELECT LC.CodeDesc [Lead Category], CompanyName as [Customer Name],    
  CONVERT(VARCHAR, LeadDate, 103) [Lead Date], U.Name  as [Assigned To]    
       FROM Leads L    
                INNER JOIN CYGNUS_Master_General LC    
                    ON LC.CodeId = Cast(L.LeadCategoryId as varchar)    
                       And CodeType = 'LEADCAT' AND CodeDesc !='PROSPECT'    
        INNER JOIN CYGNUS_Master_Users U    
                ON U.UserId = L.AssignedToId    
    END    
    ELSE  IF (@Id IS NOT NULL)    
    BEGIN    
        SELECT Lc.CodeId as LeadCategoryId,    
               LC.CodeDesc LeadCategory,    
               CompanyName,    
               ContactName,    
               LeadId,    
               CONVERT(VARCHAR, LeadDate, 103) LeadDate,    
               ISNULL(LeadSourceId,0)  LeadSourceId,    
      ISNULL(LS.CodeDesc,'Unknown') LeadSource,    
               AssignedToId,    
      U.Name AssignedTo,    
               L.IsActive,    
               RegionId,    
      LR.LocName Region,    
               BranchId,    
      LM.LocName Branch,    
               DesignationId,    
      D.CodeDesc Designation,    
               IndustryTypeId,    
      IT.CodeDesc IndustryType,    
               CityId,    
      CM.[Location] as City,    
               ServiceInterestedIDs ServiceInteresteds,    
               ContactName,    
               ContactNo,    
               L.Address,    
               Email,    
      ISNULL(UM.Name, 'UNKNOWN') CreatedBy,    
      MM.Name ModifiedBy,    
      STUFF((    
    SELECT ',' + MT.CodeDesc    
    FROM CYGNUS_Master_General MT    
    JOIN STRING_SPLIT(L.ServiceInterestedIDs, ',') AS SplitIds    
        ON MT.CodeId = SplitIds.value AND MT.CodeType='FLTPROD'    
    FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, '') as ServiceInterestedNames    
        FROM Leads L    
            INNER JOIN CYGNUS_Master_General LC    
                ON LC.CodeId = Cast(L.LeadCategoryId as varchar)    
    And LC.CodeType = 'LEADCAT'    
    
   LEFT JOIN CYGNUS_Master_General D    
                ON D.CodeId = Cast(L.DesignationId as varchar)    
    And D.CodeType = 'DESIG'    
    
   LEFT JOIN CYGNUS_Master_General IT    
                ON IT.CodeId = Cast(L.IndustryTypeId as varchar)    
    And IT.CodeType = 'IND'    
    
    LEFT JOIN CYGNUS_Master_General LS    
                ON LS.CodeId = Cast(L.LeadSourceId as varchar)    
    And LS.CodeType = 'LEADSRC'    
    
    LEFT JOIN CYGNUS_location LM    
                ON LM.LocCode = L.BranchId    
        
    LEFT JOIN CYGNUS_location LR    
                ON LR.LocCode = L.RegionId    
    
    LEFT JOIN CYGNUS_citymaster CM    
    ON CM.city_code = L.CityId    
    
     INNER JOIN CYGNUS_Master_Users U    
                ON U.UserId = L.AssignedToId    
    
      LEFT JOIN CYGNUS_MASTER_USERS UM    
                ON L.CreatedBy = UM.UserId    
    
     LEFT JOIN CYGNUS_MASTER_USERS MM    
                ON L.ModifiedBy = MM.UserId    
    
        WHERE LeadId = @Id;    
    END    
    ELSE    
    BEGIN    
        DECLARE @Offset INT;    
        SET @Offset = ( JSON_VALUE(@FiltersJson, '$.Page') - 1) *  JSON_VALUE(@FiltersJson, '$.PageSize');    
    
        WITH FilteredData    
        AS (SELECT Lc.CodeId as LeadCategoryId,    
                   LC.CodeDesc LeadCategory,    
                   CompanyName,    
                   LeadId,    
                   LeadDate,    
                   LeadSourceId,    
                   AssignedToId,    
       U.Name  as AssignedTo,    
                   L.IsActive,    
                   RegionId,    
                   BranchId,    
                   DesignationId,    
                   IndustryTypeId,    
                   CityId,    
                   ServiceInterestedIDs ServiceInteresteds,    
          ContactName,    
                   ContactNo,    
                   Address,    
                   Email,    
                   ROW_NUMBER() OVER (ORDER BY L.LeadId) AS RowNum,    
                   COUNT(*) OVER () AS TotalCount              FROM Leads L    
                INNER JOIN CYGNUS_Master_General LC    
                    ON LC.CodeId = Cast(L.LeadCategoryId as varchar)    
                       And CodeType = 'LEADCAT' AND CodeDesc !='PROSPECT'    
        INNER JOIN CYGNUS_Master_Users U    
                ON U.UserId = L.AssignedToId    
    
        --Lead Category    
         AND (JSON_VALUE(@FiltersJson, '$.LeadCategory') IS NULL     
        OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.LeadCategory'))) = ''     
        OR LC.CodeDesc LIKE '%' + JSON_VALUE(@FiltersJson, '$.LeadCategory') + '%')    
    
     --   --Lead Date    
     --       AND  (JSON_VALUE(@FiltersJson, '$.LeadDate') IS NULL     
     --OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.LeadDate'))) = ''     
     --OR CONVERT(DATE, LeadDate) = CONVERT(DATE, JSON_VALUE(@FiltersJson, '$.LeadDate')))    
    
  -- Lead Date    
  AND  (JSON_VALUE(@FiltersJson, '$.LeadDate') IS NULL     
  OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.LeadDate'))) = ''     
  OR CONVERT(DATE, LeadDate) = CONVERT(DATE, JSON_VALUE(@FiltersJson, '$.LeadDate'), 103))  
  
          AND (JSON_VALUE(@FiltersJson, '$.CustomerName') IS NULL     
        OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.CustomerName'))) = ''     
        OR CompanyName LIKE '%' + JSON_VALUE(@FiltersJson, '$.CustomerName') + '%')    
    
        AND  (JSON_VALUE(@FiltersJson, '$.LeadDate') IS NULL     
     OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.LeadDate'))) = ''     
     OR CONVERT(DATE, LeadDate, 105) = CONVERT(DATE, JSON_VALUE(@FiltersJson, '$.LeadDate'),105))    
    
      AND (JSON_VALUE(@FiltersJson, '$.AssignedTo') IS NULL     
        OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.AssignedTo'))) = ''     
        OR U.Name LIKE '%' + JSON_VALUE(@FiltersJson, '$.AssignedTo') + '%')    
           )    
        SELECT C.LeadCategoryId,    
               C.LeadCategory,    
               CompanyName,    
               ContactName,    
               LeadId,    
               CONVERT(VARCHAR, LeadDate, 103) LeadDate,    
               LeadSourceId,    
               AssignedToId,    
      AssignedTo,    
               IsActive,    
               RegionId,    
               BranchId,    
               DesignationId,    
               IndustryTypeId,    
               CityId,    
               ServiceInteresteds,    
               ContactNo,    
               Address,    
               Email,    
      TotalCount    
        FROM FilteredData C    
        WHERE RowNum > @Offset    
              AND RowNum <= (@Offset +  JSON_VALUE(@FiltersJson, '$.PageSize')) -- Fetch rows within the current page range    
        ORDER BY RowNum;    
    END    
END; 