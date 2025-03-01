CREATE OR ALTER  PROCEDURE Usp_GetLeadByCategory  
    @UserId VARCHAR(50)  
 , @StartDate DATETIME = '01 January 1900'  
 , @EndDate DATETIME = '01 January 1900'  
AS  
BEGIN  
    SET NOCOUNT ON;  
  
    ---- Declare variables to store dummy data  
    --DECLARE @UserType VARCHAR(20);  
  
    ---- Determine the user type based on UserId  
    --IF @UserId = 'cygnusteam'  
    --    SET @UserType = 'Admin';  
    --ELSE IF @UserId = 'manager'  
    --    SET @UserType = 'Manager';  
    --ELSE  
    --    SET @UserType = 'User';  
  
    -- Create a temporary table to store category-wise leads  
    CREATE TABLE #LeadCategories (  
        CategoryName VARCHAR(50),  
        LeadCount INT  
    );  
  
    ---- Insert dummy data based on user type  
    --IF @UserType = 'Admin'  
    --BEGIN  
    --    INSERT INTO #LeadCategories VALUES   
    --    ('Category A', 1000),  
    --    ('Category B', 560),  
    --    ('Category C', 432),  
    --    ('Category D', 750),  
    --    ('Category E', 890);  
    --END  
    --ELSE IF @UserType = 'Manager'  
    --BEGIN  
    --    INSERT INTO #LeadCategories VALUES   
    --    ('Category A', 800),  
    --    ('Category B', 420),  
    --    ('Category C', 300),  
    --    ('Category D', 600),  
    --    ('Category E', 700);  
    --END  
    --ELSE -- Regular User  
    --BEGIN  
    --    INSERT INTO #LeadCategories VALUES   
    --    ('Category A', 500),  
    --    ('Category B', 250),  
    --    ('Category C', 180),  
    --    ('Category D', 350),  
    --    ('Category E', 450);  
    --END  
  

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


	INSERT INTO #LeadCategories
	SELECT
	LeadCategory = UPPER(CodeDesc)
	, CountByCategory = Kount
	FROM
	(
	SELECT LeadCategoryId, Kount = COUNT(*) 
	FROM 
	Leads L
	WHERE
	L.IsActive = 1
	AND (@UseDateFilter = 0 OR L.LeadDate BETWEEN @StartDate AND @EndDate)
	GROUP BY LeadCategoryId
	)V
	INNER JOIN
	CYGNUS_Master_General GM
	ON V.LeadCategoryId = GM.CodeId AND GM.CodeType = 'IND'
	WHERE
	ISNUMERIC(GM.CodeId)=1


    -- Return the result set  
    SELECT   
        @UserId AS Id,  
        CategoryName,  
        LeadCount  
    FROM #LeadCategories;  
  
    -- Drop the temporary table  
    DROP TABLE #LeadCategories;  
END  
GO