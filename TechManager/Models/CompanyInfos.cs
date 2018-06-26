using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TechManager.Models
{
    [Table("CompanyInfos", Schema = "dbo")]
    public class CompanyInfos
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("smtp")]
        public string Smtp { get; set; }

        [Column("port")]
        public string Port { get; set; }

        [Column("ssl")]
        public string Ssl { get; set; }

        [Column("sender")]
        public string Sender { get; set; }

        [Column("login")]
        public string Login { get; set; }

        [Column("pwd")]
        public string Pwd { get; set; }


        [Column("to_send_persons")]
        public string ToSendPersons { get; set; }
    }
}