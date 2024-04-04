using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Text.Encodings.Web;

namespace SearchMachine.Helpers {

	[HtmlTargetElement ("file-control")]
	public class FileControlTagHelper : TagHelper {

		private IHtmlHelper html_helper;

		[ViewContext]
		[HtmlAttributeNotBound]
		public ViewContext ViewContext { get; set; }

		public string id { get; set; }
		public string name { get; set; }

		public override async void Process (TagHelperContext context, TagHelperOutput output) {
			(html_helper as IViewContextAware).Contextualize (ViewContext);
			output.Content.SetHtmlContent (await html_helper.PartialAsync ("~/Helpers/Partials/FileControl.cshtml", this));
			output.TagName = null;
		}

		public FileControlTagHelper (IHtmlHelper helper, HtmlEncoder encoder) => html_helper = helper;

	}// PopupTagHelper;

}// namespace;
