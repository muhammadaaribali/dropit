using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using backend.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

    [HttpPost("upload")]
    public async Task<ActionResult<UploadFileResponseDto>> Upload(IFormFile file)
    {
        if(file==null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        var code = await _codeGenerator.GenerateUniqueCodeAsync();
        var objectKey= await _s3Service.UploadFileAsync(file);

        var shareItem = new ShareItem
        {
            Code = code,
            Type = file.ContentType.StartsWith("image/") ? Enums.ShareType.Image : Enums.ShareType.File,

            OriginalName =file.FileName,
            S3Key = objectKey,
            MimeType = file.ContentType,
            Size= file.Length

        };

        _context.ShareItems.Add(shareItem);
        await _context.SaveChangesAsync();

        return Ok(new UploadFileResponseDto
        {
            Code = code
        });
    }

    [HttpGet("{code}")]
    public async Task<ActionResult<ShareItemResponseDto>> GetByCode(string code)
    {
         var shareItem = await _context.ShareItems.FirstOrDefaultAsync(x=>x.Code==code);

        if (shareItem == null)
        {
            return NotFound("Share code not found");
        }
        if(shareItem.ExpiresAt <= DateTime.UtcNow)
        {
            return BadRequest("Share has Expired");
        }
        var downloadUrl= shareItem.S3Key != null ? _s3Service.GenerateDownloadUrl(shareItem.S3Key):null;

        var response = new ShareItemResponseDto
        {
            Code=shareItem.Code,
            Type=shareItem.Type.ToString(),
            OriginalName=shareItem.OriginalName,
            MimeType=shareItem.MimeType,
            Size=shareItem.Size,
            DownloadUrl=downloadUrl
        };

        return Ok(response);
    }
    [HttpPost("share-link")]
    public async Task<ActionResult<ShareItemResponseDto>> ShareLink(ShareLinkRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest("URL is required.");
        }
        if(!Uri.TryCreate(request.Url, UriKind.Absolute, out var uri))
        {
            return BadRequest("Invalid URL");
        }

        //we are turing our url into c# object
        //When you turn it into a Uri object, C# can understand the different parts of the URL instead of treating it as random text.
        /*
        https://google.com/products?id=10
        │      │          │        │
        │      │          │        └── query
        │      │          └─────────── path
        │      └────────────────────── host
        └───────────────────────────── scheme
        */

        var code = await _codeGenerator.GenerateUniqueCodeAsync();

        var shareItem = new ShareItem
        {
            Code = code,
            Type = Enums.ShareType.Link,
            LinkUrl = uri.ToString()
            
        };

        _context.ShareItems.Add(shareItem);
        await _context.SaveChangesAsync();

        return Ok(new UploadFileResponseDto
        {
            Code =code
        });
    }

}