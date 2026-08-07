using Amazon.S3;
using Amazon.S3.Transfer;
using Amazon.S3.Model;

namespace backend.Services;

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public S3Service(IAmazonS3 s3Client)
    {
        _s3Client = s3Client;
        _bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME") ?? throw new Exception("AWS_BUCKET_NAME missing");
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        var fileExtension= Path.GetExtension(file.FileName);
        var objectKey = $"uploads/{Guid.NewGuid()}{fileExtension}";
        using var stream = file.OpenReadStream();

        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = objectKey,
            InputStream = stream,
            ContentType= file.ContentType
        };

        await _s3Client.PutObjectAsync(request);

        return objectKey;
    }
}

/*
User selects cat.png
        │
        ▼
Browser uploads file
        │
        ▼
ASP.NET Core creates IFormFile
        │
        ▼
OpenReadStream()
        │
        ▼
A stream is opened for reading the file
        │
        ▼
PutObjectAsync()
        │
        ▼
AWS repeatedly reads bytes from the stream
        │
        ▼
File stored in S3
*/