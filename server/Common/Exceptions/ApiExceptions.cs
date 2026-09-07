namespace LinkCard.Common.Exceptions;

public class NotFoundException(string message) : Exception(message);

public class ConflictException(string message) : Exception(message);

public class ForbiddenException(string message) : Exception(message);

public class UnauthorizedException(string message) : Exception(message);

public class ValidationException(IEnumerable<string> errors) : Exception("Validation failed.")
{
    public IEnumerable<string> Errors { get; } = errors;
}

public class BadRequestException(string message) : Exception(message);