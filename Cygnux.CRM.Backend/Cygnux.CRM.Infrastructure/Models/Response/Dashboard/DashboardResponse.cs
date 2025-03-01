using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cygnux.CRM.Infrastructure.Models.Response.Dashboard
{
    public class DashboardResponse
    {
        public string? Id { get; set; }
        public int CustomerCount { get; set; }
        public int TotalSales { get; set; }
        public int OverdueOS { get; set; }
        public int TotalOS { get; set; }
        public int NBD { get; set; }
        public int LostCustomerCount { get; set; }
        public double AvgGP { get; set; }
    }

    public class LeadByStatusResponse
    {
        public string? Id { get; set; } // User ID
        public int TotalLeadCount { get; set; } // Sum of Leads, Prospects, etc.
        public int Leads { get; set; } // Number of leads
        public int Prospects { get; set; } // Number of prospects
        public int Suspects { get; set; } // Number of suspects
        public int Negotiation { get; set; } // Leads in negotiation phase
        public int FinalState { get; set; } // Leads in final stage
        public int Closed { get; set; } // Closed deals
    }

    public class LeadByCategoryResponse
    {
        public string? Id { get; set; } // User ID
        public string CategoryName { get; set; } = string.Empty; // Lead Category Name
        public int LeadCount { get; set; } // Number of leads in this category
    }

    public class LeadBySourceResponse
    {
        public string? Id { get; set; }  // User ID
        public int TotalLeads { get; set; }  // Sum of all lead sources
        public int PhoneLeads { get; set; }  // Leads from Phone
        public int EmailLeads { get; set; }  // Leads from Email
        public int WhatsappLeads { get; set; }  // Leads from Whatsapp
        public int WebBotLeads { get; set; }  // Leads from Web/Bot
    }


    public class MeetingByStatusResponse
    {
        public string? Id { get; set; } // User ID
        public int TotalMeetingCount { get; set; } // Pending + Completed
        public int Pending { get; set; } // Number of Pending
        public int Completed { get; set; } // Number of Completed
    }


    public class MeetingCountDayWiseResponse
    {
        public string? Id { get; set; } // User ID
        public string? MeetingDay { get; set; } // Meeting Day dd MMM
        public int PendingCount { get; set; } // Number of Pending Count
        public int CompletedCount { get; set; } // Number of Completed Count
        public int Seq { get; set; } //Sequence
    }

}
