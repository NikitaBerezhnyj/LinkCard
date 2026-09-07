using LinkCard.Common.Exceptions;

namespace LinkCard.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            var (statusCode, payload) = ex switch
            {
                NotFoundException => (StatusCodes.Status404NotFound, (object)new { message = ex.Message }),
                ConflictException => (StatusCodes.Status409Conflict, new { message = ex.Message }),
                ForbiddenException => (StatusCodes.Status403Forbidden, new { message = ex.Message }),
                UnauthorizedException => (StatusCodes.Status401Unauthorized, new { message = ex.Message }),
                BadRequestException => (StatusCodes.Status400BadRequest, new { message = ex.Message }),
                ValidationException validationEx =>
                    (StatusCodes.Status400BadRequest, new { message = ex.Message, errors = validationEx.Errors }),
                _ => (StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." })
            };

            if (statusCode == StatusCodes.Status500InternalServerError)
                logger.LogError(ex, "Unhandled exception");

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;
            await context.Response.WriteAsJsonAsync(payload);
        }
    }
}