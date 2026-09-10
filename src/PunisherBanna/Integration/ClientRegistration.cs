using System.Reflection;
using System.Runtime.Loader;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace PunisherBanna.Integration;

public sealed class ClientRegistration : IHostedService
{
    private static readonly Guid PatchId = Guid.Parse("f509d1cb-12f5-49bd-b314-f337e1bc7222");
    private const string DependencyAssembly = "Jellyfin.Plugin.FileTransformation";
    private const string DependencyApi = "Jellyfin.Plugin.FileTransformation.PluginInterface";
    private readonly ILogger<ClientRegistration> _logger;

    public ClientRegistration(ILogger<ClientRegistration> logger)
    {
        _logger = logger;
    }

    public static bool Connected { get; private set; }

    public static string ConnectionMessage { get; private set; } = "Verbindung wurde noch nicht geprüft.";

    public Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            Type? api = LocateDependencyApi();
            MethodInfo? register = api?.GetMethod(
                "RegisterTransformation",
                BindingFlags.Public | BindingFlags.Static,
                binder: null,
                types: [typeof(JObject)],
                modifiers: null);

            if (register is null)
            {
                SetConnection(false, "File Transformation 3.0.0 ist nicht verfügbar.");
                _logger.LogWarning("PunisherBanna: {Message}", ConnectionMessage);
                return Task.CompletedTask;
            }

            var registration = JObject.FromObject(new Dictionary<string, object?>
            {
                ["id"] = PatchId,
                ["fileNamePattern"] = "index.html",
                ["callbackAssembly"] = typeof(IndexHtmlPatch).Assembly.FullName,
                ["callbackClass"] = typeof(IndexHtmlPatch).FullName,
                ["callbackMethod"] = nameof(IndexHtmlPatch.Apply)
            });

            register.Invoke(null, [registration]);
            SetConnection(true, "File Transformation ist verbunden.");
            _logger.LogInformation("PunisherBanna: Webclient-Erweiterung registriert.");
        }
        catch (Exception exception)
        {
            SetConnection(false, $"Verbindung fehlgeschlagen: {Unwrap(exception).Message}");
            _logger.LogError(exception, "PunisherBanna konnte die Webclient-Erweiterung nicht registrieren.");
        }

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        try
        {
            MethodInfo? remove = LocateDependencyApi()?.GetMethod(
                "RemoveTransformation",
                BindingFlags.Public | BindingFlags.Static,
                binder: null,
                types: [typeof(Guid)],
                modifiers: null);
            remove?.Invoke(null, [PatchId]);
        }
        catch (Exception exception)
        {
            _logger.LogDebug(exception, "PunisherBanna konnte die Webclient-Erweiterung beim Stoppen nicht abmelden.");
        }
        finally
        {
            SetConnection(false, "Webclient-Erweiterung ist nicht registriert.");
        }

        return Task.CompletedTask;
    }

    private static Type? LocateDependencyApi()
    {
        Assembly? dependency = AssemblyLoadContext.All
            .SelectMany(context => context.Assemblies)
            .FirstOrDefault(assembly => string.Equals(
                assembly.GetName().Name,
                DependencyAssembly,
                StringComparison.Ordinal));
        return dependency?.GetType(DependencyApi, throwOnError: false, ignoreCase: false);
    }

    private static Exception Unwrap(Exception exception)
    {
        return exception is TargetInvocationException invocation
            ? invocation.InnerException ?? exception
            : exception;
    }

    private static void SetConnection(bool connected, string message)
    {
        Connected = connected;
        ConnectionMessage = message;
    }
}
