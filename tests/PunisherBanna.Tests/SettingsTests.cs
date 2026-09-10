using PunisherBanna.Configuration;

namespace PunisherBanna.Tests;

public sealed class SettingsTests
{
    [Fact]
    public void Sanitize_UsesSafeDefaultsForInvalidValues()
    {
        var settings = new Settings
        {
            SourceLibrary = "invalid",
            VisibleSlides = 200,
            RotationSeconds = -1,
            DisplaySize = "wide",
            ArtworkKind = "thumb",
            VerticalFocus = "left"
        };

        settings.Sanitize();

        Assert.Empty(settings.SourceLibrary);
        Assert.Equal(20, settings.VisibleSlides);
        Assert.Equal(3, settings.RotationSeconds);
        Assert.Equal("standard", settings.DisplaySize);
        Assert.Equal("backdrop", settings.ArtworkKind);
        Assert.Equal("center", settings.VerticalFocus);
        Assert.False(settings.ArrowButtons);
        Assert.True(settings.PageIndicators);
    }

    [Theory]
    [InlineData("small", "backdrop", "top")]
    [InlineData("standard", "banner", "center")]
    [InlineData(" LARGE ", " BANNER ", " BOTTOM ")]
    public void Sanitize_NormalizesSupportedOptions(string size, string artwork, string focus)
    {
        Guid library = Guid.NewGuid();
        var settings = new Settings
        {
            SourceLibrary = library.ToString("B"),
            DisplaySize = size,
            ArtworkKind = artwork,
            VerticalFocus = focus
        };

        settings.Sanitize();

        Assert.Equal(library.ToString("D"), settings.SourceLibrary);
        Assert.Equal(size.Trim().ToLowerInvariant(), settings.DisplaySize);
        Assert.Equal(artwork.Trim().ToLowerInvariant(), settings.ArtworkKind);
        Assert.Equal(focus.Trim().ToLowerInvariant(), settings.VerticalFocus);
    }
}
