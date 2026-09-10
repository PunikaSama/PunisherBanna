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
            VerticalFocus = "left"
        };

        settings.Sanitize();

        Assert.Empty(settings.SourceLibrary);
        Assert.Equal(20, settings.VisibleSlides);
        Assert.Equal(3, settings.RotationSeconds);
        Assert.Equal("standard", settings.DisplaySize);
        Assert.Equal("center", settings.VerticalFocus);
        Assert.False(settings.FullBackdrop);
        Assert.False(settings.ArrowButtons);
        Assert.True(settings.PageIndicators);
    }

    [Theory]
    [InlineData("small", "top")]
    [InlineData("standard", "center")]
    [InlineData(" LARGE ", " BOTTOM ")]
    public void Sanitize_NormalizesSupportedOptions(string size, string focus)
    {
        Guid library = Guid.NewGuid();
        var settings = new Settings
        {
            SourceLibrary = library.ToString("B"),
            DisplaySize = size,
            FullBackdrop = true,
            VerticalFocus = focus
        };

        settings.Sanitize();

        Assert.Equal(library.ToString("D"), settings.SourceLibrary);
        Assert.Equal(size.Trim().ToLowerInvariant(), settings.DisplaySize);
        Assert.True(settings.FullBackdrop);
        Assert.Equal(focus.Trim().ToLowerInvariant(), settings.VerticalFocus);
    }
}
