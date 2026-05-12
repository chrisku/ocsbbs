namespace OCSBBS.Core.DTOs.Cms
{
    public class ClientDto
    {
        public int Id { get; set; }
        public string? Website { get; set; }
        public required string BusinessName { get; set; }
        public string? Logo { get; set; }
        public string? AltTag { get; set; }
        public int ClientOrder { get; set; }
        public string? Comments { get; set; }
    }

    public class ClientFormDto
    {
        public string? Website { get; set; } = string.Empty;
        public required string BusinessName { get; set; } = string.Empty;
        public string? Logo { get; set; } = string.Empty;
        public string? AltTag { get; set; } = string.Empty;
        public int ClientOrder { get; set; }
        public string? Comments { get; set; } = string.Empty;
    }

    public class CreateClientDto : ClientFormDto { }
    public class UpdateClientDto : ClientFormDto { }

}