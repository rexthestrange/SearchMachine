using SearchMachine.Extensions;
using System.Net;
using System.Net.Mail;

namespace SearchMachine.Classes {

	public class MessageStatus {
		public bool success { get; set; }
		public string message { get; set; } = String.Empty;
	}

	public class Messages {

		public const string SENDER = "SearchMachine@rogerlmain.com";
		public const string CLIENT = "mail.rogerlmain.com";

		public const string USERNAME = "SearchMachine@rogerlmain.com";
		public const string PASSWORD = "MyPassword-123";

		public static MessageStatus SendSMS (string text, string phone_number) {

			MailMessage message = new ();

			message.From = new MailAddress (SENDER);
			message.To.Add (new MailAddress ($"{phone_number.Strip ()}@vtext.com"));
			message.Body = text;

			var client = new SmtpClient (CLIENT) {
				Port = 587,
				Credentials = new NetworkCredential (USERNAME, PASSWORD),
				EnableSsl = true
			};

			client.UseDefaultCredentials = false;

			try {
				client.Send (message);
			} catch (Exception except) {
				return new MessageStatus () {
					success = false,
					message = except.Message
				};
			}

			return new MessageStatus () {
				success = true,
				message = "sent"
			};

		}// SendSMS

		public static MessageStatus SendEmail (string subject, string body, string recipient) {

			MailMessage message = new ();
			message.From = new MailAddress (SENDER);

			message.To.Add (new MailAddress (recipient));

			message.Subject = subject;
			message.Body = body;

			var client = new SmtpClient (CLIENT) {
				Port = 587,
				Credentials = new NetworkCredential (USERNAME, PASSWORD),
				EnableSsl = true
			};

			client.UseDefaultCredentials = false;

			try {
				client.Send (message);
			} catch (Exception except) {
				return new MessageStatus () {
					success = false,
					message = except.Message
				};
			}

			return new MessageStatus () {
				success = true,
				message = "sent"
			};

		}// SendSMS

	}// Messages;

}// namespace;
