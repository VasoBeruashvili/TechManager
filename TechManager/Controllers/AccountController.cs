using System;
using System.Web.Mvc;
using System.Web.Security;

namespace TechManager.Controllers
{
    [AllowAnonymous]
    public class AccountController : Controller
    {
        // GET: /Login/

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Login()
        {
            ViewBag.message = "";
            return View("Index");
        }

        [HttpPost]
        public ActionResult Login(string code, string password, string returnUrl)
        {
            returnUrl = "/Home/Equipments";

            MyMembershipProvider myMembershipProvider = new MyMembershipProvider();
            if (myMembershipProvider.ValidateUser(code, password))
            {
                FormsAuthentication.SetAuthCookie(code, false);

                if (!string.IsNullOrEmpty(returnUrl))
                {
                    dynamic userType = Session["IsAdmin"];
                    if (userType != null && userType.x)
                    {
                        returnUrl = "/Home/Equipments";
                    }
                    else if (userType != null && !userType.x)
                    {
                        returnUrl = "/Home/Visits";
                    }
                    else if (userType == null)
                    {
                        returnUrl = "/Account/Index";
                    }

                    return Redirect(returnUrl);
                }
                else return RedirectToAction("Index", "Account");
            }
            else
            {
                ViewBag.ValidateUserMessage = "სახელი ან პაროლი არასწორია!";
                return View("Index");
            }
        }

        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Account");
        }
    }
}