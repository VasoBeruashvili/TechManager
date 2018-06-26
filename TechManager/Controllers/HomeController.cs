using FinaPart;
using Spire.Pdf;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Web.Mvc;
using System.Xml.Linq;
using TechManager.Enums;
using TechManager.GenerationLogic;
using TechManager.Models;
using TechManager.Utils;

namespace TechManager.Controllers
{
    [Authorize]
    public class HomeController : BaseController
    {
        FinaContext context = new FinaContext();
        RsServiceFuncs rs = new RsServiceFuncs(false);
        DBContext _dbContext = new DBContext();
        FinaLogic finaLogic = new FinaLogic();


        public ActionResult Equipments()
        {
            string returnUrl = "/Home/Equipments";

            dynamic userType = Session["IsAdmin"];
            if (userType != null && userType.x)
            {
            }
            else if (userType != null && !userType.x)
            {
                returnUrl = "/Home/Visits";
                return Redirect(returnUrl);
            }
            else if (userType == null)
            {
                returnUrl = "/Account/Index";
                return Redirect(returnUrl);
            }

            return View();
        }

        public ActionResult Visits()
        {
            string returnUrl = "/Home/Visits";

            dynamic userType = Session["IsAdmin"];
            if (userType != null && !userType.x)
            {
            }
            else if (userType != null && userType.x)
            {
                //returnUrl = "/Home/Equipments";
                //return Redirect(returnUrl);
                //return View();
            }
            else if (userType == null)
            {
                returnUrl = "/Account/Index";
                return Redirect(returnUrl);
            }

            return View();
        }

        public ActionResult VisitRegistration(int? id)
        {
            string returnUrl = "/Home/VisitRegistration";

            dynamic userType = Session["IsAdmin"];
            if (userType != null && !userType.x)
            {
            }
            else if (userType != null && userType.x)
            {
                //returnUrl = "/Home/Equipments";
                //return Redirect(returnUrl);
            }
            else if (userType == null)
            {
                returnUrl = "/Account/Index";
                return Redirect(returnUrl);
            }

            ViewBag.visitID = id == null ? 0 : id;

            return View();
        }

        public ActionResult Actions()
        {
            string returnUrl = "/Home/Actions";

            dynamic userType = Session["IsAdmin"];
            if (userType != null && userType.x)
            {
            }
            else if (userType != null && !userType.x)
            {
                returnUrl = "/Home/Visits";
                return Redirect(returnUrl);
            }
            else if (userType == null)
            {
                returnUrl = "/Account/Index";
                return Redirect(returnUrl);
            }

            return View();
        }

        public ActionResult EquipmentTypes()
        {
            string returnUrl = "/Home/EquipmentTypes";

            dynamic userType = Session["IsAdmin"];
            if (userType != null && userType.x)
            {
            }
            else if (userType != null && !userType.x)
            {
                returnUrl = "/Home/Visits";
                return Redirect(returnUrl);
            }
            else if (userType == null)
            {
                returnUrl = "/Account/Index";
                return Redirect(returnUrl);
            }

            return View();
        }

        public ActionResult ProgramVersions()
        {
            string returnUrl = "/Home/ProgramVersions";

            dynamic userType = Session["IsAdmin"];
            if (userType != null && userType.x)
            {
            }
            else if (userType != null && !userType.x)
            {
                returnUrl = "/Home/Visits";
                return Redirect(returnUrl);
            }
            else if (userType == null)
            {
                returnUrl = "/Account/Index";
                return Redirect(returnUrl);
            }

            return View();
        }

        public JsonResult InitPage()
        {
            var user = finaLogic.GetUser(User.Identity.Name);
            string userName = user == null ? "" : string.Format("{0} {1}", user.name, user.surname);
            int userID = user == null ? 0 : user.id;
            return Json(new { x = Session["IsAdmin"], userName = userName, userID = userID });
        } //+

        public JsonResult GetEquipmentGroupsWithEquipments()
        {
            var equipmentGroups = context.EquipmentGroups.Include("Equipments").Select(eg => new
            {
                ID = eg.ID,
                Name = eg.Name,
                Equipments = eg.Equipments.Select(e => new
                {
                    ID = e.ID,
                    Name = e.Name,
                    EquipmentGroupID = e.EquipmentGroupID
                }).OrderBy(e => e.Name)
            }).OrderBy(eg => eg.Name);

            return Json(new { equipmentGroups = equipmentGroups });
        }

        public JsonResult SaveEquipmentGroupWithEquipments(EquipmentGroups equipmentGroupModel)
        {
            context.Save(equipmentGroupModel);

            return Json(new { saveResult = context.SaveChanges() >= 0 });
        }

        public JsonResult GetActionsWithActionItems()
        {
            var actions = context.Actions.Include("ActionItems.SubActionItems").ToList().Select(a => new
            {
                ID = a.ID,
                Name = a.Name,
                ActionTypeID = a.ActionTypeID,
                isHidden = a.IsHidden,
                ActionItems = a.ActionItems.Select(ai => new
                {
                    ID = ai.ID,
                    Name = ai.Name,
                    ActionID = ai.ActionID,
                    isHidden = ai.IsHidden,
                    hasSerial = ai.HasSerial,
                    //ProductID = ai.ProductID,                    
                    subActionItems = ai.SubActionItems.Select(sai => new
                    {
                        id = sai.ID,
                        name = sai.Name,
                        code = sai.ProductId.HasValue ? finaLogic.GetProductById(sai.ProductId.Value).Code : string.Empty,
                        isHidden = sai.IsHidden,
                        actionItemId = sai.ActionItemId,
                        productId = sai.ProductId,
                        unitName = sai.ProductId.HasValue ? finaLogic.GetUnitById(finaLogic.GetProductById(sai.ProductId.Value).UnitId.Value).FullName : string.Empty,
                        price = sai.ProductId.HasValue ? finaLogic.GetProductPrice(sai.ProductId.Value, 3).ManualVal : null,
                        currencyType = sai.ProductId.HasValue ? finaLogic.GetProductPrice(sai.ProductId.Value, 3).ManualCurrencyId : null,
                        groupName = sai.ProductId.HasValue ? finaLogic.GetGroupProductById(finaLogic.GetProductById(sai.ProductId.Value).GroupId.Value).Name : string.Empty
                    }).OrderBy(sai => sai.name)
                }).OrderBy(ai => ai.Name)
            }).OrderBy(a => a.Name);

            return Json(new { actions = actions });
        } //+

        public JsonResult SaveActionWithActionItems(Actions actionModel)
        {
            context.Save(actionModel);

            return Json(new { saveResult = context.SaveChanges() >= 0 });
        }

        public JsonResult GetProducts(string path)
        {
            //if path is empty string or null take only all products and not services else take all provided services
            var products = finaLogic.GetProducts(path);

            return Json(new { products = products.OrderBy(p => p.Name) });
        } //+

        public JsonResult GetSubContragents()
        {
            var subContragents = finaLogic.GetSubContragents();

            return Json(new { subContragents = subContragents });
        } //+

        public JsonResult GetVisits(int? userID, string fromDate, string toDate, string searchText, string signatureOwner, bool? asPerContract, bool? rent, bool? sales, bool? other1, bool? inOffice, bool? onSite, bool? warranty, bool? postWarranty, bool? other2, bool? toAccount, bool? paymentOnDelivery, bool? paid, bool? warrantyPay, bool? rentPay, string protocolText, string actionCommentText, string searchInProductList)
        {
            fromDate += " 00:00:00";
            toDate += " 23:59:59";

            DateTime dateFrom = Convert.ToDateTime(fromDate);
            DateTime dateTo = Convert.ToDateTime(toDate);

            //var _visits = userID == null ? context.Visits.Where(v => DbFunctions.TruncateTime(v.CreateDate) >= dateFrom
            //&& DbFunctions.TruncateTime(v.CreateDate) <= dateTo)
            //: context.Visits.Where(v => v.CreatorUserID == userID
            //&& DbFunctions.TruncateTime(v.CreateDate) >= dateFrom
            //&& DbFunctions.TruncateTime(v.CreateDate) <= dateTo);

            var _visits = context.Visits.Where(v => v.VisitDate >= dateFrom
            && v.VisitDate2 <= dateTo);

            //advanced search
            if (!string.IsNullOrEmpty(searchText))
            {
                _visits = _visits.Where(v => v.VisitProcesses.Any(vp => vp.generatedResults.Any(vpgr => vpgr.Text.Contains(searchText))));
            }

            if (!string.IsNullOrEmpty(signatureOwner))
            {
                _visits = _visits.Where(v => v.ClientFullName.Contains(signatureOwner));
            }

            if (!string.IsNullOrEmpty(actionCommentText))
            {
                _visits = _visits.Where(v => v.VisitProcesses.Any(vp => vp.generatedResults.Any(vpgr => vpgr.Comment.Contains(actionCommentText))));
            }

            if (!string.IsNullOrEmpty(searchInProductList))
            {
                _visits = _visits.Where(v => v.VisitProcesses.Any(vp => vp.visitProcessProducts.Any(vpp => vpp.ProductName.Contains(searchInProductList)
                || vpp.SubActionItemName.Contains(searchInProductList)
                || vpp.UnitName.Contains(searchInProductList)
                || vpp.ProductCode.Contains(searchInProductList))));
            }

            //bools
            if(asPerContract != null)
            {
                _visits = _visits.Where(v => v.AsPerContract);
            }

            if (rent != null)
            {
                _visits = _visits.Where(v => v.Rent);
            }

            if (sales != null)
            {
                _visits = _visits.Where(v => v.Sales);
            }

            if (other1 != null)
            {
                _visits = _visits.Where(v => v.Other1);
            }

            if (inOffice != null)
            {
                _visits = _visits.Where(v => v.InOffice);
            }

            if (onSite != null)
            {
                _visits = _visits.Where(v => v.OnSite);
            }

            if (warranty != null)
            {
                _visits = _visits.Where(v => v.Warranty);
            }

            if (postWarranty != null)
            {
                _visits = _visits.Where(v => v.PostWarranty);
            }

            if (other2 != null)
            {
                _visits = _visits.Where(v => v.Other2);
            }

            if (toAccount != null)
            {
                _visits = _visits.Where(v => v.ToAccount);
            }

            if (paymentOnDelivery != null)
            {
                _visits = _visits.Where(v => v.PaymentOnDelivery);
            }

            if (paid != null)
            {
                _visits = _visits.Where(v => v.Paid);
            }

            if (warrantyPay != null)
            {
                _visits = _visits.Where(v => v.WarrantyPay);
            }

            if (rentPay != null)
            {
                _visits = _visits.Where(v => v.RentPay);
            }
            //---

            //Protocols search
            if (!string.IsNullOrEmpty(protocolText))
            {
                _visits = _visits.Where(v => v.Protocol.SubProtocols.Any(sp => sp.CasinoNumber.Contains(protocolText)
                || sp.SerialNumber.Contains(protocolText)
                || sp.PlatformNumber.Contains(protocolText)
                || sp.PlombNumber.Contains(protocolText)
                || sp.Bet.Contains(protocolText)
                || sp.Win.Contains(protocolText)
                || sp.ElectricIn.Contains(protocolText)
                || sp.ElectricOut.Contains(protocolText)
                || sp.Games.Contains(protocolText)
                || sp.MechanicIn.Contains(protocolText)
                || sp.MechanicOut.Contains(protocolText)));
            }
            //---
            //---

            var visits = _visits.ToList().Select(v => new
            {
                ID = v.ID,
                VisitDate = v.VisitDate,
                VisitDate2 = v.VisitDate2,
                StatusID = v.StatusID,
                hasProtocol = v.ProtocolId != null ? "#კი" : "#არა",
                hasProductList = v.VisitProcesses.Any(vp => vp.visitProcessProducts.Any()) ? "*კი" : "*არა",
                ContragentName = finaLogic.GetContragentById(v.ContragentID).name,
                SubContragentName = finaLogic.GetSubContragentById(v.SubContragentId).Name,
                Comment = v.Comment,
                CreatorUserFullName = finaLogic.GetUserById(v.CreatorUserID).name + " " + finaLogic.GetUserById(v.CreatorUserID).surname
            });

            visits = visits.OrderByDescending(v => v.ID);

            return Json(new { visits = visits });
        } //+-? მარტზე

        private int? SendWaybill(Visits visit, string parentId, int? rsSaleType, int userId)
        {
            rs.UpdateRsUser(); //TODO remove update RS user for usage.

            //visit.Contragent.code = "12345678910"; //test product spend for EGT

            if (IsVisitValidForSignatures(visit.ID))
            {
                List<dynamic> products = new List<dynamic>();
                List<dynamic> normalWaybillProducts = new List<dynamic>();
                int? res = null;
                var company = finaLogic.GetCompany();

                if (visit.VisitProcesses != null)
                {
                    visit.VisitProcesses.ToList().ForEach(vp =>
                    {
                        if (vp.visitProcessProducts != null)
                        {
                            vp.visitProcessProducts.Where(vpp => !vpp.Deleted).ToList().ForEach(vpp =>
                            {
                                if (vpp.SaleTypeID == (int)EnumSaleTypes.Realization || vpp.SaleTypeID == (int)EnumSaleTypes.Spend) //Product realization or spend for RS.GE (რეალიზაცია ან გახარჯვა)
                                {
                                    var product = finaLogic.GetProductById(vpp.ProductID);

                                    if (product != null)
                                    {
                                        var unitType = finaLogic.GetUnitById(product.UnitId.Value);

                                        if(product.Path != "0#2#110") //გაწეული მომსახურება
                                        {
                                            var prodStore = finaLogic.GetStoreById(vpp.StoreId.Value);

                                            if(prodStore != null)
                                            {
                                                if (prodStore.Path != "0#1#4") // ! bort path
                                                {
                                                    normalWaybillProducts.Add(new
                                                    {
                                                        ProductId = product.ID,
                                                        Name = vpp.SubActionItemName,
                                                        Quantity = vpp.Amount,
                                                        Price = (vpp.Discount > 0 ? (vpp.PriceGEL - (vpp.PriceGEL * vpp.Discount / 100)) : vpp.PriceGEL),
                                                        TotalAmount = (vpp.Discount > 0 ? ((vpp.PriceGEL * vpp.Amount) - ((vpp.PriceGEL * vpp.Amount) * vpp.Discount / 100)) : (vpp.PriceGEL * vpp.Amount)),
                                                        UnitId = unitType == null ? 99 : unitType.RsId == null ? 99 : unitType.RsId.Value,
                                                        Code = product.Code
                                                    });
                                                }
                                                else
                                                {
                                                    products.Add(new
                                                    {
                                                        ProductId = product.ID,
                                                        Name = vpp.SubActionItemName,
                                                        Quantity = vpp.Amount,
                                                        Price = (vpp.Discount > 0 ? (vpp.PriceGEL - (vpp.PriceGEL * vpp.Discount / 100)) : vpp.PriceGEL),
                                                        TotalAmount = (vpp.Discount > 0 ? ((vpp.PriceGEL * vpp.Amount) - ((vpp.PriceGEL * vpp.Amount) * vpp.Discount / 100)) : (vpp.PriceGEL * vpp.Amount)),
                                                        UnitId = unitType == null ? 99 : unitType.RsId == null ? 99 : unitType.RsId.Value,
                                                        Code = product.Code
                                                    });
                                                }
                                            }
                                        }                                        
                                    }
                                }
                            });
                        }
                    });
                }

                var creatorUser = finaLogic.GetUserById(visit.CreatorUserID);
                var subContragent = finaLogic.GetSubContragentById(visit.SubContragentId);

                if (products.Count > 0)
                {
                    if (!string.IsNullOrEmpty(parentId))
                    {
                        res = rs.SaveSubWaybill(products, visit.Contragent, parentId, visit.ID, string.Format("{0} {1}", creatorUser.name, creatorUser.surname), visit.ClientFullName, subContragent.Address, rsSaleType, userId);
                    }
                }
                else
                {
                    res = 0;
                }

                if(normalWaybillProducts.Count > 0)
                {                    
                    res = rs.SaveTransportWaybill(normalWaybillProducts, visit.Contragent, visit.ID, string.Format("{0} {1}", creatorUser.name, creatorUser.surname), visit.ClientFullName, subContragent.Address, visit.WaybillFilter, company.Address, rsSaleType, userId);
                }
                else
                {
                    res = 0;
                }

                return res;
            }
            else
            {
                return null;
            }            
        } //+

        public JsonResult SaveVisit(Visits visit)
        {
            var creatorUser = finaLogic.GetUser(User.Identity.Name);
            bool saveResult = false, sendResult = false, rsResult = false;
            int? rsSaleType = null;

            visit.VisitDate = visit.VisitDate.Date + new TimeSpan(Convert.ToInt32(visit.StartTime.Split(':')[0]), Convert.ToInt32(visit.StartTime.Split(':')[1]), 00);
            visit.VisitDate2 = visit.VisitDate2.Date + new TimeSpan(Convert.ToInt32(visit.EndTime.Split(':')[0]), Convert.ToInt32(visit.EndTime.Split(':')[1]), 00);

            var protocol = context.Protocols.Include("SubProtocols").FirstOrDefault(p => p.ID == visit.ProtocolId);

            // Construct the model
            visit.CreatorUserID = creatorUser.id;
            // ---            

            // Assign visit status depend on signature
            if (!string.IsNullOrEmpty(visit.CreatorUserSignature) && !string.IsNullOrEmpty(visit.ContragentSignature))
            {
                if (protocol != null)
                {
                    if (!string.IsNullOrEmpty(protocol.TechnicalSignature) && !string.IsNullOrEmpty(protocol.ContragentSignature))
                    {
                        visit.StatusID = (int)EnumVisitStatuses.Signed;
                        visit.EndDate = DateTime.Now;
                    }
                    else
                    {
                        visit.StatusID = (int)EnumVisitStatuses.Unsigned;
                    }
                }
                else
                {
                    visit.StatusID = (int)EnumVisitStatuses.Signed;
                    visit.EndDate = DateTime.Now;
                }
            }
            else
            {
                visit.StatusID = (int)EnumVisitStatuses.Unsigned;
            }
            // ---                

            if (visit.Deleted && !IsVisitValidForSignatures(visit.ID))
            {
                if (protocol != null)
                {
                    protocol.Deleted = true;
                    context.Save(protocol);
                }

                // Save logic here
                //visit.Deleted = true;
                context.Save(visit);
                //context.SaveChanges();
                // ---

                saveResult = context.SaveChanges() >= 0;
            }            

            if (!visit.Deleted)
            {
                visit.Contragent = finaLogic.GetContragentById(visit.ContragentID);
                string warehouseSpend = string.Empty;
                string bortNumber = string.Empty;

                if (visit.VisitProcesses != null)
                {
                    visit.VisitProcesses.Where(vp => !vp.Deleted).ToList().ForEach(vp =>
                    {
                        if (vp.visitProcessProducts != null)
                        {
                            vp.visitProcessProducts.Where(vp1 => !vp1.Deleted).ToList().ForEach(vpp =>
                            {
                                var product = finaLogic.GetProductById(vpp.ProductID);
                                var vppStore = vpp.StoreId.HasValue ? finaLogic.GetStoreById(vpp.StoreId.Value) : new FinaPart.Models.Store();
                                if(vppStore.Path == "0#1#4") //ტექნიკოსზე მიმაგრებული ბორტი
                                {
                                    bortNumber = vppStore.Name;
                                }

                                if(product != null)
                                {
                                    var unitType = finaLogic.GetUnitById(product.UnitId.Value);
                                    var finaUser = finaLogic.GetUserById(visit.CreatorUserID);

                                    if (vpp.SaleTypeID == (int)EnumSaleTypes.Realization) //რეალიზაცია
                                    {                                       
                                        vpp.GeneralId = FinaRealization(vpp.GeneralId, visit.ContragentID, (vpp.Discount > 0 ? (vpp.PriceGEL - (vpp.PriceGEL * vpp.Discount / 100)) : vpp.PriceGEL), vpp.StoreId, (finaUser == null ? 0 : (finaUser.staff_id.HasValue ? finaUser.staff_id.Value : 0)), vpp.Amount, vpp.ProductID, unitType.Id, null);
                                    }

                                    if (vpp.SaleTypeID == (int)EnumSaleTypes.Spend) //გახარჯვა (გახარჯვის დროს ხდება რეალიზაცია EGT -ზე ანუ თავისივე თავზე)
                                    {
                                        var staff = finaLogic.GetStaffById(creatorUser.staff_id.Value);
                                        var contragent = finaLogic.GetContragentByCode(staff.code); //FINA -ს კონტრაგენტებში უნდა ჩაემატოს ყველა თანამშრომელი რათა მოხდეს მათზე გატარება FINA -ში.
                                        visit.Contragent = contragent;
                                        //visit.ContragentID = contragent.id;
                                        rsSaleType = (int)EnumSaleTypes.Spend;
                                        warehouseSpend = finaLogic.GetStoreById(vpp.StoreId.Value).Path;
                                        vpp.GeneralId = contragent == null ? 0 : FinaRealization(vpp.GeneralId, contragent.id, (vpp.Discount > 0 ? (vpp.PriceGEL - (vpp.PriceGEL * vpp.Discount / 100)) : vpp.PriceGEL), vpp.StoreId, (finaUser == null ? 0 : (finaUser.staff_id.HasValue ? finaUser.staff_id.Value : 0)), vpp.Amount, vpp.ProductID, unitType.Id, rsSaleType);
                                    }

                                    if (vpp.SaleTypeID == (int)EnumSaleTypes.Retirement)
                                    {
                                        vpp.GeneralId = FinaProductCancel(vpp.GeneralId, vpp.StoreId, (finaUser == null ? 0 : (finaUser.staff_id.HasValue ? finaUser.staff_id.Value : 0)), vpp.Amount, vpp.ProductID, unitType.Id);
                                    }

                                    if(vpp.SaleTypeID == (int)EnumSaleTypes.ProvideService) //მომსახურების გაწევა
                                    {
                                        vpp.ProductCode = product.Code;
                                        if(vpp.Discount >= 0 && vpp.Discount < 100) //თუ ფასდაკლება მომსახურებაზე არის 100% მაშინ FINA-ში არ გაატაროს, მარტო შეინახოს ჩანაწერი.
                                        {
                                            vpp.GeneralId = FinaProvideService(vpp.GeneralId, visit.ContragentID, (vpp.Discount > 0 ? (vpp.PriceGEL - (vpp.PriceGEL * vpp.Discount / 100)) : vpp.PriceGEL), 1, (finaUser == null ? 0 : (finaUser.staff_id.HasValue ? finaUser.staff_id.Value : 0)), vpp.Amount, vpp.ProductID, unitType.Id);
                                        }
                                    }
                                }
                            });
                        }
                    });
                }

                // Save logic here
                //visit.Deleted = true;
                context.Save(visit);
                //context.SaveChanges();
                // ---

                saveResult = context.SaveChanges() >= 0;

                var parentWaybill = finaLogic.GetProductShipping(bortNumber); //pirveli aqtiuri distribuciis zednadebi 

                // Waybill Logic
                int? rsSent = null;
                if(warehouseSpend == string.Empty)
                {
                    rsSent = SendWaybill(visit, parentWaybill == null ? null : parentWaybill.WaybillId.Value.ToString(), rsSaleType, finaLogic.GetUser(User.Identity.Name).id);
                }
                else
                {
                    if (warehouseSpend == "0#1#4") //bort
                    {
                        rsSent = SendWaybill(visit, parentWaybill == null ? null : parentWaybill.WaybillId.Value.ToString(), rsSaleType, finaLogic.GetUser(User.Identity.Name).id);
                    }
                    else if(warehouseSpend == "0#1#2") //store
                    {
                        rsSent = 0;
                    }          
                }
                //int? rsSent = 0; //TODO remove

                rsResult = rsSent != null && rsSent == 0;

                if (rsResult)
                {
                    dynamic emailSend = SendContragentEmail(visit.ID).Data as dynamic;
                    sendResult = emailSend.sendResult;
                    //sendResult = true; //TODO remove
                }
                // ---                
            }

            if(!rsResult || !sendResult)
            {
                if (!visit.Deleted)
                {
                    ClearSignatures(visit.ID);
                }
            }

            saveResult = context.SaveChanges() >= 0;

            if (!IsVisitValidForSignatures(visit.ID))
            {
                rsResult = true;
                sendResult = true;
            }

            return Json(new { saveResult = saveResult, sendResult = sendResult, rsResult = rsResult });
        } //+

        //public JsonResult ValidateRsDistUser()
        //{
        //    var rsDistUser = 
        //}

        public JsonResult SearchProducts(string name)
        {
            return Json(finaLogic.SearchProducts(name));
        } //+

        public JsonResult SearchProductsWithImages(string name)
        {
            var products = finaLogic.SearchProductsWithImages(name);

            return Json(products);
        } //+

        public JsonResult GetProductById(int id)
        {
            var product = finaLogic.GetProductWithImagesById(id);

            return Json(product);
        } //+

        public JsonResult GetProductByCode(string code)
        {
            var product = finaLogic.GetProductWithImagesByCode(code);

            return Json(product);
        } //+

        public JsonResult CheckWaybill(string bortNumber)
        {
            var parentWaybill = finaLogic.GetProductShipping(bortNumber); //pirveli aqtiuri distribuciis zednadebi

            if (parentWaybill != null)
            {
                return Json(!string.IsNullOrEmpty(finaLogic.GetGeneralDocById(parentWaybill.GeneralId.Value).WaybillNum));
            }else
            {
                return Json(false);
            }
        } //+

        public JsonResult CheckMoveWaybill(string bortNumber) //+
        {
            var moveWaybill = finaLogic.GetProductMove(bortNumber); //pirveli aqtiuri shidagadatanis zednadebi

            if (moveWaybill != null)
            {
                return Json(!string.IsNullOrEmpty(finaLogic.GetGeneralDocById(moveWaybill.GeneralId).WaybillNum));
            }
            else
            {
                return Json(false);
            }
        }

        public JsonResult GetServerDateTime()
        {
            return Json(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
        }

        public JsonResult ClearSignatures(int visitId)
        {
            var visit = context.Visits.Include("Protocol").FirstOrDefault(v => v.ID == visitId);

            if(visit != null)
            {
                visit.ContragentSignature = string.Empty;
                visit.CreatorUserSignature = string.Empty;
                visit.ClientFullName = string.Empty;
                visit.EndDate = null;

                if(visit.Protocol != null)
                {
                    visit.Protocol.TechnicalSignature = string.Empty;
                    visit.Protocol.ContragentSignature = string.Empty;

                    context.Save(visit.Protocol);
                }
            }

            visit.StatusID = (int)EnumVisitStatuses.Unsigned;

            context.Save(visit);
            return Json(new { saveResult = context.SaveChanges() >= 0 });
        }

        public JsonResult GetVisit(int? visitID)
        {
            var creatorUser = finaLogic.GetUser(User.Identity.Name);

            //var _visit = creatorUser.group_id == (int)EnumUserGroups.Admin ? context.Visits.Where(v => v.ID == visitID)
            //    : creatorUser.group_id == (int)EnumUserGroups.Engineer ? context.Visits.Where(v => v.ID == visitID && v.CreatorUserID == creatorUser.id)
            //    : null;

            var _visit = context.Visits.Where(v => v.ID == visitID);

            var visit = _visit.ToList().Select(v => new {
                id = v.ID,
                Comment = v.Comment,
                SubContragentId = v.SubContragentId,
                creatorUserSignature = v.CreatorUserSignature,
                contragentSignature = v.ContragentSignature,
                createDate = v.CreateDate,
                endDate = v.EndDate,
                protocolId = v.ProtocolId,
                warranty = v.Warranty,
                postWarranty = v.PostWarranty,
                inOffice = v.InOffice,
                onSite = v.OnSite,
                asPerContract = v.AsPerContract,
                rent = v.Rent,
                sales = v.Sales,
                paid = v.Paid,
                toAccount = v.ToAccount,
                paymentOnDelivery = v.PaymentOnDelivery,
                other1 = v.Other1,
                other2 = v.Other2,
                warrantyPay = v.WarrantyPay,
                rentPay = v.RentPay,
                visitDate = v.VisitDate,
                visitDate2 = v.VisitDate2,
                startTime = v.StartTime,
                endTime = v.EndTime,
                clientFullName = v.ClientFullName,
                subContragent = finaLogic.GetSubContragentById(v.SubContragentId) == null ? null : new
                {
                    id = finaLogic.GetSubContragentById(v.SubContragentId).Id,
                    name = finaLogic.GetSubContragentById(v.SubContragentId).Name,
                    contragent = finaLogic.GetContragentById(v.ContragentID) == null ? null : new
                    {
                        id = finaLogic.GetContragentById(v.ContragentID).id,
                        name = finaLogic.GetContragentById(v.ContragentID).name
                    }
                },
                protocol = v.Protocol == null ? null : new
                {
                    id = v.Protocol.ID,
                    contragentSignature = v.Protocol.ContragentSignature,
                    technicalSignature = v.Protocol.TechnicalSignature,
                    date = v.Protocol.Date,
                    subProtocols = context.SubProtocols.Where(sp => sp.ProtocolId == v.Protocol.ID).ToList().Select(sp => new SubProtocol {
                        ID = sp.ID,
                        ProtocolId = sp.ProtocolId,
                        CasinoNumber = sp.CasinoNumber,
                        SerialNumber = sp.SerialNumber,
                        PlatformNumber = sp.PlatformNumber,
                        Bet = sp.Bet,
                        Win = sp.Win,
                        ElectricIn = sp.ElectricIn,
                        ElectricOut = sp.ElectricOut,
                        Games = sp.Games,
                        MechanicIn = sp.MechanicIn,
                        MechanicOut = sp.MechanicOut,
                        Status = sp.Status,
                        PlombNumber = sp.PlombNumber
                    }).ToList(),
                    equipmentTypeIds = v.Protocol.EquipmentTypeIds,
                    programVersionIds = v.Protocol.ProgramVersionIds
                },
                visitProcesses = v.VisitProcesses.Select(vp => new
                {
                    id = vp.ID,
                    visitID = vp.VisitID,
                    generatedResults = vp.generatedResults.Select(gr => new
                    {
                        ID = gr.ID,
                        VisitProcessEquipmentID = gr.VisitProcessEquipmentID,
                        VisitProcessID = gr.VisitProcessID,
                        ActionItemID = gr.ActionItemID,
                        Text = gr.Text,
                        Comment = gr.Comment,
                        fakeId = gr.FakeId
                    }),
                    chosenEquipments = vp.chosenEquipments.Select(ce => new
                    {
                        DoorOpenDate = ce.DoorOpenDate,
                        DoorOpenTime = ce.DoorOpenTime,
                        EquipmentID = ce.EquipmentID,
                        EquipmentSeries = ce.EquipmentSeries,
                        ID = ce.ID,
                        VisitProcessID = ce.VisitProcessID,
                        Name = ce.Equipment.Name,
                        EquipmentGroupID = ce.EquipmentGroupID
                    }),
                    visitProcessProducts = vp.visitProcessProducts.Select(vpp => new
                    {
                        ID = vpp.ID,
                        VisitProcessID = vpp.VisitProcessID,
                        ProductID = vpp.ProductID,
                        ProductName = vpp.ProductName,
                        SaleTypeID = vpp.SaleTypeID,
                        Amount = vpp.Amount,
                        PriceEUR = vpp.PriceEUR,
                        PriceGEL = vpp.PriceGEL,
                        PriceUSD = vpp.PriceUSD,
                        Price = vpp.Price,
                        Rate = vpp.Rate,
                        RateUSD = vpp.RateUSD,
                        EquipmentID = vpp.EquipmentID,
                        ActionItemID = vpp.ActionItemID,
                        OldSeries = vpp.OldSeries,
                        NewSeries = vpp.NewSeries,
                        StoreId = vpp.StoreId,
                        subActionItemName = vpp.SubActionItemName,
                        discount = vpp.Discount,
                        total = vpp.Total,
                        currencyType = vpp.currencyType,
                        unitName = vpp.UnitName,
                        generalId = vpp.GeneralId,
                        productCode = vpp.ProductCode,
                        fakeId = vpp.FakeId
                    })
                })
            }).FirstOrDefault();

            return Json(visit);
        } //+

        public JsonResult GetEquipmentTypesByIds(string ids)
        {
            if (!string.IsNullOrEmpty(ids))
            {
                var splittedIds = ids.Split(',').ToList().Select(x => Convert.ToInt32(x));

                return Json(context.EquipmentTypes.Where(et => splittedIds.Contains(et.ID)).ToList());
            }
            else
            {
                return null;
            }
        }

        public JsonResult GetProgramVersionsByIds(string ids)
        {
            if (!string.IsNullOrEmpty(ids))
            {
                var splittedIds = ids.Split(',').ToList().Select(x => Convert.ToInt32(x));

                return Json(context.ProgramVersions.Where(et => splittedIds.Contains(et.ID)).ToList());
            }
            else
            {
                return null;
            }
        }

        public bool SendEmail(List<dynamic> file, string Subject, string SmtpHost, int SmtpPort, bool EnableSsl, string SenderAddress, string login, string password, List<string> BCC, string MessageText)
        {
            Attachment fileAttachment;
            using (MailMessage mailMessage = new MailMessage()
            {
                From = new MailAddress(SenderAddress),
                Priority = MailPriority.High,
                Body = MessageText,
                Subject = Subject
            })
            {
                try
                {
                    SmtpClient smtpClient = new SmtpClient()
                    {
                        Host = SmtpHost,
                        Port = SmtpPort,
                        //UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(login, password),
                        EnableSsl = EnableSsl
                    };
                    for (int i = 0; i < file.Count; i++)
                    {
                        if (!string.IsNullOrEmpty(file[i].filePath))
                        {
                            fileAttachment = new Attachment(file[i].filePath, MediaTypeNames.Application.Octet);
                            ContentDisposition disposition = fileAttachment.ContentDisposition;
                            disposition.FileName = string.Format("{0}_{1}{2}", file[i].endDateTime.ToString(), file[i].subCtrName.ToString(), ".pdf");
                            disposition.CreationDate = System.IO.File.GetCreationTime(file[i].filePath);
                            disposition.ModificationDate = System.IO.File.GetLastWriteTime(file[i].filePath);
                            disposition.ReadDate = System.IO.File.GetLastAccessTime(file[i].filePath);
                            mailMessage.Attachments.Add(fileAttachment);
                        }
                    }
                    //ReceiverAddress.ForEach(toEmail => { mailMessage.To.Add(toEmail); });
                    BCC.ForEach(bcc => { mailMessage.Bcc.Add(bcc); });

                    //TODO remove
                    ServicePointManager.ServerCertificateValidationCallback =
                    delegate (object s, X509Certificate certificate, X509Chain chain,
                    SslPolicyErrors sslPolicyErrors) { return true; };
                    //---

                    smtpClient.Send(mailMessage);
                }
                catch (Exception ex) //TODO change
                {
                    throw ex;
                    //return false;
                }

                return true;
            }
        }

        private bool IsVisitValidForSignatures(int visitId)
        {
            bool result = false;
            var visit = context.Visits.FirstOrDefault(v => v.ID == visitId);
            Protocol protocol = null;
            if(visit != null)
            {
                if (visit.ProtocolId.HasValue)
                {
                    protocol = context.Protocols.FirstOrDefault(p => p.ID == visit.ProtocolId);
                }

                result = !string.IsNullOrEmpty(visit.ContragentSignature) && !string.IsNullOrEmpty(visit.CreatorUserSignature);

                if(protocol != null)
                {
                    result = result && !string.IsNullOrEmpty(protocol.ContragentSignature) && !string.IsNullOrEmpty(protocol.TechnicalSignature);
                }
            }

            return result;
        }
       
        public JsonResult SendContragentEmail(int visitID)
        {
            var visit = context.Visits.FirstOrDefault(v => v.ID == visitID);
            string filePath1 = null, filePath2 = null;
            bool result = false;
            if(visit != null)
            {
                if(IsVisitValidForSignatures(visitID))
                {
                    var subContragent = finaLogic.GetSubContragentById(visit.SubContragentId);

                    filePath1 = GenerateServiceProtocolPdf(visitID);
                    if (visit.Protocol != null)
                    {
                        filePath2 = GenerateVisitProtocolPdf(visitID);
                    }

                    var companyInfo = context.CompanyInfos.FirstOrDefault();

                    var smtp = companyInfo.Smtp;
                    var port = companyInfo.Port;
                    var ssl = companyInfo.Ssl;
                    var sender = companyInfo.Sender;
                    var login = companyInfo.Login;
                    var pwd = companyInfo.Pwd;
                    
                    List<string> emails = new List<string>();
                    var contragentContacts = finaLogic.GetContragentContactsByContragentId(visit.ContragentID).ToList();
                    contragentContacts.ForEach(cc =>
                    {
                        emails.Add(cc.Email);
                    });

                    var toSendPersons = companyInfo.ToSendPersons.Split(',');

                    for (int i = 0; i < toSendPersons.Length; i++)
                    {
                        emails.Add(toSendPersons[i]);
                    }

                    result = SendEmail(
                        new List<dynamic> { //file pathes for attachments PDF and Excel
                            new { filePath = filePath1, endDateTime = visit.VisitDate2.ToString("yyyy.MM.dd"), subCtrName = string.Format("{0}_{1}{2}", subContragent.Name, "SP", visit.ID) },
                            new { filePath = filePath2, endDateTime = visit.VisitDate2.ToString("yyyy.MM.dd"), subCtrName = string.Format("{0}_{1}{2}", subContragent.Name, "AC", visit.ID) }
                        },
                        "", //subject text
                        smtp, //smtp host
                        Convert.ToInt32(port), //smtp port
                        Convert.ToBoolean(ssl), //enable ssl
                        sender, //sender address
                        login, //login
                        pwd, //password
                        emails, //bcc list of email addresses to send
                        "" //message text
                    );
                }
            }            

            return Json(new { sendResult = result });
        } //+

        //private string GetVisitDocumentPdf(List<dynamic> visitProcessEquipmentActionItems, string creatorUserSignature, string contragentSignature)
        //{
        //    string filePath = string.Empty;

        //    XElement element = new XElement("root",
        //                            new XElement("items", visitProcessEquipmentActionItems.Select(i => new XElement("item",
        //                                new XElement("Text", i.Text),
        //                                new XElement("Comment", i.Comment)
        //                            ))),
        //                            new XElement("CreatorUserSignature", creatorUserSignature),
        //                            new XElement("ContragentSignature", contragentSignature),
        //                            new XElement("width", 300),
        //                            new XElement("height", 150)
        //                        );

        //    ExportPdf exportPdf = new ExportPdf();

        //    PdfPageSettings setting = new PdfPageSettings() { Size = PdfPageSize.A4 };
        //    filePath = exportPdf.GeneratePdf(element, "visit_document.xslt", setting);

        //    return filePath;
        //}

        public JsonResult GetCurrencyRateById(int id)
        {
            var currency = finaLogic.GetCurrencyById(id);
            double rate = 0;

            if(currency != null)
            {
                rate = currency.Rate.Value;
            }

            return Json(rate);
        } //+

        public JsonResult GetStores()
        {
            return Json(finaLogic.GetOrderedStores());
        } //+

        public JsonResult SaveProtocol(Protocol protocol)
        {
            context.Save(protocol);
            context.SaveChanges();

            return Json(new { id = protocol.ID });
        }

        public JsonResult GetVisitStatus(int visitId)
        {
            return Json(new { visitStatus = context.Visits.FirstOrDefault(v => v.ID == visitId).StatusID }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetEquipmentTypes()
        {
            return Json(new { equipmentTypes = context.EquipmentTypes.OrderBy(et => et.Name).ToList() });
        }

        public JsonResult GetProgramVersions()
        {
            return Json(new { programVersions = context.ProgramVersions.OrderBy(pv => pv.Name).ToList() });
        }

        public JsonResult SaveEquipmentType(EquipmentType equipmentTypeModel)
        {
            context.Save(equipmentTypeModel);

            return Json(new { saveResult = context.SaveChanges() >= 0 });
        }

        public JsonResult SaveProgramVersion(ProgramVersion programVersionModel)
        {
            context.Save(programVersionModel);

            return Json(new { saveResult = context.SaveChanges() >= 0 });
        }             

        private string GenerateVisitProtocolPdf(int visitId)
        {
            string filePath = string.Empty;

            var visit = context.Visits.Include("Protocol.SubProtocols").FirstOrDefault(v => v.ID == visitId);
            var subContragent = finaLogic.GetSubContragentById(visit.SubContragentId);
            var contragent = finaLogic.GetContragentById(subContragent.ContragentId.Value);
            var protocol = visit.Protocol;

            var splittedEquipmentTypeIds = protocol.EquipmentTypeIds.Split(',').Select(x => Convert.ToInt32(x)).ToList();
            var equipmentTypes = context.EquipmentTypes.Where(et => splittedEquipmentTypeIds.Contains(et.ID)).ToList();
            var splittedProgramVersionIds = protocol.ProgramVersionIds.Split(',').Select(x => Convert.ToInt32(x)).ToList();
            var programVersions = context.ProgramVersions.Where(pv => splittedProgramVersionIds.Contains(pv.ID)).ToList();

            var creatorUser = finaLogic.GetUserById(visit.CreatorUserID);

            //image and base64 processing
            Image contragentSignatureImage = SaveByteArrayAsImage(protocol.ContragentSignature.Remove(0, 22));
            string contragentSignatureBase64 = string.Format("data:image/png;base64,{0}", ImageToBase64(contragentSignatureImage, System.Drawing.Imaging.ImageFormat.Png));

            Image userSignatureImage = SaveByteArrayAsImage(protocol.TechnicalSignature.Remove(0, 22));
            string userSignatureBase64 = string.Format("data:image/png;base64,{0}", ImageToBase64(userSignatureImage, System.Drawing.Imaging.ImageFormat.Png));
            //

            XElement element = new XElement("root",
                                    new XElement("companyName", contragent.name),
                                    new XElement("address", subContragent.Address),
                                    new XElement("casinoName", subContragent.Name),
                                    new XElement("equipmentType", equipmentTypes == null ? null : equipmentTypes.Select(et => string.Format("{0}, ", et.Name))),
                                    new XElement("contragentSignature", contragentSignatureBase64),
                                    new XElement("technicalSignature", userSignatureBase64),

                                    new XElement("companyStaffName", visit.ClientFullName),
                                    new XElement("creatorUserName", string.Format("{0} {1}", creatorUser.name, creatorUser.surname)),

                                    new XElement("protocolNumber", visit.ID),
                                    new XElement("protocolDate", protocol.Date.Value.ToString("yyyy-MM-dd")),
                                    new XElement("programVersion", programVersions == null ? null : programVersions.Select(pv => string.Format("{0}, ", pv.Name))),
                                    new XElement("items", protocol.SubProtocols.Where(x => !x.Deleted).Select(i => new XElement("item",
                                        new XElement("status", i.Status == 0 ? "" : i.Status == 1 ? "ძველი" : "ახალი"),
                                        new XElement("casinoNumber", i.CasinoNumber),
                                        new XElement("serialNumber", i.SerialNumber),
                                        new XElement("platformNumber", i.PlatformNumber),
                                        new XElement("plombNumber", i.PlombNumber),
                                        new XElement("bet", i.Bet),
                                        new XElement("win", i.Win),
                                        new XElement("electricIn", i.ElectricIn),
                                        new XElement("electricOut", i.ElectricOut),
                                        new XElement("games", i.Games),
                                        new XElement("mechanicIn", i.MechanicIn),
                                        new XElement("mechanicOut", i.MechanicOut)
                                    )))
                                );

            ExportPdf exportPdf = new ExportPdf();

            PdfPageSettings setting = new PdfPageSettings() { Size = PdfPageSize.A4, Orientation = PdfPageOrientation.Landscape };
            filePath = exportPdf.GeneratePdf(element, "visit_protocol_document.xslt", setting, visit.VisitDate2.ToString("yyyy.MM.dd"), string.Format("{0}_{1}{2}", subContragent.Name, "AC", visit.ID));

            return filePath;
        } //+

        private string GenerateServiceProtocolPdf(int visitId)
        {
            string filePath = string.Empty;

            var visit = context.Visits.Include("Protocol.SubProtocols").FirstOrDefault(v => v.ID == visitId);
            var subContragent = finaLogic.GetSubContragentById(visit.SubContragentId);
            var contragent = finaLogic.GetContragentById(subContragent.ContragentId.Value);
            var creatorUser = finaLogic.GetUserById(visit.CreatorUserID);
            
            //image and base64 processing
            Image contragentSignatureImage = SaveByteArrayAsImage(visit.ContragentSignature.Remove(0, 22));            
            string contragentSignatureBase64 = string.Format("data:image/png;base64,{0}", ImageToBase64(contragentSignatureImage, System.Drawing.Imaging.ImageFormat.Png));

            Image userSignatureImage = SaveByteArrayAsImage(visit.CreatorUserSignature.Remove(0, 22));
            string userSignatureBase64 = string.Format("data:image/png;base64,{0}", ImageToBase64(userSignatureImage, System.Drawing.Imaging.ImageFormat.Png));
            //

            XElement element = new XElement("root",
                                    new XElement("id", visit.ID),
                                    new XElement("companyName", contragent.name),
                                    new XElement("address", subContragent.Address),
                                    new XElement("casinoName", subContragent.Name),
                                    new XElement("visitDate", visit.VisitDate.ToString("yyyy-MM-dd HH:mm")),
                                    new XElement("visitDate2", visit.VisitDate2.ToString("yyyy-MM-dd HH:mm")),
                                    new XElement("contragentSignature", contragentSignatureBase64),
                                    new XElement("technicalSignature", userSignatureBase64),

                                    new XElement("companyStaffName", visit.ClientFullName),
                                    new XElement("creatorUserName", string.Format("{0} {1}", creatorUser.name, creatorUser.surname)),

                                    new XElement("asPerContract", visit.AsPerContract ? "■" : "□"),
                                    new XElement("rent", visit.Rent ? "■" : "□"),
                                    new XElement("sales", visit.Sales ? "■" : "□"),
                                    new XElement("other1", visit.Other1 ? "■" : "□"),
                                    new XElement("inOffice", visit.InOffice ? "■" : "□"),
                                    new XElement("onSite", visit.OnSite ? "■" : "□"),
                                    new XElement("warranty", visit.Warranty ? "■" : "□"),
                                    new XElement("postWarranty", visit.PostWarranty ? "■" : "□"),
                                    new XElement("other2", visit.Other2 ? "■" : "□"),
                                    new XElement("toAccount", visit.ToAccount ? "■" : "□"),
                                    new XElement("paymentOnDelivery", visit.PaymentOnDelivery ? "■" : "□"),
                                    new XElement("paid", visit.Paid ? "■" : "□"),
                                    new XElement("warrantyPay", visit.WarrantyPay ? "■" : "□"),
                                    new XElement("rentPay", visit.RentPay ? "■" : "□"),
                                    new XElement("items1", visit.VisitProcesses.SelectMany(vp => vp.generatedResults == null ? new List<VisitProcessEquipmentActionItems>() : vp.generatedResults).Where(gr => !string.IsNullOrEmpty(gr.Text) && !gr.Deleted).Select(gr => new XElement("item1",
                                        new XElement("text", gr.Text),
                                        new XElement("comment", gr.Comment)
                                    ))),
                                    new XElement("items2", visit.VisitProcesses.SelectMany(vp => vp.visitProcessProducts == null ? new List<VisitProcessProducts> { } : vp.visitProcessProducts).Where(x => !x.Deleted).Select(vpp => new XElement("item2",
                                        new XElement("equipmentName", vpp.Equipment == null ? vpp.ProductName : vpp.Equipment.Name),
                                        new XElement("equipmentModel", string.IsNullOrEmpty(vpp.SubActionItemName) ? "" : vpp.SubActionItemName),
                                        new XElement("equipmentSeries", string.IsNullOrEmpty(vpp.NewSeries) ? "" : vpp.NewSeries),
                                        new XElement("productCode", string.IsNullOrEmpty(vpp.ProductCode) ? "" : vpp.ProductCode),
                                        new XElement("unitName", string.IsNullOrEmpty(vpp.UnitName) ? "" : vpp.UnitName),
                                        new XElement("quantity", vpp.Amount),
                                        new XElement("discount", vpp.Discount),
                                        new XElement("priceGEL", (vpp.Discount > 0 ? (vpp.PriceGEL - (vpp.PriceGEL * vpp.Discount / 100)) : vpp.PriceGEL)),
                                        new XElement("sum", Math.Round((vpp.Discount > 0 ? ((vpp.Amount * vpp.PriceGEL) - ((vpp.Amount * vpp.PriceGEL) * vpp.Discount / 100)) : (vpp.Amount * vpp.PriceGEL)), 2))                                        
                                    ))),
                                    new XElement("totalSum", visit.VisitProcesses.Select(vp => vp.visitProcessProducts == null ? 0 : Math.Round(vp.visitProcessProducts.Where(vpp => !vpp.Deleted).Sum(vpp => Math.Round((vpp.Discount > 0 ? ((vpp.Amount * vpp.PriceGEL) - ((vpp.Amount * vpp.PriceGEL) * vpp.Discount / 100)) : (vpp.Amount * vpp.PriceGEL)), 2)), 2)))
                                );

            ExportPdf exportPdf = new ExportPdf();

            PdfPageSettings setting = new PdfPageSettings() { Size = PdfPageSize.A4, Orientation = PdfPageOrientation.Portrait };
            filePath = exportPdf.GeneratePdf(element, "service_protocol_document.xslt", setting, visit.VisitDate2.ToString("yyyy.MM.dd"), string.Format("{0}_{1}{2}", subContragent.Name, "SP", visit.ID));

            return filePath;
        } //+

        private Image ResizeImage(Image imgToResize, Size size)
        {
            return (Image)(new Bitmap(imgToResize, size));
        }

        private Image SaveByteArrayAsImage(string base64String)
        {
            byte[] bytes = Convert.FromBase64String(base64String);

            Image image;
            using (MemoryStream ms = new MemoryStream(bytes))
            {
                image = Image.FromStream(ms);
                image = ResizeImage(image, new Size(150, 30));
            }

            return image;
        }

        private string ImageToBase64(Image image, System.Drawing.Imaging.ImageFormat format)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                // Convert Image to byte[]
                image.Save(ms, format);
                byte[] imageBytes = ms.ToArray();

                // Convert byte[] to Base64 String
                string base64String = Convert.ToBase64String(imageBytes);
                return base64String;
            }
        }

        public JsonResult GetProductRest(List<int> productIds, int storeId)
        {
            KeyValuePair<int, double> rest = GetProductRestOriginalWithOrder(productIds, storeId, DateTime.Now).FirstOrDefault();

            return Json(new { productId = rest.Key, quantity = rest.Value });
        }

        public Dictionary<int, double> GetProductRestOriginalWithOrder(List<int> product_ids, int store_id, DateTime toDate)
        {
            return finaLogic.GetProductRestOriginalWithOrder(product_ids, store_id, toDate, ConfigurationManager.ConnectionStrings["FinaDbContext"].ConnectionString);
        } //-

        

        #region FINA Products Realization and Cancel
        public bool IsCompanyVat(DateTime date)
        {
            return finaLogic.IsCompanyVat(date);
        } //+

        public bool SaveEntriesFast(int general_id)
        {
            return finaLogic.SaveEntriesFast(general_id);
        } //+

        public bool SaveEntriesFastCancel(int general_id)
        {
            return finaLogic.SaveEntriesFastCancel(general_id);
        } //+

        //selfcost
        private Dictionary<int, double> GetProductSelfCostAverage(Dictionary<int, double> IdList, DateTime ActionDate)
        {
            return finaLogic.GetProductSelfCostAverage(IdList, ActionDate);
        } //+
        //---

        private int FinaRealization(int general_id, int? contragentId, double? amount, int? storeId, int staffId, double? quantity, int productId, int? unitId, int? rsSaleType)
        {
            return finaLogic.FinaRealization(general_id, contragentId, amount, storeId, staffId, quantity, productId, unitId, rsSaleType, User.Identity.Name);
        } //+

        private int FinaProductCancel(int general_id, int? storeId, int staffId, double? quantity, int productId, int? unitId)
        {
            return finaLogic.FinaProductCancel(general_id, storeId, staffId, quantity, productId, unitId, User.Identity.Name);
        } //+

        public bool DeleteEntries(int general_id)
        {
            return finaLogic.DeleteEntries(general_id);
        } //+
        #endregion



        #region FINA Provided Services
        private int FinaProvideService(int general_id, int? contragentId, double? amount, int? storeId, int staffId, double? quantity, int productId, int? unitId)
        {
            return finaLogic.FinaProvideService(general_id, contragentId, amount, storeId, staffId, quantity, productId, unitId, User.Identity.Name);
        } //+
        #endregion
    }
}