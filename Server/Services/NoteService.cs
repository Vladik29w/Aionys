using Microsoft.EntityFrameworkCore;
using Server.DTOs;
using Server.Models;

namespace Server.Services
{
    public class NoteService(AppDbContext db) : INoteService
    {
        public async Task<IReadOnlyList<NoteDto>> GetAllNotesAsync(CancellationToken ct = default)
        {
            return await db.Notes
                .AsNoTracking()
                .OrderByDescending(n => n.UpdatedAt)
                .ThenByDescending(n => n.Id)
                .Select(n => new NoteDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Text = n.Text,
                    UpdatedAt = n.UpdatedAt
                })
                .ToListAsync(ct);
        }

        public async Task<NoteDto?> GetNoteByIdAsync(Guid id, CancellationToken ct = default)
        {
            return await db.Notes
                .AsNoTracking()
                .Where(n => n.Id == id)
                .Select(n => new NoteDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Text = n.Text,
                    UpdatedAt = n.UpdatedAt
                })
                .FirstOrDefaultAsync(ct);
        }

        public async Task<NoteDto> CreateNoteAsync(CreateNoteDto noteDto, CancellationToken ct = default)
        {
            var note = new Note
            {
                Title = noteDto.Title,
                Text = noteDto.Text,
                UpdatedAt = DateTime.UtcNow
            };

            db.Notes.Add(note);
            await db.SaveChangesAsync(ct);

            return new NoteDto
            {
                Id = note.Id,
                Title = note.Title,
                Text = note.Text,
                UpdatedAt = note.UpdatedAt
            };
        }

        public async Task<bool> UpdateNoteAsync(Guid id, UpdateNoteDto noteDto, CancellationToken ct = default)
        {
            int rowsAffected = await db.Notes
             .Where(n => n.Id == id)
             .ExecuteUpdateAsync(s => s
                 .SetProperty(n => n.Title, noteDto.Title)
                 .SetProperty(n => n.Text, noteDto.Text)
                 .SetProperty(n => n.UpdatedAt, DateTime.UtcNow), ct);

            return rowsAffected > 0;
        }

        public async Task<bool> DeleteNoteAsync(Guid id, CancellationToken ct = default)
        {
            int rowsAffected = await db.Notes.Where(n => n.Id == id).ExecuteDeleteAsync(ct);
            return rowsAffected > 0;
        }
    }
}
