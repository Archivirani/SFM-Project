namespace CygnuxLSP.API.Models;

public class UserLogin
{
    /// <summary>
    /// Gets or sets Username
    /// </summary>

    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets password
    /// </summary>

    public string Password { get; set; } = string.Empty;
}