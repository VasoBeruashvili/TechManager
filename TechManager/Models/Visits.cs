using FinaPart.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TechManager.Utils;

namespace TechManager.Models
{
    [Table("Visits", Schema = "dbo")]
    public class Visits : IEntity
    {
        [Key]
        public int ID { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int StatusID { get; set; }
        public int CreatorUserID { get; set; }
        public int ContragentID { get; set; }
        public string CreatorUserSignature { get; set; }
        public string ContragentSignature { get; set; }
        public string Comment { get; set; }

        [Column("sub_contragent_id")]
        public int SubContragentId { get; set; }

        [Column("protocol_id")]
        [JsonProperty("protocolId")]
        public int? ProtocolId { get; set; }       


        [Column("warranty")]
        [JsonProperty("warranty")]
        public bool Warranty { get; set; }

        [Column("post_warranty")]
        [JsonProperty("postWarranty")]
        public bool PostWarranty { get; set; }

        [Column("in_office")]
        [JsonProperty("inOffice")]
        public bool InOffice { get; set; }

        [Column("on_site")]
        [JsonProperty("onSite")]
        public bool OnSite { get; set; }

        [Column("as_per_contract")]
        [JsonProperty("asPerContract")]
        public bool AsPerContract { get; set; }

        [Column("rent")]
        [JsonProperty("rent")]
        public bool Rent { get; set; }

        [Column("sales")]
        [JsonProperty("sales")]
        public bool Sales { get; set; }
        
        [Column("paid")]
        [JsonProperty("paid")]
        public bool Paid { get; set; }

        [Column("to_account")]
        [JsonProperty("toAccount")]
        public bool ToAccount { get; set; }

        [Column("payment_on_delivery")]
        [JsonProperty("paymentOnDelivery")]
        public bool PaymentOnDelivery { get; set; }

        [Column("other_1")]
        [JsonProperty("other1")]
        public bool Other1 { get; set; }

        [Column("other_2")]
        [JsonProperty("other2")]
        public bool Other2 { get; set; }

        [Column("warranty_pay")]
        [JsonProperty("warrantyPay")]
        public bool WarrantyPay { get; set; }

        [Column("rent_pay")]
        [JsonProperty("rentPay")]
        public bool RentPay { get; set; }

        [Column("visit_date")]
        [JsonProperty("visitDate")]
        public DateTime VisitDate { get; set; }

        [Column("visit_date2")]
        [JsonProperty("visitDate2")]
        public DateTime VisitDate2 { get; set; }

        [Column("start_time")]
        [JsonProperty("startTime")]
        public string StartTime { get; set; }

        [Column("end_time")]
        [JsonProperty("endTime")]
        public string EndTime { get; set; }

        [Column("client_full_name")]
        [JsonProperty("clientFullName")]
        public string ClientFullName { get; set; }     

        public virtual ICollection<VisitProcesses> VisitProcesses { get; set; }
        
        [NotMapped]
        public Contragents Contragent { get; set; }

        [NotMapped]
        public SubContragent SubContragent { get; set; }

        [ForeignKey("ProtocolId")]
        [JsonProperty("protocol")]
        public virtual Protocol Protocol { get; set; }

                
        [NotMapped]
        [JsonProperty("waybillFilter")]
        public WaybillFilter WaybillFilter { get; set; }


        [NotMapped]
        public bool Deleted { get; set; }
    }
}