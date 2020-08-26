export class TagUtils {
    private static regexp = /\B\#\w\w+\b/g
    public static getTags = (content: string): string[] => {
        return (content.match(TagUtils.regexp) || [])
            .map(function (s) {
                return s.trim()
            });
    }

    public static assignColors = (tags: string[], existingSettings: Map<string, string>) => {

        tags.forEach((tag) => {
            let color = TagUtils.getRandomColor()
            while (existingSettings.get(color)) {
                color = TagUtils.getRandomColor()
            }

            existingSettings.set(color, tag)
        })

        return existingSettings
    }

    private static getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}