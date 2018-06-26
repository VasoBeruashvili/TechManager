using FinaPart.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using TechManager.Utils;

namespace TechManager.Models
{
    [Table("VisitProcessProducts", Schema = "dbo")]
    public class VisitProcessProducts : IEntity
    {
        [Key]
        public int ID { get; set; }
        public int VisitProcessID { get; set; }
        public int ProductID { get; set; }
        public int SaleTypeID { get; set; }
        public int? EquipmentID { get; set; }
        public int? ActionItemID { get; set; }
        public int Amount { get; set; }
        public double? PriceEUR { get; set; }
        public double PriceGEL { get; set; }
        public double? PriceUSD { get; set; }
        public double Price { get; set; }
        public double? Rate { get; set; }
        public double? RateUSD { get; set; }
        public string OldSeries { get; set; }
        public string NewSeries { get; set; }
        public string ProductName { get; set; }

        [Column("product_code")]
        [JsonProperty("productCode")]
        public string ProductCode { get; set; }

        [Column("store_id")]
        public int? StoreId { get; set; }

        [Column("sub_action_item_name")]
        [JsonProperty("subActionItemName")]
        public string SubActionItemName { get; set; }

        [Column("unit_name")]
        [JsonProperty("unitName")]
        public string UnitName { get; set; }

        [Column("general_id")]
        [JsonProperty("generalId")]
        public int GeneralId { get; set; }


        [ForeignKey("VisitProcessID")]
        public virtual VisitProcesses VisitProcess { get; set; }

        [ForeignKey("ProductID")]
        public virtual Products Product { get; set; }

        [ForeignKey("EquipmentID")]
        public virtual Equipments Equipment { get; set; }

        [ForeignKey("ActionItemID")]
        public virtual ActionItems ActionItem { get; set; }

        [Column("discount")]
        [JsonProperty("discount")]        
        public int Discount { get; set; }
        
        [JsonProperty("currencyType")]
        public int currencyType { get; set; }


        [Column("total")]
        [JsonProperty("total")]
        public double Total { get; set; }

        [Column("fake_id")]
        [JsonProperty("fakeId")]
        public int? FakeId { get; set; }


        [NotMapped]
        public bool Deleted { get; set; }
    }
}