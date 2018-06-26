using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using TechManager.Utils;

namespace TechManager.Models
{
    [Table("VisitProcesses", Schema = "dbo")]
    public class VisitProcesses : IEntity
    {
        [Key]
        public int ID { get; set; }
        public int VisitID { get; set; }

        [ForeignKey("VisitID")]
        public virtual Visits Visit { get; set; }

        public virtual ICollection<VisitProcessEquipments> chosenEquipments { get; set; }
        public virtual ICollection<VisitProcessEquipmentActionItems> generatedResults { get; set; }
        public virtual ICollection<VisitProcessProducts> visitProcessProducts { get; set; }


        [NotMapped]
        public bool Deleted { get; set; }
    }
}