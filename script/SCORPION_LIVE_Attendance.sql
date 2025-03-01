DROP TABLE IF EXISTS Attendance
GO

CREATE TABLE Attendance (
    AttendanceID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID VARCHAR(50) NOT NULL,
    Date DATE NOT NULL,
    PunchIn DATETIME NULL,
    PunchInLat DECIMAL(10, 6) NULL,
    PunchInLng DECIMAL(10, 6) NULL,
    PunchOut DATETIME NULL,
    PunchOutLat DECIMAL(10, 6) NULL,
    PunchOutLng DECIMAL(10, 6) NULL
);
GO

CREATE OR ALTER PROCEDURE Usp_AddOrUpdate_Attendance
    @jsonData NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @UserID VARCHAR(50) = JSON_VALUE(@jsonData, '$.UserID');
        DECLARE @Date DATE = JSON_VALUE(@jsonData, '$.Date');
        DECLARE @PunchIn DATETIME = JSON_VALUE(@jsonData, '$.PunchIn');
        DECLARE @PunchInLat DECIMAL(10,6) = JSON_VALUE(@jsonData, '$.PunchInLat');
        DECLARE @PunchInLng DECIMAL(10,6) = JSON_VALUE(@jsonData, '$.PunchInLng');
        DECLARE @PunchOut DATETIME = JSON_VALUE(@jsonData, '$.PunchOut');
        DECLARE @PunchOutLat DECIMAL(10,6) = JSON_VALUE(@jsonData, '$.PunchOutLat');
        DECLARE @PunchOutLng DECIMAL(10,6) = JSON_VALUE(@jsonData, '$.PunchOutLng');

        DECLARE @ExistingAttendanceID UNIQUEIDENTIFIER;

        -- Check if an attendance record exists for the user on the given date
        SELECT @ExistingAttendanceID = AttendanceID 
        FROM Attendance 
        WHERE UserID = @UserID AND Date = @Date;

        IF @ExistingAttendanceID IS NOT NULL
        BEGIN
            -- If record exists, update Punch In or Punch Out
            UPDATE Attendance
            SET 
                PunchIn = COALESCE(PunchIn, @PunchIn),
                PunchInLat = COALESCE(PunchInLat, @PunchInLat),
                PunchInLng = COALESCE(PunchInLng, @PunchInLng),
                PunchOut = COALESCE(PunchOut, @PunchOut),
                PunchOutLat = COALESCE(PunchOutLat, @PunchOutLat),
                PunchOutLng = COALESCE(PunchOutLng, @PunchOutLng)
            WHERE AttendanceID = @ExistingAttendanceID;

            SELECT 1 AS [Status], 'Attendance record updated successfully!' AS [Message], @ExistingAttendanceID AS [AttendanceID];
        END
        ELSE
        BEGIN
            -- If no record exists, insert a new one
            DECLARE @NewAttendanceID UNIQUEIDENTIFIER = NEWID();
            
            INSERT INTO Attendance (AttendanceID, UserID, Date, PunchIn, PunchInLat, PunchInLng, PunchOut, PunchOutLat, PunchOutLng)
            VALUES (@NewAttendanceID, @UserID, @Date, @PunchIn, @PunchInLat, @PunchInLng, @PunchOut, @PunchOutLat, @PunchOutLng);

            SELECT 1 AS [Status], 'Attendance record created successfully!' AS [Message], @NewAttendanceID AS [AttendanceID];
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 0 AS [Status], ERROR_MESSAGE() AS [Message];
    END CATCH;
END;
GO


CREATE OR ALTER PROC usp_Get_AttendancePunchInOut
@UserId VARCHAR(50)
AS

SET NOCOUNT ON

SELECT U.UserId
, IsPunchIn = (CASE WHEN PunchIn IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END)
, PunchIn 
, IsPunchOut = (CASE WHEN PunchOut IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END)
, PunchOut

, PunchInLat
, PunchInLng

, PunchOutLat
, PunchOutLng

FROM
CYGNUS_Master_Users U
LEFT OUTER JOIN
Attendance A
ON U.UserId = A.UserID AND CONVERT(VARCHAR,A.PunchIn,103) = CONVERT(VARCHAR,GETDATE(),103)
WHERE
U.UserID = @UserId
GO
