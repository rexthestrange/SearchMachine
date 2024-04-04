using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Text.Encodings.Web;

namespace SearchMachine.Helpers {

	[HtmlTargetElement ("number-input")]
	public class NumberSelectorTagHelper : TagHelper {

		private IHtmlHelper html_helper;

		[ViewContext]
		[HtmlAttributeNotBound]
		public ViewContext ViewContext { get; set; }

		public string id { get; set; }
		public string name { get; set; }
		public int min { get; set; }
		public int max { get; set; }
		public int defaultValue { get; set; } = 50;


		public override async void Process (TagHelperContext context, TagHelperOutput output) {
			(html_helper as IViewContextAware).Contextualize (ViewContext);
			output.Content.SetHtmlContent (await html_helper.PartialAsync ("~/Helpers/Partials/NumberSelector.cshtml", this));
			output.TagName = null;
		}

		public NumberSelectorTagHelper (IHtmlHelper helper, HtmlEncoder encoder) => html_helper = helper;

	}// NumberSelectorTagHelper;

}// namespace;
