using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OCSBBS.Core.DTOs;
using OCSBBS.Core.DTOs.Cms;
using OCSBBS.Core.Interfaces.Cms;
using OCSBBS.Models.Cms;

namespace OCSBBS.Data.Services
{
    public class ClientService : IClientService
    {
        private readonly AppDbContext _context;

        public ClientService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ClientDto>> GetAllAsync(int page, int pageSize, string? search = null)
        {
            var query = _context.Clients.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(a =>
                    a.BusinessName.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(a => a.BusinessName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => MapToDto(a))
                .ToListAsync();

            return new PagedResult<ClientDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<ClientDto?> GetByIdAsync(int id)
        {
            var Client = await _context.Clients.FindAsync(id);
            return Client is null ? null : MapToDto(Client);
        }

        public async Task<ClientDto> CreateAsync(CreateClientDto dto)
        {
            var Client = new Client
            {
                BusinessName = dto.BusinessName,
                Website = dto.Website,
                Logo = dto.Logo,
                AltTag = dto.AltTag,
                ClientOrder = dto.ClientOrder,
                Comments = dto.Comments
            };

            _context.Clients.Add(Client);
            await _context.SaveChangesAsync();

            return MapToDto(Client);
        }

        public async Task<ClientDto> UpdateAsync(int id, UpdateClientDto dto)
        {
            var Client = await _context.Clients.FindAsync(id)
                ?? throw new KeyNotFoundException($"Client with ID {id} was not found.");

            Client.BusinessName = dto.BusinessName;
            Client.Website = dto.Website;
            Client.Logo = dto.Logo;
            Client.AltTag = dto.AltTag;
            Client.ClientOrder = dto.ClientOrder;
            Client.Comments = dto.Comments;

            await _context.SaveChangesAsync();

            return MapToDto(Client);
        }

        public async Task DeleteAsync(int id)
        {
            var Client = await _context.Clients.FindAsync(id)
                ?? throw new KeyNotFoundException($"Client with ID {id} was not found.");

            _context.Clients.Remove(Client);
            await _context.SaveChangesAsync();
        }

        public async Task ReorderAsync(List<int> orderedIds)
        {
            var clients = await _context.Clients
                .Where(c => orderedIds.Contains(c.Id))
                .ToListAsync();

            for (int i = 0; i < orderedIds.Count; i++)
            {
                var client = clients.FirstOrDefault(c => c.Id == orderedIds[i]);
                if (client != null)
                    client.ClientOrder = i + 1;
            }

            await _context.SaveChangesAsync();
        }

        private static ClientDto MapToDto(Client Client) => new()
        {
            Id = Client.Id,
            BusinessName = Client.BusinessName,
            Website = Client.Website,
            Logo = Client.Logo,
            AltTag = Client.AltTag,
            ClientOrder = Client.ClientOrder,
            Comments = Client.Comments
        };
    }
}