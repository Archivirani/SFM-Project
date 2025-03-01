CREATE TABLE LeadMaster
(
    LeadMasterId INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    LeadCategoryId INT NOT NULL,
    LeadDate DateTime NULL,  
    CompanyName NVARCHAR(255) NULL,
    ContactName NVARCHAR(255) NULL,
    ContactNo NVARCHAR(50) NULL,
    Address NVARCHAR(MAX) NULL, 
    Email NVARCHAR(255) NULL,
    CityId INT NULL,
    BranchId INT NULL,
    RegionId INT NULL,
    DesignationId INT NULL,
    LeadSourceId INT NULL,
    AssignedToId INT NULL,
    IndustryTypeId INT NULL,
    SalesPerson INT NULL,
    IsActive BIT NULL,
    CreatedBy INT NOT NULL,
    CreatedDate DateTime NOT NULL,
    ModifiedBy INT NULL,
    ModifiedDate DATETIME NULL
);

-- If you want to store ServiceInterestedIDs in a separate table (for normalization):
CREATE TABLE LeadServiceInterest
(
    LeadServiceInterest INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    LeadId INT NOT NULL,
    ServiceInterestedID INT NOT NULL
);

-- Main table for MeetingRequest
CREATE TABLE MeetingRequest
(
    MeetingId INT IDENTITY(1,1) PRIMARY KEY NOT NULL,  -- Auto-incrementing primary key
    LeadId INT NOT NULL,
    CustomerId INT NULL,
    ContactId INT NULL,
    Email NVARCHAR(255) NULL,
    Address NVARCHAR(MAX) NULL,
    ContactNo NVARCHAR(50) NULL,
    MeetingPurpose NVARCHAR(MAX) NULL,    
    MeetingDateTime DATETIME NULL,
    MeetingTypeId INT NULL,
    MeetingLocation NVARCHAR(255) NOT NULL,
    IsAllDayEvent BIT NOT NULL,
    MeetingMOM NVARCHAR(MAX) NULL,
    CreatedBy INT NOT NULL,
    CreatedDate DateTime NOT NULL,
    ModifiedBy INT NULL,
    ModifiedDate DATETIME NULL
);

-- Separate table to store attendees for each meeting
CREATE TABLE MeetingAttendees
(
MeetingAttendeesId INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    MeetingId INT NOT NULL,
    AttendeeID INT NOT NULL,
    CONSTRAINT FK_MeetingAttendees_Meeting FOREIGN KEY (MeetingId) REFERENCES MeetingRequest(MeetingId)
);

CREATE TABLE MeetingExpenses
(
    ExpenseId INT IDENTITY(1,1) PRIMARY KEY,
    MeetingId INT NOT NULL,
    ExpenseCode NVARCHAR(50) NOT NULL,        
    CustomerName NVARCHAR(255) NOT NULL,      
    TransportMode NVARCHAR(100) NOT NULL,     
    ExpenseDate DATETIME NOT NULL,            
    PunchedInLocation NVARCHAR(255) NULL,    
    CheckedInLocation NVARCHAR(255) NULL,     
    DistanceInKm FLOAT NOT NULL,              
    Amount DECIMAL(18, 2) NOT NULL,           
    SupportingDocument NVARCHAR(MAX) NULL,    
    Remarks NVARCHAR(500) NULL,               
    CreatedBy INT NOT NULL,
    CreatedDate DateTime NOT NULL,
    ModifiedBy INT NULL,
    ModifiedDate DATETIME NULL,
    CONSTRAINT FK_MeetingExpenses_Meeting FOREIGN KEY (MeetingId) REFERENCES MeetingRequest(MeetingId)
);

CREATE TABLE ExpensesDocument
(
    ExpensesDocumentId INT IDENTITY(1,1) PRIMARY KEY,  
    ExpenseId INT NOT NULL,
    FileName VARCHAR(255) NOT NULL,      
    FileExtension varchar(10) NULL,
    FileType varchar(250) NOT NULL,         
    FileContent VARBINARY(MAX) NULL      
);

CREATE TABLE LeadCall
(
    CallId INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    LeadId INT NOT NULL,
    CallPurpose NVARCHAR(255) NOT NULL,
    CallDateTime DATETIME NULL,
    CallCategoryId INT NULL,
    CustomerId INT NULL,
    Remarks NVARCHAR(500) NULL,
    CallMoM NVARCHAR(MAX) NULL,
    CreatedBy INT NOT NULL,
    CreatedDate DateTime NOT NULL,
    ModifiedBy INT NULL,
    ModifiedDate DATETIME NULL
);

CREATE TABLE CallAttendees
(
    CallAttendeesId INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    CallId INT NOT NULL,
    AttendeeID INT NOT NULL,
    CONSTRAINT FK_CallAttendees_LeadCall FOREIGN KEY (CallId) REFERENCES LeadCall(CallId)
);


CREATE TABLE Tasks
(
    TaskId INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    TaskName NVARCHAR(255) NOT NULL,
    TaskDate DATETIME NULL,
    LeadCategoryId INT NULL,
    CustomerId INT NULL,
    PriorityId INT NULL,
    TaskDescription NVARCHAR(MAX) NULL,
    CreatedBy INT NOT NULL,
    CreatedDate DateTime NOT NULL,
    ModifiedBy INT NULL,
    ModifiedDate DATETIME NULL
);

CREATE TABLE TaskAssignments
(
    TaskAssignmentsId INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    TaskId INT NOT NULL,
    AssignedToId INT NOT NULL,
    CONSTRAINT FK_TaskAssignments_Tasks FOREIGN KEY (TaskId) REFERENCES Tasks(TaskId)
);

CREATE TABLE Assignments
(
    AssignmentId INT IDENTITY(1,1) PRIMARY KEY,
    LeadCategoryId INT NOT NULL,
    CustomerId INT NOT NULL,    
    RegionId INT NOT NULL,
    BranchId INT NOT NULL,
    UserId INT NOT NULL,
    AssignToId INT NOT NULL
);







