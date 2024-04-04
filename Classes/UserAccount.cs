using SearchMachine.Models;
using System.Text;
using System.Text.Json;

namespace SearchMachine.Classes {
	public class UserAccount {

		public static readonly Guid USER_ID = new Guid ("89458391-2600-40E8-B622-CEB6406D28B6");

		HttpContext context;

		public UserAccountModel? Current { 
			get { 
				String? account_string = context.Session.GetString ("user_account");
				return (account_string == null) ? null : JsonSerializer.Deserialize<UserAccountModel> (account_string); 
			} 
		}

		public UserAccount (HttpContext context) {
			this.context = context;
		}

	}
}
