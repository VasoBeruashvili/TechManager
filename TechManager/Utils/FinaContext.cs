using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TechManager.Models;

namespace TechManager.Utils
{
    public class FinaContext : DbContext
    {
        public FinaContext() : base("FinaDbContext")
        {
            this.Configuration.LazyLoadingEnabled = true;
            this.Configuration.ValidateOnSaveEnabled = false;
            this.Configuration.AutoDetectChangesEnabled = false;
        }

        public DbSet<EquipmentGroups> EquipmentGroups { get; set; }
        public DbSet<Equipments> Equipments { get; set; }
        public DbSet<Actions> Actions { get; set; }
        public DbSet<ActionItems> ActionItems { get; set; }
        public DbSet<Visits> Visits { get; set; }
        public DbSet<VisitProcessEquipments> VisitProcessEquipments { get; set; }
        public DbSet<VisitProcessEquipmentActionItems> VisitProcessEquipmentActionItems { get; set; }
        public DbSet<VisitProcesses> VisitProcesses { get; set; }
        public DbSet<VisitProcessProducts> VisitProcessProducts { get; set; }
        public DbSet<Protocol> Protocols { get; set; }
        public DbSet<SubProtocol> SubProtocols { get; set; }
        public DbSet<EquipmentType> EquipmentTypes { get; set; }
        public DbSet<ProgramVersion> ProgramVersions { get; set; }
        public DbSet<SubActionItem> SubActionItems { get; set; }
        public DbSet<CompanyInfos> CompanyInfos { get; set; }
    }
}