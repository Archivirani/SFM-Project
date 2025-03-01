CREATE OR ALTER PROCEDURE Usp_GetLeadBySource  
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
    -- Declare Lead Source Counters
    DECLARE @PhoneLeads INT, @EmailLeads INT, @WhatsappLeads INT, @WebBotLeads INT, 
			@Advertise INT, 
			@SocialMedia INT, 
			@Event INT, 
			@UserType VARCHAR(20);  


    -- Temporary Table for Status Counts
    CREATE TABLE #TempTable (
        LeadSource VARCHAR(50),
        CountBySource INT
    );

    -- Populate Temporary Table
    INSERT INTO #TempTable (LeadSource, CountBySource)
    SELECT 
        UPPER(GM.CodeDesc) AS LeadStatus,
        COUNT(*) AS CountByStatus
    FROM Leads L
    INNER JOIN CYGNUS_Master_General GM
        ON L.LeadCategoryId = GM.CodeId 
        AND GM.CodeType = 'LEADSRC'
    WHERE 
        L.IsActive = 1
        AND (@UseDateFilter = 0 OR L.LeadDate BETWEEN @StartDate AND @EndDate)
    GROUP BY GM.CodeDesc;

	--SELECT @UseDateFilter
	--SELECT * FROM #TempTable


    -- Assign Counts Based on LeadStatus
    SELECT 
        @PhoneLeads        = SUM(CASE WHEN LeadSource IN ('OUTBOUND CALL','INBOUND CALL') THEN CountBySource ELSE 0 END),
        @EmailLeads    = SUM(CASE WHEN LeadSource IN ('REFERRAL') THEN CountBySource ELSE 0 END),
        @WhatsappLeads     = SUM(CASE WHEN LeadSource IN ('WHATSAPP') THEN CountBySource ELSE 0 END),
        @WebBotLeads  = SUM(CASE WHEN LeadSource IN ('WEBSITE') THEN CountBySource ELSE 0 END),
        @Advertise   = SUM(CASE WHEN LeadSource IN ('ADVERTISING') THEN CountBySource ELSE 0 END),
        @SocialMedia       = SUM(CASE WHEN LeadSource IN ('SOCIAL MEDIA') THEN CountBySource ELSE 0 END),
        @Event       = SUM(CASE WHEN LeadSource IN ('EVENT') THEN CountBySource ELSE 0 END)
    FROM #TempTable;

    -- Calculate Total Lead Count
    DECLARE @TotalLeadCount INT = @PhoneLeads + @EmailLeads + @WhatsappLeads 
			+ @WebBotLeads + @Advertise + @SocialMedia + @Event;  

    -- Return Final Result
    SELECT   
        @UserId AS Id,  
        @TotalLeadCount AS TotalLeadCount,  
        @PhoneLeads AS PhoneLeads,  
        @EmailLeads AS EmailLeads,  
        @WhatsappLeads AS WhatsappLeads,  
        @WebBotLeads AS WebBotLeads,
        @Advertise AS AdLeads,		
        @SocialMedia AS SocialMediaLeads,		
        @Event AS SocialMediaLeads;    

    -- Cleanup Temporary Table
    DROP TABLE #TempTable;
END;
GO