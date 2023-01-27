using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Yehan",
                    Email = "yehan@gmail.com",
                    UserName = "Yehan",
                    Address = new Address
                    {
                        FirstName = "Yehan",
                        LastName = "Yeshminda",
                        Street = "Hikkaduwa, Pathana",
                        City = "Galle",
                        State = "Colombo",
                        ZipCode = "80240",
                    }
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}