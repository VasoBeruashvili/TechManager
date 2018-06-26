using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TechManager.Utils;

namespace TechManager.Models
{
    [Table("VisitProcessEquipments", Schema = "dbo")]
    public class VisitProcessEquipments : IEntity
    {
        [Key]
        public int ID { get; set; }
        public int VisitProcessID { get; set; }
        public int EquipmentID { get; set; }
        public string EquipmentSeries { get; set; }
        public DateTime? DoorOpenTime { get; set; }
        public DateTime? DoorOpenDate { get; set; }
        public int EquipmentGroupID { get; set; }

        [ForeignKey("VisitProcessID")]
        public virtual VisitProcesses VisitProcess { get; set; }

        [ForeignKey("EquipmentID")]
        public virtual Equipments Equipment { get; set; }


        [NotMapped]
        public bool Deleted { get; set; }
    }
}