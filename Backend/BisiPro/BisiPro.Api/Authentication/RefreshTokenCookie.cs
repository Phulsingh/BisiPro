namespace BisiPro.Api.Authentication
{
    /// <summary>
    /// The refresh token is carried in an HttpOnly cookie instead of the
    /// response body, so browser JavaScript can never read it. Only the browser
    /// stores it, and it is sent back solely to the endpoints under
    /// <see cref="CookiePath"/>.
    /// </summary>
    public static class RefreshTokenCookie
    {
        public const string Name = "BisiPro.RefreshToken";

        /// <summary>
        /// Limits the cookie to the auth endpoints, so it never rides along
        /// with ordinary API calls that have no use for it.
        /// </summary>
        private const string CookiePath = "/api/auth";

        /// <summary>
        /// Must match the refresh token lifetime used when the token is created.
        /// </summary>
        private static readonly TimeSpan Lifetime = TimeSpan.FromDays(7);

        public static void Write(
            HttpResponse response,
            string refreshToken)
        {
            response.Cookies.Append(
                Name,
                refreshToken,
                BuildOptions(DateTimeOffset.UtcNow.Add(Lifetime)));
        }

        public static string? Read(HttpRequest request)
        {
            var found = request.Cookies.TryGetValue(
                Name,
                out var refreshToken);

            if (!found || string.IsNullOrWhiteSpace(refreshToken))
            {
                return null;
            }

            return refreshToken;
        }

        public static void Delete(HttpResponse response)
        {
            // The browser only drops a cookie when the delete carries the same
            // Path, Secure and SameSite attributes it was written with.
            response.Cookies.Delete(
                Name,
                BuildOptions(DateTimeOffset.UnixEpoch));
        }

        private static CookieOptions BuildOptions(
            DateTimeOffset expiresAt)
        {
            return new CookieOptions
            {
                // Keeps document.cookie and any injected script from reading it.
                HttpOnly = true,

                // Required by SameSite=None, and keeps the token off plain HTTP.
                Secure = true,

                // The SPA and the API are different origins, so the cookie has
                // to survive cross-site requests.
                SameSite = SameSiteMode.None,

                Path = CookiePath,

                Expires = expiresAt,

                // Authentication cookie: exempt from cookie consent policy.
                IsEssential = true
            };
        }
    }
}
