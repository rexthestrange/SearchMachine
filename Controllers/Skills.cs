using Microsoft.AspNetCore.Mvc;
using SearchMachine.Classes;
using SearchMachine.Models;

namespace SearchMachineAPI.Controllers {

	public class Skills : Controller {

		private class Skill : BaseModel { public string skill { get; set; } = String.Empty; }

		private class UserSkill {
			public Guid user_id { get; set;	}
			public Guid skill_id { get; set; }
			public bool active { get; set; }
		}


		[HttpPost]
		[Route ("Skills/Save")]
		public IActionResult Index ([FromBody] List<SkillsModel> skills_list) { 

			List<UserSkillsModel>? user_skills = null;
			Database database = new Database ();

			foreach (SkillsModel item in skills_list) {
				Guid? job_id = database.ExecuteQueryGetRow<Guid> ($"select id from jobs where site_job_id = '{item.job_id}'");

				UserSkillsModel? user_skill = database.ExecuteProcedureGetRow<UserSkillsModel> ("save_skill", new { 
					item.skill,
					user_id = UserAccount.USER_ID
				});

				if ((user_skill == null) || (job_id == null)) continue;

				JobSkillsModel job_skills = new () {
					job_id = job_id.Value,
					skill_id = user_skill.skill_id
				};

				database.ExecuteProcedureSetId<JobSkillsModel> ("save_job_skill", job_skills);

				if (user_skill == null) continue;
				user_skills ??= new ();
				user_skills.Add (user_skill);
			}

			return new JsonResult (user_skills);
		}// Index;


		[HttpPost]
		[Route ("Skills/User/Update")]
		public IActionResult? UpdateUserSkill ([FromBody] UserSkillsModel user_skill) {
			if (user_skill.active == null) return null;
			Guid? result = new Database ().ExecuteProcedureGetId ("update_user_skill", new UserSkill () {
				user_id = UserAccount.USER_ID,
				skill_id = user_skill.skill_id,
				active = user_skill.active.Value
			});
			return new JsonResult (new {
				success = (result != null),
				user_skill_id = result,
				active = user_skill.active.Value
			});
		}

	}
}
