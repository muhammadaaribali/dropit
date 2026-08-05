namespace backend.Models;

public class ShareItem
{
    public int Id { get; set;}
    public string Code { get; set;}= string.Empty;
    public string Type { get; set;}= string.Empty;
    public string OriginalName {get; set;} = string.Empty;
    public string? S3Key {get;set;}
    public string? LinkUrl {get;set;}
    public string? MineType {get;set;}
    public long? Size {get;set;}
    public DateTime CreatedAt {get;set;}= DateTime.UtcNow;
    public DateTime ExpiresAt {get;set;}= DateTime.UtcNow.AddDays(1);
    public int Downloads {get;set;}=0;

}