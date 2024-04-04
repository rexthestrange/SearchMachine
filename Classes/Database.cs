using SearchMachine.Models;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Reflection;

namespace SearchMachine.Classes {

	public class Database {

		private const string connection_string = "Data Source=BURNIE; Initial Catalog=SearchMachine; User ID=rex; Password=rex1";

		private DbContext context = new (connection_string);


		public List<Model>? ExecuteProcedure<Model> (string query, Object parameters) {
			List<SqlParameter>? sql_parameters = null;
			string query_string = String.Empty;
			foreach (PropertyInfo property in parameters.GetType ().GetProperties ()) {
				object value = property.GetValue (parameters);
				if (property.Name == "id") continue;
				if (query_string != String.Empty) query_string += ",";
				sql_parameters ??= new ();
				sql_parameters.Add (new SqlParameter { ParameterName = $"@{property.Name}", Value = (value == null) ? DBNull.Value : value });
				query_string += $" @{property.Name}";
			}

			return context.Database.SqlQuery<Model> ($"{query}{query_string}", sql_parameters?.ToArray ()).ToList ();
		}

		public Guid? ExecuteProcedureGetId (string query, Object parameters) {
			List<BaseModel>? result = ExecuteProcedure<BaseModel> (query, parameters);
			return ((result != null) && (result.Count > 0)) ? result [0].id : null;
		}

		public void ExecuteProcedureSetId<Model> (string query, IBaseModel parameters) {
			Guid? result = ExecuteProcedureGetId (query, parameters);
			parameters.id = result;
		}

		public Model? ExecuteProcedureGetRow<Model> (string query, Object parameters) {
			List<Model>? result = ExecuteProcedure<Model> (query, parameters);
			return ((result != null) && (result.Count > 0)) ? result[0] : default (Model);
		}

		public List<Model> ExecuteQuery<Model> (string query) {
			return context.Database.SqlQuery<Model> (query).ToList ();
		}

		public Model? ExecuteQueryGetRow<Model> (string query) {
			List<Model>? result = ExecuteQuery<Model> (query);
			return ((result != null) && (result.Count > 0)) ? result[0] : default (Model);
		}


	}// Database;

}// namespace;