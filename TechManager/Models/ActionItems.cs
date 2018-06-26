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
    [Table("ActionItems", Schema = "dbo")]
    public class ActionItems : IEntity
    {
        [Key]
        public int ID { get; set; }
        public string Name { get; set; }
        public int ActionID { get; set; }
        public int? ProductID { get; set; }

        [ForeignKey("ActionID")]
        public virtual Actions Action { get; set; }

        [Column("is_hidden")]
        [JsonProperty("isHidden")]
        public bool IsHidden { get; set; }

        [Column("has_serial")]
        [JsonProperty("hasSerial")]
        public bool HasSerial { get; set; }


        [JsonProperty("subActionItems")]
        public virtual ICollection<SubActionItem> SubActionItems { get; set; }


        [NotMapped]
        public bool Deleted { get; set; }
    }
}