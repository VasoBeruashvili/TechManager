using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using TechManager.Utils;

namespace TechManager.Models
{
    [Table("Equipments", Schema = "dbo")]
    public class Equipments : IEntity
    {
        [Key]
        public int ID { get; set; }
        public string Name { get; set; }
        public int EquipmentGroupID { get; set; }

        [ForeignKey("EquipmentGroupID")]
        public virtual EquipmentGroups EquipmentGroup { get; set; }

        [NotMapped]
        public bool Deleted { get; set; }
    }
}