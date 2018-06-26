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
    [Table("EquipmentTypes", Schema = "dbo")]
    public class EquipmentType : IEntity
    {
        [Key]
        [Column("id")]
        [JsonProperty("id")]
        public int ID { get; set; }

        [Column("name")]
        [JsonProperty("name")]
        public string Name { get; set; }

        [NotMapped]
        public bool Deleted { get; set; }
    }
}