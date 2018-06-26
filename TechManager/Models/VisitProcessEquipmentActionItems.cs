using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TechManager.Utils;

namespace TechManager.Models
{
    [Table("VisitProcessEquipmentActionItems", Schema = "dbo")]
    public class VisitProcessEquipmentActionItems : IEntity
    {
        [Key]
        public int ID { get; set; }
        public int VisitProcessEquipmentID { get; set; }
        public int VisitProcessID { get; set; }
        public int ActionItemID { get; set; }
        public string Text { get; set; }
        public string Comment { get; set; }

        [Column("fake_id")]
        [JsonProperty("fakeId")]
        public int? FakeId { get; set; }

        [ForeignKey("VisitProcessID")]
        public virtual VisitProcesses VisitProcess { get; set; }

        //[ForeignKey("VisitProcessEquipmentID")]
        //public VisitProcessEquipments VisitProcessEquipment { get; set; }


        [NotMapped]
        public bool Deleted { get; set; }
    }
}