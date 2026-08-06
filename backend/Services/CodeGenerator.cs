using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class CodeGenerator : ICodeGenerator
{
    private readonly AppDbContext _context;

    public CodeGenerator(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateUniqueCodeAsync()
    {
        while (true)
        {
            var code = Random.Shared.Next(100000,999999).ToString();

            bool exists = await _context.ShareItems.AnyAsync(x=>x.Code == code);

            if (!exists)
            {
                return code;
            }
        }
    }
}