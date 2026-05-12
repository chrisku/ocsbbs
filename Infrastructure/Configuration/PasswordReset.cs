using System;
using System.Collections.Generic;
using System.Text;

namespace OCSBBS.Infrastructure.Configuration
{
    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string ClientBaseUrl { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
