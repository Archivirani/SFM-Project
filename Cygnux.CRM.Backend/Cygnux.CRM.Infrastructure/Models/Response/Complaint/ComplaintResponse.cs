using System;

namespace Cygnux.CRM.Infrastructure.Models.Response;

public class ComplaintResponse
{
    public Guid ComplaintId { get; set; }
    public string ComplaintCode { get; set; } = string.Empty;
    public string DocketNo { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string ComplaintDate { get; set; } = string.Empty;
    public string ComplaintStatus { get; set; } = string.Empty;
    public string? ResolutionDate { get; set; }
    public string SLAinHrs { get; set; } = string.Empty;
    public string RaisedBy { get; set; } = string.Empty;
    public string AssignedTo { get; set; } = string.Empty;
    public int? TotalCount { get; set; }
}
public class ComplaintResponseNew
{
        public Guid ComplaintID { get; set; }
        public string DocumentNo { get; set; } = string.Empty;
        public string Edd { get; set; } = string.Empty;
        public string DocumentDate { get; set; } = string.Empty;
        public string origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CompalaintDate { get; set; } = string.Empty;
        public string CompaintStatus { get; set; } = string.Empty;
        public string ResolutionDate { get; set; } = string.Empty;
        public string SLAInHr { get; set; } = string.Empty;
        public string RaisedBy { get; set; } = string.Empty;
        public string AssignedTo { get; set; } = string.Empty;
        public bool IsEscalated { get; set; } 
        public bool IsClosed { get; set; } 
        public string TicketAddressTo { get; set; } = string.Empty;
        public string TicketSource { get; set; } = string.Empty;
        public string TicketDate { get; set; } = string.Empty;
        public string TicketType { get; set; } = string.Empty;
        public string TicketSubType { get; set; } = string.Empty;
        public string TicketPriority { get; set; } = string.Empty;
        public int Source { get; set; } 
		public int Type { get; set; } 
		public int SubType { get; set; } 
		public int Priority { get; set; } 
        public string Description { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string Document { get; set; } = string.Empty;
        public string EscalationId { get; set; } = string.Empty;
        public string EscalationTo { get; set; } = string.Empty;
        public string EscalationDate { get; set; } = string.Empty;
        public string EscalationHistory { get; set; } = string.Empty;
        public string EscEmailId { get; set; } = string.Empty;
        public string UpdateDate { get; set; } = string.Empty;
        public string UpdateRemark { get; set; } = string.Empty;
        public string UpdateHistory { get; set; } = string.Empty;
        public Guid closeBy { get; set; } 
        public string CloseDate { get; set; } = string.Empty;
        public int? TotalCount { get; set; }


    //public Guid ComplaintID { get; set; }
    //public string ComplaintCode { get; set; } = string.Empty;
    //public string ComplaintDate { get; set; } = string.Empty;
    //public string Source { get; set; } = string.Empty;
    //public int Type { get; set; }
    //public int SubType { get; set; }
    //public int Priority { get; set; }
    //public string Description { get; set; } = string.Empty;
    //public Guid CustomerID { get; set; }
    //public string CustomerEmail { get; set; } = string.Empty;
    //public string UserID { get; set; } = string.Empty;
    //public string Document { get; set; } = string.Empty;
    //public string DocumentNo { get; set; } = string.Empty;
    //public string AssignedTo { get; set; } = string.Empty;
    //public string? CloseDate { get; set; }
    //public Guid CloseBy { get; set; } 
    //public string CloseRemark { get; set; } = string.Empty;
    //public Guid? SupportDocumentsId { get; set; }
    //public int? TotalCount { get; set; }
    //public string ComplaintStatus { get; set; } = string.Empty;
    //public string? ResolutionDate { get; set; }
    //public string SLAinHrs { get; set; } = string.Empty;
    //public string RaisedBy { get; set; } = string.Empty;
    //public bool IsActive { get; set; }


}

public class Response_List
{
    //public string ComStatus { get; set; } = string.Empty;
    //public string ComStatusCount { get; set; } = string.Empty;

    public int TotalComCount { get; set; }
    public int New { get; set; }
    public int Escalated { get; set; }
    public int Closed { get; set; }
    public int Deleted { get; set; }
    public int Updated { get; set; }
}

public class ComplaintDeatailCount
{
    public string UserID { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}