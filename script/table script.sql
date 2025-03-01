USE [CRMConnect]
GO
/****** Object:  Table [dbo].[Assignments]    Script Date: 10/18/2024 10:43:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Assignments](
	[AssignmentId] [int] IDENTITY(1,1) NOT NULL,
	[LeadCategoryId] [int] NOT NULL,
	[CustomerId] [int] NOT NULL,
	[RegionId] [int] NOT NULL,
	[BranchId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[AssignToId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[AssignmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CallAttendees]    Script Date: 10/18/2024 10:43:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CallAttendees](
	[CallAttendeesId] [int] IDENTITY(1,1) NOT NULL,
	[CallId] [int] NOT NULL,
	[AttendeeID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[CallAttendeesId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ExpensesDocument]    Script Date: 10/18/2024 10:43:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ExpensesDocument](
	[ExpensesDocumentId] [int] IDENTITY(1,1) NOT NULL,
	[ExpenseId] [int] NOT NULL,
	[FileName] [varchar](255) NOT NULL,
	[FileExtension] [varchar](10) NULL,
	[FileType] [varchar](250) NOT NULL,
	[FileContent] [varbinary](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[ExpensesDocumentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LeadCall]    Script Date: 10/18/2024 10:43:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LeadCall](
	[CallId] [int] IDENTITY(1,1) NOT NULL,
	[LeadId] [int] NOT NULL,
	[CallPurpose] [nvarchar](255) NOT NULL,
	[CallDateTime] [datetime] NULL,
	[CallCategoryId] [int] NULL,
	[CustomerId] [int] NULL,
	[Remarks] [nvarchar](500) NULL,
	[CallMoM] [nvarchar](max) NULL,
	[CreatedBy] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[CallId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Leads]    Script Date: 10/18/2024 10:43:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Leads](
	[LeadId] [uniqueidentifier] NOT NULL,
	[LeadCategoryId] [int] NOT NULL,
	[LeadDate] [datetime] NOT NULL,
	[CompanyName] [nvarchar](255) NOT NULL,
	[ContactName] [nvarchar](255) NULL,
	[ContactNo] [char](10) NULL,
	[Address] [nvarchar](500) NULL,
	[Email] [nvarchar](255) NULL,
	[CityId] [varchar](10) NULL,
	[BranchId] [varchar](10) NULL,
	[RegionId] [varchar](10) NULL,
	[DesignationId] [int] NULL,
	[LeadSourceId] [int] NULL,
	[AssignedToId] [varchar](10) NULL,
	[IndustryTypeId] [int] NULL,
	[ServiceInterestedIDs] [varchar](1000) NULL,
	[SalesPerson] [int] NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK__LeadMast__7C7FD6A941F9AA74] PRIMARY KEY CLUSTERED 
(
	[LeadId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LeadServiceInterest]    Script Date: 10/18/2024 10:43:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LeadServiceInterest](
	[LeadServiceInterest] [int] IDENTITY(1,1) NOT NULL,
	[LeadId] [int] NOT NULL,
	[ServiceInterestedID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[LeadServiceInterest] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MeetingAttendees]    Script Date: 10/18/2024 10:43:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MeetingAttendees](
	[MeetingAttendeesId] [int] IDENTITY(1,1) NOT NULL,
	[MeetingId] [uniqueidentifier] NOT NULL,
	[AttendeeID] [int] NOT NULL,
 CONSTRAINT [PK__MeetingA__75EEB5C12D370795] PRIMARY KEY CLUSTERED 
(
	[MeetingAttendeesId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MeetingExpenses]    Script Date: 10/18/2024 10:43:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MeetingExpenses](
	[ExpenseId] [int] IDENTITY(1,1) NOT NULL,
	[MeetingId] [uniqueidentifier] NOT NULL,
	[ExpenseCode] [nvarchar](50) NOT NULL,
	[CustomerName] [nvarchar](255) NOT NULL,
	[TransportMode] [nvarchar](100) NOT NULL,
	[ExpenseDate] [datetime] NOT NULL,
	[PunchedInLocation] [nvarchar](255) NULL,
	[CheckedInLocation] [nvarchar](255) NULL,
	[DistanceInKm] [float] NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[SupportingDocument] [nvarchar](max) NULL,
	[Remarks] [nvarchar](500) NULL,
	[CreatedBy] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK__MeetingE__1445CFD342922B96] PRIMARY KEY CLUSTERED 
(
	[ExpenseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Meetings]    Script Date: 10/18/2024 10:43:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Meetings](
	[MeetingId] [uniqueidentifier] NOT NULL,
	[LeadId] [uniqueidentifier] NULL,
	[CustomerName] [nvarchar](255) NOT NULL,
	[ContactName] [nvarchar](255) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[Address] [nvarchar](max) NULL,
	[ContactNo] [char](10) NULL,
	[MeetingPurpose] [varchar](250) NOT NULL,
	[StartTime] [char](5) NOT NULL,
	[EndTime] [char](5) NOT NULL,
	[AttendeeIDs] [varchar](1000) NOT NULL,
	[MeetingDate] [datetime] NOT NULL,
	[MeetingTypeId] [int] NOT NULL,
	[MeetingLocation] [nvarchar](255) NOT NULL,
	[IsAllDayEvent] [bit] NOT NULL,
	[MeetingMOM] [nvarchar](500) NULL,
	[CreatedBy] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK__MeetingR__E9F9E94C4E582E14] PRIMARY KEY CLUSTERED 
(
	[MeetingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TaskAssignments]    Script Date: 10/18/2024 10:43:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TaskAssignments](
	[TaskAssignmentsId] [int] IDENTITY(1,1) NOT NULL,
	[TaskId] [int] NOT NULL,
	[AssignedToId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[TaskAssignmentsId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tasks]    Script Date: 10/18/2024 10:43:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tasks](
	[TaskId] [int] IDENTITY(1,1) NOT NULL,
	[TaskName] [nvarchar](255) NOT NULL,
	[TaskDate] [datetime] NULL,
	[LeadCategoryId] [int] NULL,
	[CustomerId] [int] NULL,
	[PriorityId] [int] NULL,
	[TaskDescription] [nvarchar](max) NULL,
	[CreatedBy] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[TaskId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Leads] ADD  CONSTRAINT [DF_Leads_LeadId]  DEFAULT (newid()) FOR [LeadId]
GO
ALTER TABLE [dbo].[Meetings] ADD  CONSTRAINT [DF_Meetings_MeetingId]  DEFAULT (newid()) FOR [MeetingId]
GO
ALTER TABLE [dbo].[CallAttendees]  WITH CHECK ADD  CONSTRAINT [FK_CallAttendees_LeadCall] FOREIGN KEY([CallId])
REFERENCES [dbo].[LeadCall] ([CallId])
GO
ALTER TABLE [dbo].[CallAttendees] CHECK CONSTRAINT [FK_CallAttendees_LeadCall]
GO
ALTER TABLE [dbo].[MeetingAttendees]  WITH CHECK ADD  CONSTRAINT [FK_MeetingAttendees_Meeting] FOREIGN KEY([MeetingId])
REFERENCES [dbo].[Meetings] ([MeetingId])
GO
ALTER TABLE [dbo].[MeetingAttendees] CHECK CONSTRAINT [FK_MeetingAttendees_Meeting]
GO
ALTER TABLE [dbo].[MeetingExpenses]  WITH CHECK ADD  CONSTRAINT [FK_MeetingExpenses_Meeting] FOREIGN KEY([MeetingId])
REFERENCES [dbo].[Meetings] ([MeetingId])
GO
ALTER TABLE [dbo].[MeetingExpenses] CHECK CONSTRAINT [FK_MeetingExpenses_Meeting]
GO
ALTER TABLE [dbo].[TaskAssignments]  WITH CHECK ADD  CONSTRAINT [FK_TaskAssignments_Tasks] FOREIGN KEY([TaskId])
REFERENCES [dbo].[Tasks] ([TaskId])
GO
ALTER TABLE [dbo].[TaskAssignments] CHECK CONSTRAINT [FK_TaskAssignments_Tasks]
GO
