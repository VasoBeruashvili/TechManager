using FinaPart;
using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using TechManager.Accounts;
using TechManager.Enums;
using TechManager.Utils;

public class MyAuthorizeAttribute : AuthorizeAttribute
{
    protected override bool AuthorizeCore(HttpContextBase httpContext)//for role action mapping
    {

        return base.AuthorizeCore(httpContext);
    }
}


public class MyRoleProvider : RoleProvider
{
    public override void AddUsersToRoles(string[] usernames, string[] roleNames)
    {
        throw new NotImplementedException();
    }

    public override string ApplicationName
    {
        get
        {
            throw new NotImplementedException();
        }
        set
        {
            throw new NotImplementedException();
        }
    }

    public override void CreateRole(string roleName)
    {
        throw new NotImplementedException();
    }

    public override bool DeleteRole(string roleName, bool throwOnPopulatedRole)
    {
        throw new NotImplementedException();
    }

    public override string[] FindUsersInRole(string roleName, string usernameToMatch)
    {
        throw new NotImplementedException();
    }

    public override string[] GetAllRoles()
    {
        throw new NotImplementedException();
    }

    public override string[] GetRolesForUser(string username)
    {
        //using (var contxt = new SISEntities())
        //{
        //    var user = contxt.Users
        //        .Where(u => u.UserName == username).ToList()
        //        .Where(uu => String.Compare(uu.UserName, username, false) == 0);

        //    List<string> l = new List<string>();




        //    return l.ToArray();
        //}

        throw new NotImplementedException();

        //TODO implemet

    }

    public override string[] GetUsersInRole(string roleName)
    {
        throw new NotImplementedException();
    }

    public override bool IsUserInRole(string username, string roleName)
    {
        throw new NotImplementedException();

        //TODO implement


    }

    public override void RemoveUsersFromRoles(string[] usernames, string[] roleNames)
    {
        throw new NotImplementedException();
    }

    public override bool RoleExists(string roleName)
    {
        throw new NotImplementedException();
    }
}





public class MyMembershipProvider : MembershipProvider
{

    public override string ApplicationName
    {
        get
        {
            throw new NotImplementedException();
        }
        set
        {
            throw new NotImplementedException();
        }
    }

    public override bool ChangePassword(string username, string oldPassword, string newPassword)
    {
        throw new NotImplementedException();
    }

    public override bool ChangePasswordQuestionAndAnswer(string username, string password, string newPasswordQuestion, string newPasswordAnswer)
    {
        throw new NotImplementedException();
    }

    public override MembershipUser CreateUser(string username, string password, string email, string passwordQuestion, string passwordAnswer, bool isApproved, object providerUserKey, out MembershipCreateStatus status)
    {
        throw new NotImplementedException();
    }

    public override bool DeleteUser(string username, bool deleteAllRelatedData)
    {
        throw new NotImplementedException();
    }

    public override bool EnablePasswordReset
    {
        get { throw new NotImplementedException(); }
    }

    public override bool EnablePasswordRetrieval
    {
        get { throw new NotImplementedException(); }
    }

    public override MembershipUserCollection FindUsersByEmail(string emailToMatch, int pageIndex, int pageSize, out int totalRecords)
    {
        throw new NotImplementedException();
    }

    public override MembershipUserCollection FindUsersByName(string usernameToMatch, int pageIndex, int pageSize, out int totalRecords)
    {
        throw new NotImplementedException();
    }

    public override MembershipUserCollection GetAllUsers(int pageIndex, int pageSize, out int totalRecords)
    {
        throw new NotImplementedException();
    }

    public override int GetNumberOfUsersOnline()
    {
        throw new NotImplementedException();
    }

    public override string GetPassword(string username, string answer)
    {
        throw new NotImplementedException();
    }

    public override MembershipUser GetUser(string username, bool userIsOnline)
    {
        throw new NotImplementedException();
    }

    public override MembershipUser GetUser(object providerUserKey, bool userIsOnline)
    {
        throw new NotImplementedException();
    }

    public override string GetUserNameByEmail(string email)
    {
        throw new NotImplementedException();
    }

    public override int MaxInvalidPasswordAttempts
    {
        get { throw new NotImplementedException(); }
    }

    public override int MinRequiredNonAlphanumericCharacters
    {
        get { throw new NotImplementedException(); }
    }

    public override int MinRequiredPasswordLength
    {
        get { throw new NotImplementedException(); }
    }

    public override int PasswordAttemptWindow
    {
        get { throw new NotImplementedException(); }
    }

    public override MembershipPasswordFormat PasswordFormat
    {
        get { throw new NotImplementedException(); }
    }

    public override string PasswordStrengthRegularExpression
    {
        get { throw new NotImplementedException(); }
    }

    public override bool RequiresQuestionAndAnswer
    {
        get { throw new NotImplementedException(); }
    }

    public override bool RequiresUniqueEmail
    {
        get { throw new NotImplementedException(); }
    }

    public override string ResetPassword(string username, string answer)
    {
        throw new NotImplementedException();
    }

    public override bool UnlockUser(string userName)
    {
        throw new NotImplementedException();
    }

    public override void UpdateUser(MembershipUser user)
    {
        throw new NotImplementedException();
    }

    public override bool ValidateUser(string code, string password)
    {
        FinaLogic finaLogic = new FinaLogic();

        bool result = false;

        if (code != string.Empty && password != string.Empty)
        {
            using (var _db = new FinaContext())
            {
                string _code = finaLogic.GetCompany().Code;
                if (_code.Length == 9) _code = _code + "00";
                string encrypted_password = FinaKeyGenerator.Encrypt(_code + password);
                var _user = finaLogic.GetUsers().Where(u => u.login == code && u.password == encrypted_password).FirstOrDefault();
                if (_user != null)
                {
                    FinaUser user = new FinaUser
                    {
                        Login = _user.login,
                        GroupID = _user.group_id
                    };
                    result = user != null;

                    if(user.GroupID == (int)EnumUserGroups.Admin)
                    {
                        if (HttpContext.Current.Session.Count == 0)
                        {
                            HttpContext.Current.Session.Add("IsAdmin", new { x = true });
                        }
                        else
                        {
                            HttpContext.Current.Session["IsAdmin"] = new { x = true };
                        }
                    }
                    else if(user.GroupID == (int)EnumUserGroups.Engineer)
                    {
                        if (HttpContext.Current.Session.Count == 0)
                        {
                            HttpContext.Current.Session.Add("IsAdmin", new { x = false });
                        }
                        else
                        {
                            HttpContext.Current.Session["IsAdmin"] = new { x = false };
                        }
                    }
                }
            }
        }

        return result;
    }
}