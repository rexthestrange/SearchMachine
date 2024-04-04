using Microsoft.AspNetCore.Mvc;
using SearchMachine.Classes;

namespace SearchMachine.Controllers {

	public class Application : Controller {

		private class DatabaseApplicationModel {
			public Guid user_id { get; set; }
			public Guid job_id { get; set; }
			public byte? applied { get; set; }
		}


		public class ApplicationModel {
			public Guid job_id { get; set; }
			public bool? applied { get; set; }
		}


		[HttpPost]
		[Route ("Application/Save")]
		public IActionResult SaveApplication ([FromBody] ApplicationModel application) {
			Guid? application_id = new Database ().ExecuteProcedureGetId ("save_application", new DatabaseApplicationModel () {
				user_id = UserAccount.USER_ID,
				job_id = application.job_id,
				applied = ((application.applied == null) ? null : application.applied.Value ? (byte) 1 : (byte) 0)
			});

			if (application_id.HasValue) return new JsonResult (new {
				success = true,
				application_id
			});

			return new JsonResult (new { success = false });
		}

	}// Applications;

}// namespace;
