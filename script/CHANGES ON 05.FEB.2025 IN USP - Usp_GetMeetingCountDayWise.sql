CREATE PROCEDURE Usp_GetMeetingCountDayWise  
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



    -- Temporary Table for Status Counts
    CREATE TABLE #TempTable (
        MeetingDay VARCHAR(10),
        PendingCount INT,
		CompletedCount INT,
		Seq INT
    );

    -- Populate Temporary Table
    INSERT INTO #TempTable (MeetingDay, PendingCount, CompletedCount, Seq)
    SELECT 
	    FORMAT(MeetingDate, 'dd MMM')  As MeetingDay,
        SUM((CASE WHEN ISNULL(MeetingMOM,'')='' THEN 1 ELSE 0 END))  AS PendingCount,
        SUM((CASE WHEN ISNULL(MeetingMOM,'')='' THEN 0 ELSE 1 END))  AS CompletedCount,
		Seq = ROW_NUMBER() OVER (ORDER BY MeetingDate)

    FROM Meetings M
    WHERE 
	(@UseDateFilter = 0 OR M.MeetingDate BETWEEN @StartDate AND @EndDate)
	GROUP BY MeetingDate
	ORDER BY MeetingDate

    -- Return Final Result
    SELECT 
	@UserId AS Id
	, *
    FROM #TempTable;

    -- Cleanup Temporary Table
    DROP TABLE #TempTable;
END;
GO