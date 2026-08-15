using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.Common
{
    public class ErrorResponse : ApiResponse<object>
    {
        public ErrorResponse()
        {
            IsSuccess = false;
            Data = null;
        }

        public ErrorResponse(string error)
        {
            IsSuccess = false;
            Error = error;
            Data = null;
        }
        public ErrorResponse(string error, List<string> errors)
        {
            IsSuccess = false;
            Error = error;
            Errors = errors;
            Data = null;
        }
    }
}
