namespace OCSBBS.Core.Enums
{
    public enum UserFilter
    {
        All,
        Active,           // not a member of the "inactive" role
        Inactive,        // member of "inactive" role (regardless of other roles)
        Employees,        // member of "employee" or "admin" role (active + inactive)
        LawFirm,          // member of "law firm" role (active only)
        FinancialAssurance // member of "financial assurance" role (active only)
    }
}

