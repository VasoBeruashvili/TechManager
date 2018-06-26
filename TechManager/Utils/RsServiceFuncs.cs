using FinaPart;
using FinaPart.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
using TechManager.Enums;
using TechManager.Models;

namespace TechManager.Utils
{
    public class RsServiceFuncs
    {
        FinaContext context = new FinaContext();

        // Waybill CORE
        string _path = HttpContext.Current.Server.MapPath("~/App_Data");
        private string _rs_url = "http://services.rs.ge/WayBillService/WayBillService.asmx";
        private string _rs_user = string.Empty;
        private string _rs_password = string.Empty;

        public RsServiceFuncs(bool b)
        {
            if (b)
            {
                XDocument doc = XDocument.Load(Path.Combine(_path, "rs_data.xml"));
                this._rs_user = doc.Root.Element("user").Value;
                this._rs_password = doc.Root.Element("pass").Value;
            }
        }

        public bool UpdateRsUser()
        {
            XDocument res = this.CallRsService("get_service_users", "<user_name>tbilisi</user_name><user_password>123456</user_password>");
            if (res != null)
            {
                XElement el = res.Descendants("ServiceUser").FirstOrDefault();
                if (el != null)
                {
                    string user = el.Element("USER_NAME").Value;
                    string name = el.Element("NAME").Value;
                    string ip = this.CallRsService("what_is_my_ip", "").Root.Value;
                    string is_update = this.CallRsService("update_service_user", "<user_name>tbilisi</user_name><user_password>123456</user_password><ip>" + ip + "</ip><name>" + name + "</name><su>" + user + "</su><sp>pass123</sp>").Root.Value;
                    if (is_update == "true")
                    {
                        string file_path = Path.Combine(_path, "rs_data.xml");
                        XDocument doc = XDocument.Load(file_path);
                        doc.Root.Element("user").SetValue(user);
                        doc.Root.Element("pass").SetValue("pass123");
                        doc.Save(file_path);

                        return true;
                    }
                }
            }

            return false;
        }

        public string GetAbonentName(string code)
        {
            XDocument doc = XDocument.Load(Path.Combine(_path, "rs_data.xml"));
            this._rs_user = doc.Root.Element("user").Value;
            this._rs_password = doc.Root.Element("pass").Value;

            XDocument res = new RsServiceFuncs(true).CallRsService("get_name_from_tin", "<su>" + this._rs_user + "</su><sp>" + this._rs_password + "</sp><tin>" + code + "</tin>");
            return res.Root.Value;
        }

        private XDocument CreateSoapEnvelope(string action, string data)
        {
            string str = "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
                   "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
                   "<soap:Body><" + action + " xmlns=\"http://tempuri.org/\">" + data + "</" + action + "></soap:Body></soap:Envelope>";

            return XDocument.Parse(str);
        }

        public XDocument CallRsService(string soap_action, string soap_data)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(_rs_url);
            request.Method = "POST";
            request.ContentType = "text/xml; charset=utf-8";
            request.Accept = "text/xml";
            request.Headers.Add("SOAPAction", "http://tempuri.org/" + soap_action);
            using (Stream stream = request.GetRequestStream())
            {
                CreateSoapEnvelope(soap_action, soap_data).Save(stream);
            }

            IAsyncResult asyncResult = request.BeginGetResponse(null, null);
            asyncResult.AsyncWaitHandle.WaitOne();
            string soapResult;
            using (WebResponse webResponse = request.EndGetResponse(asyncResult))
            {
                using (StreamReader rd = new StreamReader(webResponse.GetResponseStream()))
                {
                    soapResult = rd.ReadToEnd();
                }
            }

            return XDocument.Parse(soapResult);
        }
        // ---



        // Waybill logic
        private List<XElement> GenerateWaybillGoods(List<dynamic> products, int? rsSaleType)
        {
            List<XElement> goodsList = new List<XElement>();

            products.ForEach(p =>
            {
                goodsList.Add(
                            new XElement("GOODS", // საქონელი
                                new XElement("ID", "0" /* p.ProductId */), // 0 (ახალი საქონელი), ან სხვა რაიმე ID (შესაბამისი, არსებული საქონლის ID).
                                new XElement("W_NAME", p.Name), // სქონლის დასახელება.
                                new XElement("UNIT_ID", p.UnitId), // ერთეულის ID (1 - ცალი, 3 - გრამი, 4 - ლიტრი, 5 - ტონა, 7 - სანტიმეტრი, 8 - მეტრი, 9 - კილომეტრი, 10 - კვ.სმ, 11 - კვ.მ, 12 - მეტრ კუბი, 13 - მილილიტრი, 2 - კგ, 99 - სხვა, 14 - შეკვრა).
                                new XElement("UNIT_TXT", ""), // ერთეულის დასახელება, აუცილებელია როცა მითითებულია "სხვა" ანუ 99.
                                new XElement("QUANTITY", p.Quantity), // რაოდენობა.
                                new XElement("PRICE", rsSaleType.HasValue && rsSaleType.Value == (int)EnumSaleTypes.Spend ? 0.01 : p.Price), // ფასი.
                                new XElement("STATUS", "1"), // 1 ჩვეულებრივ, თუ მიუთითე -1 მაშინ შესაბამისი საქონელი წაიშლება.
                                new XElement("AMOUNT", rsSaleType.HasValue && rsSaleType.Value == (int)EnumSaleTypes.Spend ? p.Quantity * 0.01 : p.TotalAmount), // მთლიანი თანხა (რაოდენობა * საცალო ფასზე).
                                new XElement("BAR_CODE", p.Code), // შტრიხკოდი.
                                new XElement("A_ID", "0"), // აქციზის ID, თუ აქციზური არაა გადაეცით 0.
                                new XElement("VAT_TYPE", "0") // დაბეგვრის ტიპი (0 - ჩვეულებრივი, 1 - ნულოვანი, 2 - დაუბეგრავი).
                            )
                        );
            });

            return goodsList;
        }

        public int SaveSubWaybill(List<dynamic> products, Contragents contragent, string parentId, int visitId, string receptionFullName, string receiverFullName, string subContragentAddress, int? rsSaleType, int userId)
        {
            FinaLogic finaLogic = new FinaLogic();

            Users us = finaLogic.GetUserById(userId);

            XDocument doc = XDocument.Load(Path.Combine(_path, "rs_data.xml"));
            this._rs_user = doc.Root.Element("user").Value;
            this._rs_password = doc.Root.Element("pass").Value;

            var element = new XElement("WAYBILL", // ზედნადები.
                            new XElement("SUB_WAYBILLS", ""), // ქვე ზედნადები (თუ ასეთი არსებობს).
                            new XElement("GOODS_LIST", GenerateWaybillGoods(products, rsSaleType)), // საქონლის ჩამონათვალი.
                            new XElement("ID", "0"), // 0 (ახალის შექმნა), ან რაიმე ID (ძველი არსებული ზედნადების დროს).
                            new XElement("TYPE", "6"), // 1 (შიდა გადაზიდვა), 2 (ტრანსპორტირებით), 3 (ტრანსპორტირების გარეშე), 4 (დისტრიბუცია), 5 (უკან დაბრუნება), 6 (ქვე ზედნადები).
                            new XElement("BUYER_TIN", rsSaleType.HasValue && rsSaleType.Value == (int)EnumSaleTypes.Spend ? us.staff.code : contragent.code), // მყიდველის პირადი ან საიდენტიფიკაციო ნომერი.
                            new XElement("CHEK_BUYER_TIN", "1"), // 0 (უცხოელი), 1 (საქართველოს მოქალაქე).
                            new XElement("BUYER_NAME", rsSaleType.HasValue && rsSaleType.Value == (int)EnumSaleTypes.Spend ? us.staff.name : contragent.name), // მყიდველის სახელი.
                            new XElement("START_ADDRESS", ""), // ტრანსპორტირების დაწყების ადგილი.
                            new XElement("END_ADDRESS", subContragentAddress), // ტრანსპორტირების დასრულების ადგილი.
                            new XElement("DRIVER_TIN", ""), // მძღოლის პირადი ნომერი.
                            new XElement("CHEK_DRIVER_TIN", "1"), // 0 (უცხოელი), 1 (საქართველოს მოქალაქე).
                            new XElement("DRIVER_NAME", ""), // მძღოლის სახელი.
                            new XElement("TRANSPORT_COAST", "0"), // ტრანსპორტირების ღირებულება.
                            new XElement("RECEPTION_INFO", receptionFullName), // მომწოდებლის ინფორმაცია.
                            new XElement("RECEIVER_INFO", rsSaleType.HasValue && rsSaleType.Value == (int)EnumSaleTypes.Spend ? receptionFullName : receiverFullName), // მიმღების ინფორმაცია.
                            new XElement("DELIVERY_DATE", ""), // მიწოდების თარიღი, გადასცემთ უკვე აქტიურს დახურვის წინ.
                            new XElement("STATUS", "1"), // 0 (შენახული), 1 (აქტივირებული), 2 (დახურული).
                            new XElement("SELER_UN_ID", GetSellerUnId()), // მყიდველის უნიკალური ნომერი (აბრუნებს "chek_service_user").
                            new XElement("PAR_ID", parentId), // მშობელი ზედნადების ID თუ ტიპი არის 6.
                            new XElement("FULL_AMOUNT", ""), // ზედნადების სრული თანხა.
                            new XElement("CAR_NUMBER", ""), // მანქანის ნომერი.
                            new XElement("WAYBILL_NUMBER", ""), // --- სავარაუდოდ ზედნადების ნომერი ---.
                            //new XElement("S_USER_ID", "783"), // --- არვიცი (აბრუნებს "chek_service_user") ---.
                            new XElement("BEGIN_DATE", DateTime.Now.ToString("yyyy-M-dTHH:mm:ss")), // ტრანსპორტირების დაწყების თარიღი (აუცილებლად თარიღი და დრო უნდა იყოს გამოყოფილი T სიმბოლით).
                            new XElement("TRAN_COST_PAYER", "1"), // ტრანსპორტირების ღირებულებას იხდის (1 - მყიდველი, 2 - გამყიდველი).
                            new XElement("TRANS_ID", "1"), // ტრანსპორტის ტიპის ID (1 - საავტომობილო, 2 - სარკინიგზო, 3 - საავიაციო, 4 - სხვა).
                            new XElement("TRANS_TXT", ""), // ეთითება მაშინ როცა ტრანსპორტირების ტიპი არის "სხვა" ანუ არჩეულია 4.
                            new XElement("COMMENT", "ვიზიტის ID " + visitId.ToString()), // კომენტარი, შენიშვნა.
                            new XElement("TRANSPORTER_TIN", ""),
                            new XElement("CATEGORY", "0") // ცარიელია ან 0 (ჩვეულებრივი), 1 (ხე).
                        );

            var xmlData = new XDocument(element).Root;

            XDocument res = new RsServiceFuncs(true).CallRsService("save_waybill", "<su>" + this._rs_user + "</su><sp>" + this._rs_password + "</sp><waybill>" + xmlData + "</waybill>");

            return Convert.ToInt32(res.Descendants().ElementAt(5).Value);
        }

        public int SaveTransportWaybill(List<dynamic> products, Contragents contragent, int visitId, string receptionFullName, string receiverFullName, string subContragentAddress, WaybillFilter filter, string companyAddress, int? rsSaleType, int userId)
        {
            FinaLogic finaLogic = new FinaLogic();

            Users us = finaLogic.GetUserById(userId);

            XDocument doc = XDocument.Load(Path.Combine(_path, "rs_data.xml"));
            this._rs_user = doc.Root.Element("user").Value;
            this._rs_password = doc.Root.Element("pass").Value;

            var element = new XElement("WAYBILL", // ზედნადები.
                            new XElement("SUB_WAYBILLS", ""), // ქვე ზედნადები (თუ ასეთი არსებობს).
                            new XElement("GOODS_LIST", GenerateWaybillGoods(products, rsSaleType)), // საქონლის ჩამონათვალი.
                            new XElement("ID", "0"), // 0 (ახალის შექმნა), ან რაიმე ID (ძველი არსებული ზედნადების დროს).
                            new XElement("TYPE", filter.TransType), // 1 (შიდა გადაზიდვა), 2 (ტრანსპორტირებით), 3 (ტრანსპორტირების გარეშე), 4 (დისტრიბუცია), 5 (უკან დაბრუნება), 6 (ქვე ზედნადები).
                            new XElement("BUYER_TIN", rsSaleType.HasValue && rsSaleType.Value == (int)EnumSaleTypes.Spend ? us.staff.code : contragent.code), // მყიდველის პირადი ან საიდენტიფიკაციო ნომერი.
                            new XElement("CHEK_BUYER_TIN", "1"), // 0 (უცხოელი), 1 (საქართველოს მოქალაქე).
                            new XElement("BUYER_NAME", rsSaleType.HasValue && rsSaleType.Value == (int)EnumSaleTypes.Spend ? us.staff.name : contragent.name), // მყიდველის სახელი.
                            new XElement("START_ADDRESS", companyAddress), // ტრანსპორტირების დაწყების ადგილი.
                            new XElement("END_ADDRESS", string.IsNullOrEmpty(filter.EndAddress) ? (filter.TransType == "3" ? companyAddress : subContragentAddress) : filter.EndAddress), // ტრანსპორტირების დასრულების ადგილი.
                            new XElement("DRIVER_TIN", filter.DriverTin), // მძღოლის პირადი ნომერი.
                            new XElement("CHEK_DRIVER_TIN", "1"), // 0 (უცხოელი), 1 (საქართველოს მოქალაქე).
                            new XElement("DRIVER_NAME", filter.DriverFullName), // მძღოლის სახელი.
                            new XElement("TRANSPORT_COAST", "0"), // ტრანსპორტირების ღირებულება.
                            new XElement("RECEPTION_INFO", receptionFullName), // მომწოდებლის ინფორმაცია.
                            new XElement("RECEIVER_INFO", rsSaleType.HasValue && rsSaleType.Value == (int)EnumSaleTypes.Spend ? receptionFullName : receiverFullName), // მიმღების ინფორმაცია.
                            new XElement("DELIVERY_DATE", ""), // მიწოდების თარიღი, გადასცემთ უკვე აქტიურს დახურვის წინ.
                            new XElement("STATUS", "1"), // 0 (შენახული), 1 (აქტივირებული), 2 (დახურული).
                            new XElement("SELER_UN_ID", GetSellerUnId()), // მყიდველის უნიკალური ნომერი (აბრუნებს "chek_service_user").
                            new XElement("PAR_ID", ""), // მშობელი ზედნადების ID თუ ტიპი არის 6.
                            new XElement("FULL_AMOUNT", ""), // ზედნადების სრული თანხა.
                            new XElement("CAR_NUMBER", filter.CarNumber), // მანქანის ნომერი.
                            new XElement("WAYBILL_NUMBER", ""), // --- სავარაუდოდ ზედნადების ნომერი ---.
                            //new XElement("S_USER_ID", "783"), // --- არვიცი (აბრუნებს "chek_service_user") ---.
                            new XElement("BEGIN_DATE", DateTime.Now.ToString("yyyy-M-dTHH:mm:ss")), // ტრანსპორტირების დაწყების თარიღი (აუცილებლად თარიღი და დრო უნდა იყოს გამოყოფილი T სიმბოლით).
                            new XElement("TRAN_COST_PAYER", filter.TransId == "1" ? "1" : "2"), // ტრანსპორტირების ღირებულებას იხდის (1 - მყიდველი, 2 - გამყიდველი).
                            new XElement("TRANS_ID", filter.TransId), // ტრანსპორტის ტიპის ID (1 - საავტომობილო, 2 - სარკინიგზო, 3 - საავიაციო, 4 - სხვა).
                            new XElement("TRANS_TXT", filter.TransTxt), // ეთითება მაშინ როცა ტრანსპორტირების ტიპი არის "სხვა" ანუ არჩეულია 4.
                            new XElement("COMMENT", "ვიზიტის ID " + visitId.ToString()), // კომენტარი, შენიშვნა.
                            new XElement("TRANSPORTER_TIN", ""),
                            new XElement("CATEGORY", "0") // ცარიელია ან 0 (ჩვეულებრივი), 1 (ხე).
                        );

            var xmlData = new XDocument(element).Root;

            XDocument res = new RsServiceFuncs(true).CallRsService("save_waybill", "<su>" + this._rs_user + "</su><sp>" + this._rs_password + "</sp><waybill>" + xmlData + "</waybill>");

            return Convert.ToInt32(res.Descendants().ElementAt(5).Value);
        }

        public string GetSellerUnId()
        {
            XDocument doc = XDocument.Load(Path.Combine(_path, "rs_data.xml"));
            this._rs_user = doc.Root.Element("user").Value;
            this._rs_password = doc.Root.Element("pass").Value;

            XDocument res = new RsServiceFuncs(true).CallRsService("chek_service_user", "<su>" + this._rs_user + "</su><sp>" + this._rs_password + "</sp>");
            return res.Descendants().ElementAt(4).Value;
        }

        public string GetErrorCodes()
        {
            XDocument doc = XDocument.Load(Path.Combine(_path, "rs_data.xml"));
            this._rs_user = doc.Root.Element("user").Value;
            this._rs_password = doc.Root.Element("pass").Value;

            XDocument res = new RsServiceFuncs(true).CallRsService("get_error_codes", "<su>" + this._rs_user + "</su><sp>" + this._rs_password + "</sp>");
            return res.Root.Value;
        }

        public static string SerializeWithoutAnnotation(object value)
        {
            var emptyNamepsaces = new XmlSerializerNamespaces(new[] { XmlQualifiedName.Empty });
            var serializer = new XmlSerializer(value.GetType());
            var settings = new XmlWriterSettings();
            settings.Indent = true;
            settings.OmitXmlDeclaration = true;

            using (var stream = new StringWriter())
            using (var writer = XmlWriter.Create(stream, settings))
            {
                serializer.Serialize(writer, value, emptyNamepsaces);
                return stream.ToString();
            }
        }

        public static string SerializeWithAnnotation(object dataToSerialize)
        {
            if (dataToSerialize == null) return null;

            using (StringWriter stringwriter = new StringWriter())
            {
                var serializer = new XmlSerializer(dataToSerialize.GetType());
                serializer.Serialize(stringwriter, dataToSerialize);
                return stringwriter.ToString();
            }
        }
        // ---
    }
}