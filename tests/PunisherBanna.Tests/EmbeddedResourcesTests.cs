using System.Reflection;

namespace PunisherBanna.Tests;

public sealed class EmbeddedResourcesTests
{
    [Fact]
    public void AssemblyContainsSettingsAndWebClient()
    {
        Assembly assembly = typeof(Plugin).Assembly;
        string[] resources = assembly.GetManifestResourceNames();

        Assert.Contains("PunisherBanna.Configuration.settings.html", resources);
        Assert.Contains("PunisherBanna.Web.punisher-banna.js", resources);
    }
}
