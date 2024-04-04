using Microsoft.AspNetCore.Mvc.Razor;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages ();
builder.Services.AddControllers ();
builder.Services.AddSession ();
builder.Services.AddDistributedMemoryCache ();

builder.Services.Configure<RazorViewEngineOptions> (option => {
	option.ViewLocationFormats.Add ("/Views/{0}" + RazorViewEngine.ViewExtension);
});

WebApplication app = builder.Build();

if (!app.Environment.IsDevelopment ()) {
	app.UseExceptionHandler ("/Error");
	app.UseHsts ();
}

app.UseHttpsRedirection ();
app.UseStaticFiles ();

app.UseRouting ();
app.UseSession ();

app.UseAuthorization ();

app.MapRazorPages ();

app.MapControllers ();

app.Run ();
