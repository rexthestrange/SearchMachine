namespace SearchMachine.Models {

	public interface IBaseModel {
		public Guid? id { get; set; }
	}

	public class BaseModel : IBaseModel {
		public Guid? id { get; set; } = null;
	}

}
