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
    [Table("Actions", Schema = "dbo")]
    public class Actions : IEntity
    {
        [Key]
        public int ID { get; set; }
        public string Name { get; set; }
        public int ActionTypeID { get; set; }

        [Column("is_hidden")]
        [JsonProperty("isHidden")]
        public bool IsHidden { get; set; }

        public virtual ICollection<ActionItems> ActionItems { get; set; }


        [NotMapped]
        public bool Deleted { get; set; }
    }
}