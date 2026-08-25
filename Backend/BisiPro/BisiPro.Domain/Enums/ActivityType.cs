using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Domain.Enums
{
    public enum ActivityType
    {
        UserRegistered = 1,
        GroupCreated = 2,
        MemberJoined = 3,
        MemberRemoved = 4,
        GroupUpdated = 5,
        GroupClosed = 6,
        KycCompleted = 7,
        KycRejected = 8,
        PaymentReceived = 9,
        PaymentFailed = 10,
        BisiStarted = 11,
        BisiCompleted = 12,
        ResetPassword = 13
    }
}
