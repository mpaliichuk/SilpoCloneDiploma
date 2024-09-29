using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("OcelotJson.json", false, true).AddEnvironmentVariables();
builder.Services.AddOcelot(builder.Configuration);
builder.Services.AddCors();

var app = builder.Build();

app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseOcelot();
app.Run();
