CREATE PROCEDURE Usp_GetMeetingByStatus  
    @UserId VARCHAR(50),  
    @StartDate DATETIME = '01 January 1900',  
    @EndDate DATETIME = '01 January 1900'  
AS  
BEGIN  
    SET NOCOUNT ON;  

    -- Adjust @StartDate and @EndDate for proper range
    IF @StartDate = '01 January 1900' AND @EndDate <> '01 January 1900'
        SET @StartDate = '1900-01-01 00:00:00';  -- Start from earliest possible date

    IF @StartDate <> '01 January 1900' AND @EndDate = '01 January 1900'
        SET @EndDate = GETDATE();  -- Till today

    -- Ensure @StartDate starts at 00:00:00 and @EndDate ends at 23:59:59
    SET @StartDate = DATEADD(DAY, DATEDIFF(DAY, 0, @StartDate), 0);  -- 00:00:00
    SET @EndDate = DATEADD(SECOND, -1, DATEADD(DAY, 1, @EndDate));   -- 23:59:59

    -- If both are '01 January 1900', ignore date filtering
    DECLARE @UseDateFilter BIT = 1;
    IF @StartDate = '01 January 1900 00:00:00' AND @EndDate = '01 January 1900 23:59:59'
        SET @UseDateFilter = 0;


    -- Ensure @StartDate <= @EndDate
    IF @StartDate > @EndDate
    BEGIN
        PRINT 'Error: @StartDate cannot be greater than @EndDate';
        RETURN;
    END


   --SELECT @StartDate, @EndDate
    -- Declare Lead Status Counters
    DECLARE @Pending INT = 0, 
            @Completed INT = 0;  

    -- Temporary Table for Status Counts
    CREATE TABLE #TempTable (
        MeetingStatus VARCHAR(50),
        CountByStatus INT
    );

    -- Populate Temporary Table
    INSERT INTO #TempTable (MeetingStatus, CountByStatus)
    SELECT 
        (CASE WHEN ISNULL(MeetingMOM,'')='' THEN 'Pending' ELSE 'Completed' END)  AS LeadStatus,
        1 AS CountByStatus
    FROM Meetings M
    
    WHERE 
	(@UseDateFilter = 0 OR M.MeetingDate BETWEEN @StartDate AND @EndDate)


	--SELECT @UseDateFilter
	--SELECT * FROM #TempTable

    -- Assign Counts Based on LeadStatus
    SELECT 
        @Pending        = SUM(CASE WHEN MeetingStatus = 'Pending' THEN CountByStatus ELSE 0 END),
        @Completed        = SUM(CASE WHEN MeetingStatus = 'Completed' THEN CountByStatus ELSE 0 END)
    FROM #TempTable;

    -- Calculate Total Lead Count
    DECLARE @TotalMeetingCount INT = @Pending + @Completed;  

    -- Return Final Result
    SELECT   
        @UserId AS Id,  
        @TotalMeetingCount AS TotalMeetingCount,  
        @Pending AS Pending,  
        @Completed AS Completed;  

    -- Cleanup Temporary Table
    DROP TABLE #TempTable;
END;
GO