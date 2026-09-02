using LinkCard.DTOs.Users;

namespace LinkCard.Services.Interfaces;

public interface IUserService
{
    Task<UserDTO> GetByUsernameAsync(string username);
    Task<UserDTO> UpdateAsync(Guid userId, UpdateUserRequest request);
    Task DeleteAsync(Guid userId);
}