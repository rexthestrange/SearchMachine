using Microsoft.AspNetCore.Mvc;
using SearchMachine.Classes;
using SearchMachine.Extensions;
using SearchMachine.Models;
using System.Text;
using System.Text.Json;

namespace SearchMachine.Controllers {

	public class AccountsController : Controller {

		private JsonResult InvalidActivationCode () => new JsonResult (new { 
			success = false,
			message = "Invalid activation code"
		});

		[HttpPost]
		[Route ("/Accounts/Return")]
		public IActionResult ReturningUser ([FromBody] dynamic parameters) {
			
		Guid user_id = new Guid (parameters.GetProperty ("user_id").ToString ());
			UserAccountModel? user_account = new UserAccounts ().GetUserById (user_id);
			HttpContext.Session.SetString ("user_account", JsonSerializer.Serialize (user_account));
			return new JsonResult (new { success = user_account != null });
		}

		[HttpPost]
		[Route ("/Accounts/Login")]
		public IActionResult CreateLogin ([FromBody] dynamic parameters) {

			string email_address = parameters.GetProperty ("email_address").ToString ();

			UserAccountModel? account = new UserAccounts ().GetUserByEmail (email_address);

			if (account == null) return new JsonResult (new {
				success = false,
				message = "This is not a registered email address."
			});

			string activation_code = new Random ().Next (100000, 999999).ToString ();
			HttpContext.Session.SetString ("validation_code", activation_code);
			HttpContext.Session.SetString ("user_account", JsonSerializer.Serialize (account));

			Messages.SendSMS ($"Your activation code is {activation_code}", "720 322 5154");
			//Messages.SendEmail ("Your login validation code", $"Your login validation code is {activation_code}", account.Email);

			return new JsonResult (new { success = true });
		}// CreateLogin

		[HttpPost]
		[Route ("/Accounts/Validate")]
		public IActionResult ValidateLogin ([FromBody] dynamic parameters) {

			string login_code = parameters.GetProperty ("code").ToString ();
			string? validation_code = HttpContext.Session.GetString ("validation_code");

			UserAccountModel? current_user = new UserAccount (HttpContext).Current;

			if ((validation_code == null) || (current_user?.Id == null)) return InvalidActivationCode ();

			if (validation_code.Matches (login_code)) return new JsonResult (new {
				success = true,
				user_id = current_user?.Id
			});

			return InvalidActivationCode ();

		}// ValidateLogin

	}// AccountsController;

}// namespace;