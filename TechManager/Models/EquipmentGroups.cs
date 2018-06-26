using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TechManager.Utils;

namespace TechManager.Models
{
    [Table("EquipmentGroups", Schema = "dbo")]
    public class EquipmentGroups : IEntity
    {
        [Key]
        public int ID { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Equipments> Equipments { get; set; }

        [NotMapped]
        public bool Deleted { get; set; }
    }
}