using SearchMachine.Models;

namespace SearchMachine.Classes {

	public class UserAccounts : Database {

		public UserAccountModel? GetUserByEmail (string email) => ExecuteProcedureGetRow<UserAccountModel> ("get_user_account_by_email", new { Email = email });
		public UserAccountModel? GetUserById (Guid user_id) => ExecuteProcedureGetRow<UserAccountModel> ("get_user_account_by_id", new { Id = user_id });

	}// UserAccounts;

}// namespace;
