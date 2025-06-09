# Locales Directory Structure

This directory contains all translation files for the World Explorer app's internationalization system.

## Supported Languages

| Locale Code | Language             | Native Name | Status           |
| ----------- | -------------------- | ----------- | ---------------- |
| `en`        | English              | English     | ✅ Base language |
| `es`        | Spanish              | Español     | 🔄 In progress   |
| `fr`        | French               | Français    | 🔄 In progress   |
| `de`        | German               | Deutsch     | 🔄 In progress   |
| `ja`        | Japanese             | 日本語      | 🔄 In progress   |
| `vi`        | Vietnamese           | Tiếng Việt  | 🔄 In progress   |
| `zh-CN`     | Chinese (Simplified) | 简体中文    | 🔄 In progress   |

## Directory Structure

```
src/locales/
├── README.md                 # This documentation file
├── en/                       # English (base language)
│   ├── common.json          # Common UI elements
│   ├── navigation.json      # Navigation labels
│   ├── quiz.json           # Quiz-related text
│   ├── learning.json       # Learning module text
│   └── challenge.json      # Challenge mode text
├── es/                      # Spanish translations
│   └── [same structure as en/]
├── fr/                      # French translations
│   └── [same structure as en/]
├── de/                      # German translations
│   └── [same structure as en/]
├── ja/                      # Japanese translations
│   └── [same structure as en/]
├── vi/                      # Vietnamese translations
│   └── [same structure as en/]
└── zh-CN/                   # Chinese Simplified translations
    └── [same structure as en/]
```

## File Naming Conventions

### JSON Files Structure

Each language directory contains modular JSON files organized by feature:

- **`common.json`** - Shared UI elements (buttons, labels, errors)
- **`navigation.json`** - Tab labels, screen titles, navigation text
- **`quiz.json`** - Quiz instructions, feedback, scoring
- **`learning.json`** - Country profiles, educational content
- **`challenge.json`** - Challenge mode specific text

### Key Naming Pattern

Use dot notation for nested organization:

```json
{
  "button": {
    "start": "Start",
    "cancel": "Cancel",
    "continue": "Continue"
  },
  "screen": {
    "title": {
      "home": "World Explorer",
      "quiz": "Quiz"
    }
  }
}
```

## Translation Guidelines

### English (Base Language)

- All translation keys must exist in English first
- Use clear, descriptive key names
- Include context comments for translators when needed

### Character Encoding

- **Vietnamese**: Ensure proper UTF-8 encoding for diacritics (á, ă, â, é, ê, etc.)
- **Chinese**: Use proper encoding for Simplified Chinese characters
- **Japanese**: Support for Hiragana, Katakana, and Kanji characters

### Text Length Considerations

- Keep translations concise for UI elements
- Consider text expansion for languages like German
- Test text wrapping for longer translations

## Adding New Languages

1. Create new directory with proper locale code
2. Copy JSON structure from `en/` directory
3. Translate all keys while maintaining the same structure
4. Update `SUPPORTED_LOCALES` in `src/i18n/config.ts`
5. Test the new language in the app

## Maintenance

- Always update English files first
- Maintain consistent key structure across all languages
- Use translation tools or services for professional translations
- Regular review and updates for accuracy

## Integration

These files are loaded by the react-intl system configured in:

- `src/i18n/config.ts` - Language configuration
- `src/i18n/types.ts` - TypeScript definitions
- Main app wrapper with IntlProvider

---

For implementation details, see the Internationalization task documentation.
