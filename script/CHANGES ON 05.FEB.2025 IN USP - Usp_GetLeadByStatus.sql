CREATE OR ALTER PROCEDURE Usp_GetLeadByStatus  
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
    DECLARE @Leads INT = 0, 
            @Prospects INT = 0, 
            @Suspects INT = 0, 
            @Negotiation INT = 0, 
            @FinalState INT = 0, 
            @Closed INT = 0;  

    -- Temporary Table for Status Counts
    CREATE TABLE #TempTable (
        LeadStatus VARCHAR(50),
        CountByStatus INT
    );

    -- Populate Temporary Table
    INSERT INTO #TempTable (LeadStatus, CountByStatus)
    SELECT 
        UPPER(GM.CodeDesc) AS LeadStatus,
        COUNT(*) AS CountByStatus
    FROM Leads L
    INNER JOIN CYGNUS_Master_General GM
        ON L.LeadCategoryId = GM.CodeId 
        AND GM.CodeType = 'LEADCAT'
    WHERE 
        L.IsActive = 1
        AND (@UseDateFilter = 0 OR L.LeadDate BETWEEN @StartDate AND @EndDate)
    GROUP BY GM.CodeDesc;

	--SELECT @UseDateFilter
	--SELECT * FROM #TempTable

    -- Assign Counts Based on LeadStatus
    SELECT 
        @Leads        = SUM(CASE WHEN LeadStatus = 'LEAD' THEN CountByStatus ELSE 0 END),
        @Prospects    = SUM(CASE WHEN LeadStatus IN ('PROSPECT', 'REQUEST RECEIVED', 'FINAL CONFIRMATION PENDING', 'HOLD') THEN CountByStatus ELSE 0 END),
        @Suspects     = SUM(CASE WHEN LeadStatus = 'SUSPECT' THEN CountByStatus ELSE 0 END),
        @Negotiation  = SUM(CASE WHEN LeadStatus = 'NEGOTIATION STAGE' THEN CountByStatus ELSE 0 END),
        @FinalState   = SUM(CASE WHEN LeadStatus = 'COMMERCIAL STAGE' THEN CountByStatus ELSE 0 END),
        @Closed       = SUM(CASE WHEN LeadStatus = 'CLOSED' THEN CountByStatus ELSE 0 END)
    FROM #TempTable;

    -- Calculate Total Lead Count
    DECLARE @TotalLeadCount INT = @Leads + @Prospects + @Suspects + @Negotiation + @FinalState + @Closed;  

    -- Return Final Result
    SELECT   
        @UserId AS Id,  
        @TotalLeadCount AS TotalLeadCount,  
        @Leads AS Leads,  
        @Prospects AS Prospects,  
        @Suspects AS Suspects,  
        @Negotiation AS Negotiation,  
        @FinalState AS FinalState,  
        @Closed AS Closed;  

    -- Cleanup Temporary Table
    DROP TABLE #TempTable;
END;
GO