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
            VerticalFocus = "left",
            BannerPlaybackMode = "invalid",
            VideoStartDelayMilliseconds = 9000,
            VideoClipDurationSeconds = 1,
            VideoStartPercent = 99,
            VideoQualityPreset = "invalid",
            VideoEndBehavior = "invalid"
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
        Assert.Equal("image", settings.BannerPlaybackMode);
        Assert.False(settings.EnableVideoOnMobile);
        Assert.Equal(5000, settings.VideoStartDelayMilliseconds);
        Assert.Equal(5, settings.VideoClipDurationSeconds);
        Assert.Equal(50, settings.VideoStartPercent);
        Assert.Equal("balanced", settings.VideoQualityPreset);
        Assert.Equal("image", settings.VideoEndBehavior);
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

    [Theory]
    [InlineData("local-trailer", "economy", "loop")]
    [InlineData("media-preview", "balanced", "image")]
    [InlineData(" AUTOMATIC ", " HIGH ", " LOOP ")]
    public void Sanitize_NormalizesSupportedVideoOptions(string mode, string quality, string endBehavior)
    {
        var settings = new Settings
        {
            BannerPlaybackMode = mode,
            VideoQualityPreset = quality,
            VideoEndBehavior = endBehavior
        };

        settings.Sanitize();

        Assert.Equal(mode.Trim().ToLowerInvariant(), settings.BannerPlaybackMode);
        Assert.Equal(quality.Trim().ToLowerInvariant(), settings.VideoQualityPreset);
        Assert.Equal(endBehavior.Trim().ToLowerInvariant(), settings.VideoEndBehavior);
    }
}
