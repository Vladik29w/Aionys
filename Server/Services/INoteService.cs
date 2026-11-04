using Server.DTOs;

namespace Server.Services
{
    public interface INoteService
    {
        Task<IReadOnlyList<NoteDto>> GetAllNotesAsync(CancellationToken ct = default);
        Task<NoteDto?> GetNoteByIdAsync(Guid id, CancellationToken ct = default);
        Task<NoteDto> CreateNoteAsync(CreateNoteDto noteDto, CancellationToken ct = default);
        Task<bool> UpdateNoteAsync(Guid id, UpdateNoteDto noteDto, CancellationToken ct = default);
        Task<bool> DeleteNoteAsync(Guid id, CancellationToken ct = default);
    }
}
