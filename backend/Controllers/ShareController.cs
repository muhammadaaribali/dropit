using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]

//Without inheriting from ControllerBase, it wouldn't behave as an API controller.
public class ShareController : ControllerBase
{
    private readonly IS3Service _s3Service;
    private readonly AppDbContext _context;
    private readonly ICodeGenerator _codeGenerator;

    public ShareController(IS3Service s3Service, AppDbContext context, ICodeGenerator codeGenerator)
    {
        _s3Service = s3Service;
        _context = context;
        _codeGenerator = codeGenerator;
    }
}