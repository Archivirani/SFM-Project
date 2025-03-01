ALTER TABLE Meetings
ADD CheckInDateTime DATETIME NULL;
GO

ALTER TABLE Meetings
ADD CheckOutDateTime DATETIME NULL;
GO  


-- MeetingRequest Save  
CREATE OR ALTER PROCEDURE [dbo].[Usp_Meeting]  
   @Id UNIQUEIDENTIFIER = NULL,  
   @MeetingJson NVARCHAR(MAX)  
AS  
BEGIN  
 BEGIN TRANSACTION  
 BEGIN TRY  
    IF @Id IS NULL  
    BEGIN  
        INSERT INTO Meetings   
            (LeadId,  ContactName, Email, Address, ContactNo, MeetingPurpose, MeetingDate,   
             MeetingTypeId, MeetingLocation, IsAllDayEvent, AttendeeIDs, StartTime, EndTime, MeetingMOM, GeoLocation,  
    Latitude, Longitude,  
    CreatedBy, CreatedDate)  
        VALUES   
            (JSON_VALUE(@MeetingJson,'$.LeadId'),   
   JSON_VALUE(@MeetingJson,'$.ContactName'),  
   JSON_VALUE(@MeetingJson,'$.Email'),  
   JSON_VALUE(@MeetingJson,'$.Address'),  
   JSON_VALUE(@MeetingJson,'$.ContactNo'),  
   JSON_VALUE(@MeetingJson,'$.MeetingPurpose'),  
   JSON_VALUE(@MeetingJson,'$.MeetingDate'),  
   JSON_VALUE(@MeetingJson,'$.MeetingTypeId'),  
   JSON_VALUE(@MeetingJson,'$.MeetingLocation'),  
   ISNULL(JSON_VALUE(@MeetingJson,'$.IsAllDayEvent'),0),  
   JSON_VALUE(@MeetingJson,'$.AttendeeIDs'),  
   JSON_VALUE(@MeetingJson,'$.StartTime'),  
   JSON_VALUE(@MeetingJson,'$.EndTime'),  
   JSON_VALUE(@MeetingJson,'$.MeetingMOM'),  
   JSON_VALUE(@MeetingJson,'$.GeoLocation'),  
   JSON_VALUE(@MeetingJson,'$.Latitude'),  
   JSON_VALUE(@MeetingJson,'$.Longitude'),  
   JSON_VALUE(@MeetingJson,'$.CreatedBy'),   
   GETDATE());  
  
   SELECT 1 as [Status] ,'Meeting created successfully!' as [Message]  
    END  
    ELSE  
    BEGIN  
        UPDATE Meetings  
        SET LeadId = JSON_VALUE(@MeetingJson,'$.LeadId'),  
            ContactName = JSON_VALUE(@MeetingJson,'$.ContactName'),  
            Email = JSON_VALUE(@MeetingJson,'$.Email'),  
            Address = JSON_VALUE(@MeetingJson,'$.Address'),  
            ContactNo = JSON_VALUE(@MeetingJson,'$.ContactNo'),  
            MeetingPurpose = JSON_VALUE(@MeetingJson,'$.MeetingPurpose'),  
            MeetingDate = JSON_VALUE(@MeetingJson,'$.MeetingDate'),  
            MeetingTypeId = JSON_VALUE(@MeetingJson,'$.MeetingTypeId'),  
            MeetingLocation = JSON_VALUE(@MeetingJson,'$.MeetingLocation'),  
            IsAllDayEvent = ISNULL(JSON_VALUE(@MeetingJson,'$.IsAllDayEvent'),0),  
            MeetingMOM = JSON_VALUE(@MeetingJson,'$.MeetingMOM'),  
   AttendeeIDs = JSON_VALUE(@MeetingJson,'$.AttendeeIDs'),  
   StartTime = JSON_VALUE(@MeetingJson,'$.StartTime'),  
   EndTime = JSON_VALUE(@MeetingJson,'$.EndTime'),  
   GeoLocation =  JSON_VALUE(@MeetingJson,'$.GeoLocation'),  
   Latitude = JSON_VALUE(@MeetingJson,'$.Latitude'),  
      LongiTude  = JSON_VALUE(@MeetingJson,'$.Longitude'),  
            ModifiedBy = JSON_VALUE(@MeetingJson,'$.ModifiedBy'),  
            ModifiedDate = GETDATE(),

			CheckInDateTime = JSON_VALUE(@MeetingJson,'$.CheckInDateTime'),  
			CheckOutDateTime = JSON_VALUE(@MeetingJson,'$.CheckOutDateTime')

        WHERE MeetingId = @Id;  
  
  SELECT 1 as [Status] ,'Meeting updated successfully!' as [Message]  
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