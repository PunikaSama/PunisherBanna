using System.Globalization;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Controller.Configuration;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;
using PunisherBanna.Configuration;

namespace PunisherBanna;

public sealed class Plugin : BasePlugin<Settings>, IHasWebPages
{
    public static readonly Guid PluginGuid = Guid.Parse("f7ed121e-d2c2-43a2-9d2e-8cb07a217014");

    public Plugin(
        IApplicationPaths applicationPaths,
        IXmlSerializer xmlSerializer,
        IServerConfigurationManager serverConfigurationManager)
        : base(applicationPaths, xmlSerializer)
    {
        Current = this;
        ServerConfiguration = serverConfigurationManager;
        Configuration.Sanitize();
    }

    public static Plugin? Current { get; private set; }

    public IServerConfigurationManager ServerConfiguration { get; }

    public override Guid Id => PluginGuid;

    public override string Name => "PunisherBanna";

    public override string Description => "Zeigt zufällige Filme und Serien als Banner auf der Startseite an.";

    public override void UpdateConfiguration(BasePluginConfiguration configuration)
    {
        if (configuration is Settings settings)
        {
            settings.Sanitize();
        }

        base.UpdateConfiguration(configuration);
    }

    public IEnumerable<PluginPageInfo> GetPages()
    {
        yield return new PluginPageInfo
        {
            Name = Name,
            EmbeddedResourcePath = string.Format(
                CultureInfo.InvariantCulture,
                "{0}.Configuration.settings.html",
                GetType().Namespace)
        };
    }
}
