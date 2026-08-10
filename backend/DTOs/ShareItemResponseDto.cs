namespace backend.DTOs;

public class ShareItemResponseDto
{
    public string Code { get; set;}=string.Empty;

    public string Type { get; set;}= string.Empty;
    public string OriginalName { get; set;}=string.Empty;
    public string? MimeType {get; set;}=string.Empty;
    public long? Size {get; set;}=0;
    public string? DownloadUrl {get;set;}=string.Empty;
}