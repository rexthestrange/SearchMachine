using SearchMachine.Classes;
using SearchMachine.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;

namespace SearchMachine.Controllers {

	public class Home : Controller {


		private async Task<string> ReadTextData () {
			using (StreamReader reader = new StreamReader (Request.Body, Encoding.UTF8)) {
				return await reader.ReadToEndAsync ();
			}
		}


		public static bool FileLocked (string filename) {
			try {
				using (FileStream inputStream = System.IO.File.Open (filename, FileMode.Open, FileAccess.Read, FileShare.None)) return inputStream.Length <= 0;
			} catch (Exception) {
				return true;
			}
		}


		public IActionResult DefaultHomePage () {
			string? user_id_string = HttpContext.Request.Form?["user_id"];
			Guid? user_id = (user_id_string == null) ? null : Guid.Parse (user_id_string);
			UserAccountModel? user_account = (user_id == null) ? null : new UserAccounts ().GetUserById (user_id.Value);

			if (user_account == null) {
				// throw error
				return new JsonResult (new { error = "Cannot find user" });
			}

			HttpContext.Session.SetString ("user_account", JsonSerializer.Serialize (user_account));
			return View ("Home", new HomepageModel ());
		}


		public void WriteReport (string report) {

			bool file_locked = true;
			string filename = "D:/Projects/DotNet/SearchMachine/Application/Log/SearchMachine.txt";

  			while (file_locked) {
				try {
					StreamWriter writer = new (filename, true);
					writer.WriteLine (report);
					writer.Close ();
					file_locked = false;
				} catch {
					file_locked = true;
				}
			}
		}


		[Route ("Home")]
		public IActionResult HomePage () {
			if (HttpContext.Request.HasFormContentType) return DefaultHomePage ();
			UserAccountModel? user_account = new UserAccount (HttpContext).Current;

			if (user_account == null) {
				// throw error
				return new JsonResult (new { error = "Cannot find user" });
			}

			return View ("Home", new HomepageModel () { user = user_account });
		}


		[Route ("Report")]
		[HttpPost]
		public async Task<IActionResult> ReportProgress () {
			WriteReport (await ReadTextData ());
			return new JsonResult (new { });
		}


		[Route ("/")]
		public IActionResult Index () {
			WriteReport ($"\r\n{DateTime.Now.ToString ()}");
			return View ("Home");
		}


	}
}
