using System.Text;
using Amazon.S3;
using LinkCard.Entities;
using LinkCard.Middleware;
using LinkCard.Options;
using LinkCard.Services;
using LinkCard.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

DotNetEnv.Env.Load(Path.Combine(Directory.GetCurrentDirectory(), "..", ".env"));

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration["DB_HOST"] is not null
    ? $"Host={builder.Configuration["DB_HOST"]};" +
      $"Port={builder.Configuration["DB_PORT"]};" +
      $"Database={builder.Configuration["DB_NAME"]};" +
      $"Username={builder.Configuration["DB_USERNAME"]};" +
      $"Password={builder.Configuration["DB_PASSWORD"]}"
    : builder.Configuration.GetConnectionString("Default");

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

var jwtOptions = new JwtOptions
{
    Secret = builder.Configuration["JWT_SECRET"]
        ?? throw new InvalidOperationException("JWT_SECRET is not configured."),
    AccessTokenMinutes = 15,
    RefreshTokenDays = 30
};
builder.Services.AddSingleton(jwtOptions);

var minioPort = builder.Configuration["MINIO_API_PORT"]
    ?? throw new InvalidOperationException(
        "MINIO_API_PORT is not configured.");

var s3Options = new S3Options
{
    AccessKey = builder.Configuration["MINIO_ROOT_USER"]
        ?? throw new InvalidOperationException(
            "MINIO_ROOT_USER is not configured."),

    SecretKey = builder.Configuration["MINIO_ROOT_PASSWORD"]
        ?? throw new InvalidOperationException(
            "MINIO_ROOT_PASSWORD is not configured."),

    BucketName = builder.Configuration["MINIO_BUCKET"]
        ?? throw new InvalidOperationException(
            "MINIO_BUCKET is not configured."),

    Endpoint = $"http://minio:{minioPort}",

    PublicBaseUrl = builder.Configuration["MINIO_PUBLIC_BASE_URL"]
        ?? throw new InvalidOperationException(
            "MINIO_PUBLIC_BASE_URL is not configured.")
};

builder.Services.AddSingleton(s3Options);
builder.Services.AddSingleton(s3Options);

builder.Services.AddSingleton<IAmazonS3>(_ =>
{
    var config = new AmazonS3Config
    {
        RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(s3Options.Region)
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
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    })
    .AddRoles<IdentityRole<Guid>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        var origin = builder.Configuration["ORIGIN_WEBSITE"];
        if (!string.IsNullOrEmpty(origin))
            policy.WithOrigins(origin).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IFileStorage, S3FileStorage>();
builder.Services.AddScoped<IMediaUrlService, MediaUrlService>();
builder.Services.AddScoped<IImageProcessor, ImageSharpProcessor>();
builder.Services.AddScoped<IUploadService, UploadService>();

builder.Services.AddHostedService<S3BucketInitializer>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));

builder.Services.AddOpenApi();
builder.Services.AddHealthChecks().AddNpgSql(connectionString!);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "LinkCard API v1"));
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/healthcheck");

app.Run();