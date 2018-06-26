using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using TechManager.Utils;

namespace TechManager.Models
{
    public class WaybillFilter
    {        
        [JsonProperty("transType")]
        public string TransType { get; set; }
        
        [JsonProperty("transId")]
        public string TransId { get; set; }
        
        [JsonProperty("transTxt")]
        public string TransTxt { get; set; }
        
        [JsonProperty("endAddress")]
        public string EndAddress { get; set; }
        
        [JsonProperty("driverTin")]
        public string DriverTin { get; set; }
        
        [JsonProperty("driverFullName")]
        public string DriverFullName { get; set; }
        
        [JsonProperty("carNumber")]
        public string CarNumber { get; set; }
    }
}