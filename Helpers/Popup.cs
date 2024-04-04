using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Text.Encodings.Web;

namespace SearchMachine.Helpers {

	[HtmlTargetElement ("popup")]
	public class PopupTagHelper : TagHelper {

		private IHtmlHelper html_helper;

		[ViewContext]
		[HtmlAttributeNotBound]
		public ViewContext ViewContext { get; set; }

		public string id { get; set; }
		public string contents { get; set; }

		public override async void Process (TagHelperContext context, TagHelperOutput output) {
			(html_helper as IViewContextAware).Contextualize (ViewContext);
			contents = (await output.GetChildContentAsync ()).GetContent ();
			output.Content.SetHtmlContent (await html_helper.PartialAsync ("~/Helpers/Partials/Popup.cshtml", this));
			output.TagName = null;
		}

		public PopupTagHelper (IHtmlHelper helper, HtmlEncoder encoder) { 
			html_helper = helper;
		}

	}// PopupTagHelper;

}// namespace;
