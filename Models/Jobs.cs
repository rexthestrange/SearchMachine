namespace SearchMachine.Models {

	public class JobsModel : BaseModel, IBaseModel {

		public string site_job_id { get; set; } = String.Empty;
		public string title { get; set; } = String.Empty;
		public string company { get; set; } = String.Empty;
		public string site { get; set; } = String.Empty;

	}

	public class JobApplicationsModel : JobsModel, IBaseModel {

		public bool applied { get; set; }

	}


}
