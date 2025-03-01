CREATE TABLE CYGNUS_TMS_Expense_General_Master
(
  Id INT NOT NULL IDENTITY PRIMARY KEY
  , DesignationId INT NOT NULL
  , TransportModeId INT NOT NULL
  , RatePerKM NUMERIC(18,2) NOT NULL
  , CreatedBy VARCHAR(50) NOT NULL
  , CreatedDate DATETIME DEFAULT GETDATE()
  , ModifiedBy VARCHAR(50) NULL
  , ModifiedDate DATETIME NULL
  , IsActive BIT DEFAULT ((1))
)

CREATE UNIQUE INDEX IX_Designation_TransportMode
ON CYGNUS_TMS_Expense_General_Master (DesignationId, TransportModeId);
GO

CREATE OR ALTER   PROCEDURE Usp_Add_Expense_General_Master    
    @jsonData NVARCHAR(MAX)    
AS    
BEGIN    
    SET NOCOUNT ON;    
    
 BEGIN TRAN    
    
 BEGIN TRY    
  -- Check if the combination already exists    
  IF EXISTS (  
     SELECT 1 FROM CYGNUS_TMS_Expense_General_Master     
     WHERE   
     DesignationId = JSON_VALUE(@jsonData, '$.DesignationId')   
     AND TransportModeId = JSON_VALUE(@jsonData, '$.TransportModeId')  
    )    
  BEGIN    
   RAISERROR('Combination of DesignationId and TransportModeId already exists.', 16, 1);    
   RETURN;    
  END    
    
  -- Insert new record    
  INSERT INTO CYGNUS_TMS_Expense_General_Master (DesignationId, TransportModeId, RatePerKM, CreatedBy, CreatedDate)    
  VALUES (JSON_VALUE(@jsonData, '$.DesignationId')  
  , JSON_VALUE(@jsonData, '$.TransportModeId')  
  , JSON_VALUE(@jsonData, '$.RatePerKM')  
  , JSON_VALUE(@jsonData, '$.CreatedBy')  
  , GETDATE()  
  );    
    
  COMMIT TRAN    
    
  SELECT 1 as [Status] ,'Expense General Master Record created successfully!' as [Message]     
 END TRY    
    
 BEGIN CATCH    
  ROLLBACK TRAN    
  --SELECT 0 as [Status] ,'At Line : ' + CONVERT(VARCHAR, ERROR_LINE()) + ' ' + ERROR_MESSAGE() as [Message]     
  SELECT 0 as [Status] ,ERROR_MESSAGE() as [Message]     
 END CATCH    
    
END  
GO

CREATE OR ALTER   PROCEDURE Usp_Edit_Expense_General_Master    
    @Id INT    
 , @jsonData NVARCHAR(MAX)     
AS    
BEGIN    
    SET NOCOUNT ON;    
    
 BEGIN TRAN    
    
 BEGIN TRY    
  
 IF @Id IS NULL OR @Id = 0   
  SET @Id = JSON_VALUE(@jsonData, '$.Id')  
  
  
    --SELECT @Id  
  
 IF @Id IS NULL OR (JSON_VALUE(@jsonData, '$.DesignationId') IS NOT NULL AND JSON_VALUE(@jsonData, '$.TransportModeId') IS NOT NULL)  
  SELECT @Id = Id FROM CYGNUS_TMS_Expense_General_Master   
   WHERE   
   DesignationId = JSON_VALUE(@jsonData, '$.DesignationId')  
   AND TransportModeId = JSON_VALUE(@jsonData, '$.TransportModeId')  
  
  
 --SELECT @Id  
    -- Check if the record exists    
    IF NOT EXISTS (SELECT 1 FROM CYGNUS_TMS_Expense_General_Master WHERE Id = @Id)    
    BEGIN    
        RAISERROR('Record not found.', 16, 1);    
        RETURN;    
    END    
    
    ---- Prevent duplicate active DesignationId & TransportModeId when reactivating    
    --IF @IsActive = 1 AND EXISTS (    
    --    SELECT 1     
    --    FROM CYGNUS_TMS_Expense_General_Master     
    --    WHERE DesignationId = (SELECT DesignationId FROM CYGNUS_TMS_Expense_General_Master WHERE Id = @Id)    
    --      AND TransportModeId = (SELECT TransportModeId FROM CYGNUS_TMS_Expense_General_Master WHERE Id = @Id)    
    --      AND IsActive = 1    
    --      AND Id <> @Id    
    --)    
    --BEGIN    
    --    RAISERROR('An active record with this DesignationId and TransportModeId already exists.', 16, 1);    
    --    RETURN;    
    --END    
    
    -- Update the record    
    UPDATE CYGNUS_TMS_Expense_General_Master    
    SET RatePerKM = JSON_VALUE(@jsonData, '$.RatePerKM'),    
        IsActive = JSON_VALUE(@jsonData, '$.Active'),    
        ModifiedBy = JSON_VALUE(@jsonData, '$.ModifiedBy'),    
        ModifiedDate = GETDATE()    
    WHERE Id = @Id;    
    
 COMMIT TRAN    
    
  SELECT 1 as [Status] ,'Expense General Master Record Modified successfully!' as [Message]     
    
 END TRY    
    
 BEGIN CATCH    
  ROLLBACK TRAN    
  --SELECT 0 as [Status] ,'At Line : ' + CONVERT(VARCHAR, ERROR_LINE()) + ' ' + ERROR_MESSAGE() as [Message]     
  SELECT 0 as [Status] ,ERROR_MESSAGE() as [Message]     
 END CATCH    
    
    
END 
GO


CREATE OR ALTER PROCEDURE Usp_Get_Expense_General_Master      
    @Id INT = NULL,  -- Optional parameter, if NULL, return all records     
    @FiltersJson NVARCHAR(MAX) = NULL,  
    @Export BIT = 0   
AS      
BEGIN      
    SET NOCOUNT ON;      
      
    IF @Export = 1  
    BEGIN
        SELECT   
            Id,  
            DesignationId,      
            Designation = GMD.CodeDesc,      
            TransportModeId,      
            TransportMode = GMT.CodeDesc,      
            RatePerKM,  
            EGM.CreatedBy,  
            EGM.CreatedDate,  
            EGM.ModifiedBy,  
            EGM.ModifiedDate,  
            EGM.IsActive      
        FROM       
            CYGNUS_TMS_Expense_General_Master EGM      
        INNER JOIN      
            CYGNUS_Master_General GMD      
            ON EGM.DesignationId = GMD.CodeId AND GMD.CodeType = 'DESIG' AND ISNUMERIC(GMD.CodeId) = 1     
        INNER JOIN      
            CYGNUS_Master_General GMT      
            ON EGM.TransportModeId = GMT.CodeId AND GMT.CodeType = 'SERCAT' AND ISNUMERIC(GMT.CodeId) = 1;  
    END
    ELSE IF @Id IS NOT NULL AND @Id > 0  
    BEGIN
        SELECT   
            Id,  
            DesignationId,      
            Designation = GMD.CodeDesc,      
            TransportModeId,      
            TransportMode = GMT.CodeDesc,      
            RatePerKM,  
            EGM.CreatedBy,  
            EGM.CreatedDate,  
            EGM.ModifiedBy,  
            EGM.ModifiedDate,  
            EGM.IsActive      
        FROM       
            CYGNUS_TMS_Expense_General_Master EGM      
        INNER JOIN      
            CYGNUS_Master_General GMD      
            ON EGM.DesignationId = GMD.CodeId AND GMD.CodeType = 'DESIG' AND ISNUMERIC(GMD.CodeId) = 1     
        INNER JOIN      
            CYGNUS_Master_General GMT      
            ON EGM.TransportModeId = GMT.CodeId AND GMT.CodeType = 'SERCAT' AND ISNUMERIC(GMT.CodeId) = 1    
        WHERE  
            Id = @Id;  
    END
    ELSE  
    BEGIN        
        DECLARE @Offset INT;        
        SET @Offset = ( JSON_VALUE(@FiltersJson, '$.Page') - 1) *  JSON_VALUE(@FiltersJson, '$.PageSize');        

        WITH FilteredData AS (  
            SELECT   
                Id,  
                DesignationId,      
                Designation = GMD.CodeDesc,      
                TransportModeId,      
                TransportMode = GMT.CodeDesc,      
                RatePerKM,  
                EGM.CreatedBy,  
                EGM.CreatedDate,  
                EGM.ModifiedBy,  
                EGM.ModifiedDate,  
                EGM.IsActive,      
                ROW_NUMBER() OVER (ORDER BY Id) AS RowNum,      
                COUNT(*) OVER () AS TotalCount   
            FROM       
                CYGNUS_TMS_Expense_General_Master EGM      
            INNER JOIN      
                CYGNUS_Master_General GMD      
                ON EGM.DesignationId = GMD.CodeId AND GMD.CodeType = 'DESIG' AND ISNUMERIC(GMD.CodeId) = 1     
            INNER JOIN      
                CYGNUS_Master_General GMT      
                ON EGM.TransportModeId = GMT.CodeId AND GMT.CodeType = 'SERCAT' AND ISNUMERIC(GMT.CodeId) = 1    
            WHERE  
                (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.DesignationId') IS NULL OR EGM.DesignationId = JSON_VALUE(@FiltersJson, '$.DesignationId'))  
                AND  


                (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.Designation') IS NULL OR GMD.CodeDesc = JSON_VALUE(@FiltersJson, '$.Designation'))  
                AND  

                (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.TransportModeId') IS NULL OR EGM.TransportModeId = JSON_VALUE(@FiltersJson, '$.TransportModeId'))  
                AND  

                (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.TransportMode') IS NULL OR GMT.CodeDesc = JSON_VALUE(@FiltersJson, '$.TransportMode'))  
                AND  

                (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.RatePerKM') IS NULL OR RatePerKM = JSON_VALUE(@FiltersJson, '$.RatePerKM'))  
                AND  

                (@FiltersJson IS NULL OR JSON_VALUE(@FiltersJson, '$.RecordDate') IS NULL   
                    OR LTRIM(RTRIM(JSON_VALUE(@FiltersJson, '$.RecordDate'))) = ''   
                    OR CONVERT(DATE, EGM.CreatedDate) = CONVERT(DATE, JSON_VALUE(@FiltersJson, '$.RecordDate'), 103)  
                )  
        )  

        SELECT  
            Id,  
            DesignationId,      
            Designation,     
            TransportModeId,      
            TransportMode,      
            RatePerKM,  
            CreatedBy,  
            CreatedDate = CONVERT(VARCHAR, CreatedDate, 103),  
            ModifiedBy,  
            ModifiedDate = CONVERT(VARCHAR, ModifiedDate, 103),  
            IsActive,  
            TotalCount  
        FROM FilteredData        
        WHERE RowNum > @Offset        
              AND RowNum <= (@Offset + JSON_VALUE(@FiltersJson, '$.PageSize'))  
        ORDER BY RowNum;        
    END  
END  
GO

