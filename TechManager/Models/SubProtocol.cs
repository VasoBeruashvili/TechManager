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
    [Table("SubProtocols", Schema = "dbo")]
    public class SubProtocol : IEntity
    {
        [Key]
        [Column("id")]
        [JsonProperty("id")]
        public int ID { get; set; }

        [Column("protocol_id")]
        [JsonProperty("protocolId")]
        public int ProtocolId { get; set; }

        [Column("casino_number")]
        [JsonProperty("casinoNumber")]
        public string CasinoNumber { get; set; }

        [Column("serial_number")]
        [JsonProperty("serialNumber")]
        public string SerialNumber { get; set; }

        [Column("platform_number")]
        [JsonProperty("platformNumber")]
        public string PlatformNumber { get; set; }

        [Column("bet")]
        [JsonProperty("bet")]
        public string Bet { get; set; }

        [Column("win")]
        [JsonProperty("win")]
        public string Win { get; set; }

        [Column("electric_in")]
        [JsonProperty("electricIn")]
        public string ElectricIn { get; set; }

        [Column("electric_out")]
        [JsonProperty("electricOut")]
        public string ElectricOut { get; set; }

        [Column("games")]
        [JsonProperty("games")]
        public string Games { get; set; }

        [Column("mechanic_in")]
        [JsonProperty("mechanicIn")]
        public string MechanicIn { get; set; }

        [Column("mechanic_out")]
        [JsonProperty("mechanicOut")]
        public string MechanicOut { get; set; }

        [Column("status")]
        [JsonProperty("status")]
        public int Status { get; set; }

        [Column("plomb_number")]
        [JsonProperty("plombNumber")]
        public string PlombNumber { get; set; }


        [ForeignKey("ProtocolId")]
        [JsonProperty("protocol")]
        public virtual Protocol Protocol { get; set; }


        [NotMapped]
        public bool Deleted { get; set; }
    }
}