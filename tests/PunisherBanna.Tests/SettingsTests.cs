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
            BannerPlaybackMode = "invalid",
            BannerAudioVolumePercent = 999,
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
        Assert.False(settings.ArrowButtons);
        Assert.True(settings.PageIndicators);
        Assert.Equal("image", settings.BannerPlaybackMode);
        Assert.False(settings.EnableVideoOnMobile);
        Assert.False(settings.BannerAudioEnabled);
        Assert.Equal(100, settings.BannerAudioVolumePercent);
        Assert.Equal(5000, settings.VideoStartDelayMilliseconds);
        Assert.Equal(5, settings.VideoClipDurationSeconds);
        Assert.Equal(50, settings.VideoStartPercent);
        Assert.Equal("balanced", settings.VideoQualityPreset);
        Assert.Equal("image", settings.VideoEndBehavior);
    }

    [Theory]
    [InlineData("small")]
    [InlineData("standard")]
    [InlineData(" LARGE ")]
    public void Sanitize_NormalizesSupportedOptions(string size)
    {
        Guid library = Guid.NewGuid();
        var settings = new Settings
        {
            SourceLibrary = library.ToString("B"),
            DisplaySize = size
        };

        settings.Sanitize();

        Assert.Equal(library.ToString("D"), settings.SourceLibrary);
        Assert.Equal(size.Trim().ToLowerInvariant(), settings.DisplaySize);
    }

    [Theory]
    [InlineData("local-trailer", "economy", "loop")]
    [InlineData("media-preview", "balanced", "image")]
    [InlineData(" AUTOMATIC ", " HIGH ", " LOOP ")]
    public void Sanitize_NormalizesSupportedVideoOptions(string mode, string quality, string endBehavior)
    {
        var settings = new Settings
        {
            SettingsLanguage = "invalid",
            BannerPlaybackMode = mode,
            BannerAudioEnabled = true,
            BannerAudioVolumePercent = 20,
            VideoQualityPreset = quality,
            VideoEndBehavior = endBehavior
        };

        settings.Sanitize();

        Assert.Equal("en", settings.SettingsLanguage);
        Assert.Equal(mode.Trim().ToLowerInvariant(), settings.BannerPlaybackMode);
        Assert.True(settings.BannerAudioEnabled);
        Assert.Equal(20, settings.BannerAudioVolumePercent);
        Assert.Equal(quality.Trim().ToLowerInvariant(), settings.VideoQualityPreset);
        Assert.Equal(endBehavior.Trim().ToLowerInvariant(), settings.VideoEndBehavior);
    }

    [Theory]
    [InlineData("de", "de")]
    [InlineData(" DE ", "de")]
    [InlineData("en", "en")]
    [InlineData("fr", "en")]
    public void Sanitize_NormalizesSettingsLanguage(string language, string expected)
    {
        var settings = new Settings { SettingsLanguage = language };

        settings.Sanitize();

        Assert.Equal(expected, settings.SettingsLanguage);
    }
}
