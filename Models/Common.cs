using static SearchMachine.Extensions.StringExtensions;
using SearchMachine.Classes;

namespace SearchMachine.Models {

	public class PageModel {
        public UserAccountModel? user { get; set; } = null;
    }


	public class  HomepageModel : PageModel {}


	public class UserAccountModel {
		public Guid Id { get; set; }
		public string FirstName { get; set; } = String.Empty;
		public string LastName { get; set; } = String.Empty;
		public string? Email { get; set; }
		public string? Phone { get; set; }

		public string DisplayName { get => String.Concat (FirstName, Space, LastName).Trim ().ToTitleCase (); }
	}

}