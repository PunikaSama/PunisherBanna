using System.Net.Mime;
using System.Reflection;
using Jellyfin.Data.Enums;
using Jellyfin.Database.Implementations.Enums;
using MediaBrowser.Common.Api;
using MediaBrowser.Controller.Entities;
using MediaBrowser.Controller.Library;
using MediaBrowser.Model.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PunisherBanna.Configuration;
using PunisherBanna.Contracts;
using PunisherBanna.Integration;

namespace PunisherBanna.Api;

[ApiController]
[Route("PunisherBanna")]
public sealed class BannerController : ControllerBase
{
    private const string ScriptResource = "PunisherBanna.Web.punisher-banna.js";
    private readonly IUserManager _users;
    private readonly ILibraryManager _library;
    private readonly ILogger<BannerController> _logger;

    public BannerController(
        IUserManager users,
        ILibraryManager library,
        ILogger<BannerController> logger)
    {
        _users = users;
        _library = library;
        _logger = logger;
    }

    [HttpGet("web")]
    [AllowAnonymous]
    [Produces("application/javascript")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult WebScript()
    {
        Stream? stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(ScriptResource);
        if (stream is null)
        {
            return NotFound();
        }

        Response.Headers.CacheControl = "no-cache, no-store";
        return File(stream, "application/javascript; charset=utf-8");
    }

    [HttpGet("content")]
    [Authorize]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(CarouselPayload), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<CarouselPayload> Content()
    {
        Settings settings = ReadSettings();
        Jellyfin.Database.Implementations.Entities.User? user = ResolveCurrentUser();
        if (user is null)
        {
            return Unauthorized();
        }

        if (!Guid.TryParse(settings.SourceLibrary, out Guid sourceId))
        {
            return Ok(BuildPayload(settings, Array.Empty<SlideData>(), "Bitte zuerst eine Bibliothek auswählen."));
        }

        try
        {
            ImageType artwork = settings.ArtworkKind == "banner" ? ImageType.Banner : ImageType.Backdrop;
            var request = new InternalItemsQuery(user)
            {
                AncestorIds = [sourceId],
                IncludeItemTypes = [BaseItemKind.Movie, BaseItemKind.Series],
                Limit = Math.Max(50, settings.VisibleSlides * 10),
                OrderBy = [(ItemSortBy.Random, SortOrder.Ascending)]
            };

            var slides = new List<SlideData>(settings.VisibleSlides);
            var added = new HashSet<Guid>();
            foreach (BaseItem media in _library.GetItemList(request))
            {
                if (slides.Count == settings.VisibleSlides)
                {
                    break;
                }

                if (!added.Add(media.Id)
                    || !media.IsVisible(user)
                    || !media.GetAncestorIds().Contains(sourceId)
                    || !media.HasImage(artwork))
                {
                    continue;
                }

                slides.Add(new SlideData
                {
                    Id = media.Id.ToString("D"),
                    Title = media.Name,
                    MediaKind = media.GetBaseItemKind() == BaseItemKind.Series ? "series" : "movie",
                    Artwork = artwork.ToString(),
                    Logo = artwork != ImageType.Banner && media.HasImage(ImageType.Logo),
                    Score = media.CommunityRating is float score ? Math.Round(score, 1) : null
                });
            }

            string? notice = slides.Count == 0
                ? $"Keine passenden Medien mit {settings.ArtworkKind}.jpg gefunden."
                : null;
            return Ok(BuildPayload(settings, slides, notice));
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "PunisherBanna konnte keine Inhalte für Benutzer {User} laden.", user.Username);
            return Ok(BuildPayload(settings, Array.Empty<SlideData>(), "Banner konnten nicht geladen werden."));
        }
    }

    [HttpGet("libraries")]
    [Authorize(Policy = Policies.RequiresElevation)]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(IReadOnlyList<LibraryChoice>), StatusCodes.Status200OK)]
    public ActionResult<IReadOnlyList<LibraryChoice>> Libraries()
    {
        var choices = new Dictionary<Guid, LibraryChoice>();
        try
        {
            foreach (var folder in _library.GetVirtualFolders())
            {
                if (Guid.TryParse(folder.ItemId, out Guid id) && !string.IsNullOrWhiteSpace(folder.Name))
                {
                    choices[id] = new LibraryChoice { Id = id.ToString("D"), Name = folder.Name };
                }
            }

            Jellyfin.Database.Implementations.Entities.User? user = ResolveCurrentUser();
            if (user is not null)
            {
                foreach (BaseItem child in _library.GetUserRootFolder().GetChildren(user, true))
                {
                    if (!string.IsNullOrWhiteSpace(child.Name))
                    {
                        choices.TryAdd(
                            child.Id,
                            new LibraryChoice { Id = child.Id.ToString("D"), Name = child.Name });
                    }
                }
            }

            return Ok(choices.Values.OrderBy(choice => choice.Name, StringComparer.CurrentCultureIgnoreCase).ToArray());
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "PunisherBanna konnte die Bibliotheksliste nicht laden.");
            return Ok(Array.Empty<LibraryChoice>());
        }
    }

    [HttpGet("dependency")]
    [Authorize(Policy = Policies.RequiresElevation)]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(DependencyState), StatusCodes.Status200OK)]
    public ActionResult<DependencyState> Dependency()
    {
        return Ok(new DependencyState
        {
            Connected = ClientRegistration.Connected,
            Message = ClientRegistration.ConnectionMessage
        });
    }

    private Jellyfin.Database.Implementations.Entities.User? ResolveCurrentUser()
    {
        string? name = User.Identity?.Name;
        return string.IsNullOrWhiteSpace(name) ? null : _users.GetUserByName(name);
    }

    private static Settings ReadSettings()
    {
        Settings settings = Plugin.Current?.Configuration ?? new Settings();
        settings.Sanitize();
        return settings;
    }

    private static CarouselPayload BuildPayload(
        Settings settings,
        IReadOnlyList<SlideData> slides,
        string? notice)
    {
        return new CarouselPayload
        {
            Slides = slides,
            Rotate = settings.AutomaticRotation,
            RotateMilliseconds = settings.RotationSeconds * 1000,
            Rating = settings.RatingsVisible,
            Size = settings.DisplaySize,
            Anchor = settings.VerticalFocus,
            Arrows = settings.ArrowButtons,
            Dots = settings.PageIndicators,
            Notice = notice
        };
    }
}
