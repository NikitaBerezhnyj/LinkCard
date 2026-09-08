using System.Text;
using Amazon.S3;
using FluentValidation;
using LinkCard.Configuration;
using LinkCard.Entities;
using LinkCard.Filters;
using LinkCard.Middleware;
using LinkCard.Options;
using LinkCard.Services;
using LinkCard.Services.Interfaces;
using Mapster;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

DotNetEnv.Env.Load(
    Path.Combine(Directory.GetCurrentDirectory(), "..", ".env"));

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

var connectionString = configuration["DB_HOST"] is not null
    ? $"Host={configuration["DB_HOST"]};" +
      $"Port={configuration["DB_PORT"]};" +
      $"Database={configuration["DB_NAME"]};" +
      $"Username={configuration["DB_USERNAME"]};" +
      $"Password={configuration["DB_PASSWORD"]}"
    : configuration.GetConnectionString("Default");

var jwtOptions = new JwtOptions
{
    Secret = configuration["JWT_SECRET"]
        ?? throw new InvalidOperationException(
            "JWT_SECRET is not configured."),

    AccessTokenMinutes = 15,
    RefreshTokenDays = 30
};

var emailOptions = new EmailOptions
{
    Host = configuration["SMTP_HOST"]
        ?? throw new InvalidOperationException(
            "SMTP_HOST is not configured."),

    Port = int.Parse(
        configuration["SMTP_PORT"]
            ?? throw new InvalidOperationException(
                "SMTP_PORT is not configured.")),

    Email = configuration["SMTP_EMAIL"]
        ?? throw new InvalidOperationException(
            "SMTP_EMAIL is not configured."),

    Password = configuration["SMTP_PASSWORD"],

    PasswordResetUrl =
        $"{configuration["ORIGIN_WEBSITE"]}/reset-password"
};

var minioPort = configuration["MINIO_API_PORT"]
    ?? throw new InvalidOperationException(
        "MINIO_API_PORT is not configured.");

var s3Options = new S3Options
{
    AccessKey = configuration["MINIO_ROOT_USER"]
        ?? throw new InvalidOperationException(
            "MINIO_ROOT_USER is not configured."),

    SecretKey = configuration["MINIO_ROOT_PASSWORD"]
        ?? throw new InvalidOperationException(
            "MINIO_ROOT_PASSWORD is not configured."),

    BucketName = configuration["MINIO_BUCKET"]
        ?? throw new InvalidOperationException(
            "MINIO_BUCKET is not configured."),

    Endpoint = $"http://minio:{minioPort}",

    PublicBaseUrl = configuration["MINIO_PUBLIC_BASE_URL"]
        ?? throw new InvalidOperationException(
            "MINIO_PUBLIC_BASE_URL is not configured.")
};

MappingConfiguration.Register(TypeAdapterConfig.GlobalSettings);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.Password.RequiredLength = 8;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireDigit = true;

        options.User.RequireUniqueEmail = true;

        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.DefaultLockoutTimeSpan =
            TimeSpan.FromMinutes(15);
    })
    .AddRoles<IdentityRole<Guid>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();

builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
{
    options.TokenLifespan = TimeSpan.FromHours(1);
});

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtOptions.Secret)),

            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddSingleton(jwtOptions);
builder.Services.AddSingleton(emailOptions);
builder.Services.AddSingleton(s3Options);

builder.Services.AddSingleton<IAmazonS3>(_ =>
{
    var config = new AmazonS3Config
    {
        RegionEndpoint =
            Amazon.RegionEndpoint.GetBySystemName(s3Options.Region)
    };

    if (!string.IsNullOrEmpty(s3Options.Endpoint))
    {
        config.ServiceURL = s3Options.Endpoint;
        config.ForcePathStyle = true;
    }

    return new AmazonS3Client(
        s3Options.AccessKey,
        s3Options.SecretKey,
        config);
});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IEmailSender, SmtpEmailSender>();

builder.Services.AddScoped<IFileStorage, S3FileStorage>();
builder.Services.AddScoped<IMediaUrlService, MediaUrlService>();
builder.Services.AddScoped<IImageProcessor, ImageSharpProcessor>();
builder.Services.AddScoped<IUploadService, UploadService>();

builder.Services.AddHostedService<S3BucketInitializer>();

builder.Services.AddValidatorsFromAssemblyContaining<Program>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        var origin = configuration["ORIGIN_WEBSITE"];

        if (!string.IsNullOrEmpty(origin))
        {
            policy
                .WithOrigins(origin)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    });
});

builder.Services
    .AddControllers(options =>
    {
        options.Filters.Add<ValidationFilter>();
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddOpenApi();
builder.Services
    .AddHealthChecks()
    .AddNpgSql(connectionString!);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(
        options => options.SwaggerEndpoint(
            "/openapi/v1.json",
            "LinkCard API v1"));
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/healthcheck");

app.Run();