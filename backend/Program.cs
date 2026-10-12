using backend.Data;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Amazon.S3;
using Amazon;
using DotNetEnv;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        var frontendUrl = builder.Configuration["FRONTEND_URL"]
            ?? (builder.Environment.IsDevelopment()
                ? "http://localhost:5173"
                : throw new InvalidOperationException(
                    "FRONTEND_URL is missing."
                ));

        var allowedOrigins = new[]
        {
            frontendUrl,
            "http://localhost:5173",
            "https://dropitapp.tech",
            "https://www.dropitapp.tech"
        };

        policy
            .WithOrigins(allowedOrigins.Distinct().ToArray())
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Register controllers and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Configure PostgreSQL database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// Register application services
builder.Services.AddScoped<ICodeGenerator, CodeGenerator>();
builder.Services.AddScoped<IS3Service, S3Service>();

// Configure AWS S3
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

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseCors("ReactPolicy");

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// HTTPS is terminated by ngrok in this deployment setup.
// app.UseHttpsRedirection();

// Map API controllers
app.MapControllers();

app.Run();