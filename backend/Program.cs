using backend.Data;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Amazon.S3;
using Amazon;
using DotNetEnv;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ICodeGenerator, CodeGenerator>();

builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY")
        ?? throw new Exception("AWS_ACCESS_KEY is missing.");

    var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_KEY")
        ?? throw new Exception("AWS_SECRET_KEY is missing.");

    var region = Environment.GetEnvironmentVariable("AWS_REGION")
        ?? throw new Exception("AWS_REGION is missing.");

    return new AmazonS3Client(
        accessKey,
        secretKey,
        RegionEndpoint.GetBySystemName(region)
    );
});

builder.Services.AddScoped<IS3Service, S3Service>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Run();