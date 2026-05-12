using OCSBBS.Core.DTOs.Cms;

namespace OCSBBS.Core.Interfaces.Cms
{
    public interface IClientService : ICmsService<ClientDto, CreateClientDto, UpdateClientDto>
    {
        Task ReorderAsync(List<int> orderedIds);
    }
}