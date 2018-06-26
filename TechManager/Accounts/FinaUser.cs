using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechManager.Accounts
{
    public class FinaUser
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public int? GroupID { get; set; }
    }
}