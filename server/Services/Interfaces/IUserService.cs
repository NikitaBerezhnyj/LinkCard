using LinkCard.DTOs.Users.Requests;
using LinkCard.DTOs.Users.Responses;

namespace LinkCard.Services.Interfaces;

public interface IUserService
{
    Task<UserResponse> GetByUsernameAsync(string username);
    Task<UserResponse> UpdateAsync(Guid userId, UpdateUserRequest request);
    Task DeleteAsync(Guid userId);
}