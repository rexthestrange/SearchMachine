using System.Globalization;

namespace SearchMachine.Extensions {

	public static class StringConstants {
		public const string Space = " ";
	}


	public static class StringExtensions {

		public const char Space = ' ';

		public static String Strip (this string value) => value.Trim ().Replace (Space.ToString (), String.Empty);

		public static bool Matches (this string value, string candidate) => value.ToLower ().Trim () == candidate.ToLower ().Trim ();

		public static string ToTitleCase (this string value) => new CultureInfo ("en-US", false).TextInfo.ToTitleCase (value);

	}

}