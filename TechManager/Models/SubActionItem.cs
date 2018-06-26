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
    [Table("SubActionItems", Schema = "dbo")]
    public class SubActionItem : IEntity
    {
        [Key]
        [Column("id")]
        [JsonProperty("id")]
        public int ID { get; set; }

        [Column("name")]
        [JsonProperty("name")]
        public string Name { get; set; }

        [NotMapped]
        [JsonProperty("code")]
        public string Code { get; set; }

        [Column("action_item_id")]
        [JsonProperty("actionItemId")]
        public int ActionItemId { get; set; }

        [Column("product_id")]
        [JsonProperty("productId")]
        public int? ProductId { get; set; }


        [ForeignKey("ActionItemId")]
        [JsonProperty("actionItem")]
        public virtual ActionItems ActionItem { get; set; }

        [Column("is_hidden")]
        [JsonProperty("isHidden")]
        public bool IsHidden { get; set; }



        [NotMapped]
        public bool Deleted { get; set; }
    }
}