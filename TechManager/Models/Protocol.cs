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
    [Table("Protocols", Schema = "dbo")]
    public class Protocol : IEntity
    {
        [Key]
        [Column("id")]
        [JsonProperty("id")]
        public int ID { get; set; }

        [Column("contragent_signature")]
        [JsonProperty("contragentSignature")]
        public string ContragentSignature { get; set; }

        [Column("technical_signature")]
        [JsonProperty("technicalSignature")]
        public string TechnicalSignature { get; set; }

        [Column("date")]
        [JsonProperty("date")]
        public DateTime? Date { get; set; }


        [JsonProperty("subProtocols")]
        //[JsonIgnore]
        public ICollection<SubProtocol> SubProtocols { get; set; }


        [Column("equipment_type_ids")]
        [JsonProperty("equipmentTypeIds")]
        public string EquipmentTypeIds { get; set; }

        [Column("program_version_ids")]
        [JsonProperty("programVersionIds")]
        public string ProgramVersionIds { get; set; }



        [NotMapped]
        public bool Deleted { get; set; }
    }
}