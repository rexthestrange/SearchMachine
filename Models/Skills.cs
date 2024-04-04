namespace SearchMachine.Models {

	public class SkillsModel : BaseModel, IBaseModel {
		public string job_id { get; set; } = String.Empty;
		public string skill { get; set; } = String.Empty;
	}

	public class JobSkillsModel : BaseModel, IBaseModel { 
		public Guid job_id { get; set; }
		public Guid skill_id { get; set; }
	}

    public class  UserSkillsModel : BaseModel, IBaseModel {
		public Guid user_id { get; set; }
		public Guid skill_id { get; set; }
		public string skill { get; set; } = String.Empty;
		public bool? active { get; set; }
	}

}
