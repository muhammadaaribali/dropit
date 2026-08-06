using Amazon.S3;
using Amazon.S3.Transfer;

namespace backend.Services;

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly IConfiguration _configuration;

    public S3Service(IAmazonS3 s3Client, IConfiguration configuration)
    {
        _s3Client = s3Client;
        _configuration = configuration;
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        throw new NotImplementedException();
    }
}