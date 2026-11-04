using System.ComponentModel.DataAnnotations;

namespace Server.DTOs
{
    public record NoteDto
    {
        public Guid Id { get; set; }
        required public string Title { get; set; }
        public string? Text { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public record CreateNoteDto([MaxLength(32)] string Title, [MaxLength(10000)] string? Text);

    public record UpdateNoteDto([MaxLength(32)] string Title, [MaxLength(10000)] string? Text);
}
