import { SettingsStateService, SettingsType } from "../state-stores/settings/settings-state";

export class ColorUtils {
    private static Color = [
        ['white', '#FFFFFF'],
        ['navajowhite', '#FFDEAD'],
        ['snow', '#FFFAFA'],
        ['honeydew', '#F0FFF0'],
        ['mistyrose', '#FFE4E1'],
        ['mintcream', '#F5FFFA'],
        ['lavenderblush', '#FFF0F5'],
        ['azure', '#F0FFFF'],
        ['linen', '#FAF0E6'],
        ['aliceblue', '#F0F8FF'],
        ['antiquewhite', '#FAEBD7'],
        ['ghostwhite', '#F8F8FF'],
        ['ivory', '#FFFFF0'],
        ['whitesmoke', '#F5F5F5'],
        ['seashell', '#FFF5EE'],
        ['beige', '#F5F5DC'],
        ['oldlace', '#FDF5E6'],
        ['floralwhite', '#FFFAF0'],
    ]

    public static getColorAt = (index: number) => {
        return SettingsStateService.isEnabled(SettingsType.DARK_THEME)
        || SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) ?
            ColorUtils.Color[index][1] : ColorUtils.invertHex(ColorUtils.Color[index][1]);
    }

    private static invertHex(hex: string) {
        return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
    }
}