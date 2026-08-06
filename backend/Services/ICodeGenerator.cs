namespace backend.Services;

public interface ICodeGenerator
{
    Task<string> GenerateUniqueCodeAsync();
}

//Task<string> means the method is asynchronous and will return a string value when awaited. The Task represents the ongoing operation, and when it completes, it will yield a string result.
