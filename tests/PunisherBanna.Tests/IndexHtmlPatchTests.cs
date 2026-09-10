using PunisherBanna.Integration;
using Newtonsoft.Json.Linq;

namespace PunisherBanna.Tests;

public sealed class IndexHtmlPatchTests
{
    [Fact]
    public void FileTransformationPayload_DeserializesAndAppliesPatch()
    {
        const string source = "<html><body></body></html>";
        var payload = new JObject { ["contents"] = source };

        HtmlDocumentInput? input = payload.ToObject<HtmlDocumentInput>();

        Assert.NotNull(input);
        Assert.Contains("punisher-banna-client-loader", IndexHtmlPatch.Apply(input), StringComparison.Ordinal);
    }

    [Fact]
    public void Apply_AddsOneLoaderBeforeBodyEnd()
    {
        const string source = "<html><body><main></main></body></html>";

        string transformed = IndexHtmlPatch.Apply(new HtmlDocumentInput { Contents = source });

        Assert.Contains("id=\"punisher-banna-client-loader\"", transformed, StringComparison.Ordinal);
        Assert.Contains("src=\"/PunisherBanna/web?v=", transformed, StringComparison.Ordinal);
        Assert.True(
            transformed.IndexOf("punisher-banna-client-loader", StringComparison.Ordinal)
            < transformed.IndexOf("</body>", StringComparison.Ordinal));
    }

    [Fact]
    public void Apply_DoesNotDuplicateExistingLoader()
    {
        const string source = "<body><script id=\"punisher-banna-client-loader\"></script></body>";

        string transformed = IndexHtmlPatch.Apply(new HtmlDocumentInput { Contents = source });

        Assert.Equal(source, transformed);
    }

    [Theory]
    [InlineData("")]
    [InlineData("<html></html>")]
    public void Apply_LeavesUnsupportedDocumentsUntouched(string source)
    {
        string transformed = IndexHtmlPatch.Apply(new HtmlDocumentInput { Contents = source });

        Assert.Equal(source, transformed);
    }
}
