using Microsoft.AspNetCore.Mvc;
using SearchMachine.Classes;
using SearchMachine.Models;

namespace SearchMachine.Controllers {

	public class Jobs : Controller {

		[HttpPost]
		[Route("Job/Save")]
		public IActionResult SaveJob ([FromBody] JobsModel job) {
			JobApplicationsModel? application = new Database ().ExecuteProcedureGetRow<JobApplicationsModel> ("save_job", job);
			return new JsonResult (new { value = application });
		}// Index;


		[HttpPost]
		[Route("Jobs/Save")]
		public IActionResult SaveJobs ([FromBody] List<JobsModel> job_list) {

			int record_count = 0;
			List<JobApplicationsModel> applications = null;

			foreach (JobsModel item in job_list) {
				JobApplicationsModel? application = new Database ().ExecuteProcedureGetRow<JobApplicationsModel> ("save_job", item);
				if (application == null) continue;
				applications ??= new ();
				applications.Add (application);
				record_count++;
			}

			return new JsonResult (new {
				value = applications,
				message = $"{record_count} job{(record_count != 1 ? "s" : String.Empty)} saved." 
			});

		}// Index;


	}// Jobs;

}// namespace;
