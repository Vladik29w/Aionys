using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Note
    {
        public Guid Id { get; private set; } = Guid.CreateVersion7();
        [MaxLength(32)]
        required public string Title { get; set; }
        [MaxLength(10000)]
        public string? Text { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
