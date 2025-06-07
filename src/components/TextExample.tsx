import React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { useTheme, borderRadius, PALLETS } from '../theme'
import {
  Text,
  Title,
  Heading,
  Subheading,
  Body,
  BodyLarge,
  BodySmall,
  Label,
  Caption,
  ButtonText,
  DisplayText,
} from './Text'

/**
 * Example component demonstrating the Text component usage
 * This shows all the features and variants available including the new BoxKey spacing
 */
export const TextExample: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={{
        padding: theme.spacing.m,
      }}
    >
      {/* Theme Toggle */}
      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          backgroundColor: theme.colors.primary,
          padding: theme.spacing.m,
          borderRadius: borderRadius.base,
          marginBottom: theme.spacing.l,
          alignItems: 'center',
        }}
      >
        <ButtonText color={PALLETS.WHITE}>Switch to {isDark ? 'Light' : 'Dark'} Theme</ButtonText>
      </TouchableOpacity>

      {/* Text Variants Section */}
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Title primary marginBottom="m">
          Text Variants
        </Title>

        <DisplayText marginBottom="s">Display Large</DisplayText>
        <Title marginBottom="s">Heading 1 (Title)</Title>
        <Heading marginBottom="s">Heading 2</Heading>
        <Subheading marginBottom="s">Heading 3 (Subheading)</Subheading>
        <BodyLarge marginBottom="s">Body Large Text</BodyLarge>
        <Body marginBottom="s">Regular Body Text</Body>
        <BodySmall marginBottom="s">Small Body Text</BodySmall>
        <Label marginBottom="s">Label Text</Label>
        <Caption marginBottom="s">Caption Text</Caption>
        <ButtonText marginBottom="s">Button Text Style</ButtonText>
      </View>

      {/* Color Props Section */}
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Title primary marginBottom="m">
          Color Variants
        </Title>

        <Body primary marginBottom="s">
          Primary Color Text
        </Body>
        <Body secondary marginBottom="s">
          Secondary Color Text
        </Body>
        <Body success marginBottom="s">
          Success Color Text
        </Body>
        <Body warning marginBottom="s">
          Warning Color Text
        </Body>
        <Body danger marginBottom="s">
          Danger Color Text
        </Body>
        <Body muted marginBottom="s">
          Muted Color Text
        </Body>
        <Body color="#9C27B0" marginBottom="s">
          Custom Purple Color
        </Body>
      </View>

      {/* BoxKey Spacing Examples */}
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Title primary marginBottom="m">
          BoxKey Spacing Examples
        </Title>

        <View
          style={{
            backgroundColor: theme.colors.breakLine,
            borderRadius: borderRadius.sm,
            padding: theme.spacing.sm,
            marginBottom: theme.spacing.m,
          }}
        >
          <Label marginBottom="s">Margin Examples:</Label>
          <Body
            marginTop="m"
            marginBottom="m"
            style={{
              backgroundColor: PALLETS.LIGHT_ORANGE,
              borderRadius: borderRadius.xs,
              textAlign: 'center',
            }}
          >
            marginTop="m" marginBottom="m"
          </Body>
          <Body
            marginHorizontal="xl"
            style={{
              backgroundColor: PALLETS.SEA_GREEN,
              borderRadius: borderRadius.xs,
              textAlign: 'center',
            }}
          >
            marginHorizontal="xl"
          </Body>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.breakLine,
            borderRadius: borderRadius.sm,
            padding: theme.spacing.sm,
            marginBottom: theme.spacing.m,
          }}
        >
          <Label marginBottom="s">Padding Examples:</Label>
          <Body
            padding="m"
            style={{ backgroundColor: PALLETS.LIGHT_ORANGE, borderRadius: borderRadius.xs }}
          >
            padding="m"
          </Body>
          <Body
            paddingVertical="l"
            paddingHorizontal="s"
            style={{
              backgroundColor: PALLETS.SEA_GREEN,
              borderRadius: borderRadius.xs,
              marginTop: theme.spacing.s,
            }}
          >
            paddingVertical="l" paddingHorizontal="s"
          </Body>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.breakLine,
            borderRadius: borderRadius.sm,
            padding: theme.spacing.sm,
            marginBottom: theme.spacing.m,
          }}
        >
          <Label marginBottom="s">Complex Spacing:</Label>
          <Text
            variant="h6"
            primary
            center
            marginTop="l"
            marginBottom="m"
            paddingHorizontal="xl"
            paddingVertical="m"
            style={{
              backgroundColor: theme.colors.primary,
              color: PALLETS.WHITE,
              borderRadius: borderRadius.base,
            }}
          >
            Complex Spacing Example
          </Text>
        </View>
      </View>

      {/* Text Transformations */}
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Title primary marginBottom="m">
          Text Transformations
        </Title>

        <Body uppercase marginBottom="s">
          Uppercase Text
        </Body>
        <Body lowercase marginBottom="s">
          LOWERCASE TEXT
        </Body>
        <Body capitalize marginBottom="s">
          capitalize text
        </Body>
        <Body underline marginBottom="s">
          Underlined Text
        </Body>
        <Body strikethrough marginBottom="s">
          Strikethrough Text
        </Body>
      </View>

      {/* Weight Variations */}
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Title primary marginBottom="m">
          Font Weights
        </Title>

        <Body weight="light" marginBottom="s">
          Light Weight
        </Body>
        <Body weight="normal" marginBottom="s">
          Normal Weight
        </Body>
        <Body weight="medium" marginBottom="s">
          Medium Weight
        </Body>
        <Body weight="semi-bold" marginBottom="s">
          Semi Bold Weight
        </Body>
        <Body weight="bold" marginBottom="s">
          Bold Weight
        </Body>
      </View>

      {/* Spacing Values Reference */}
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Title primary marginBottom="m">
          Available Spacing Values
        </Title>

        <Body marginBottom="s">These spacing values are available for all BoxKey props:</Body>
        <Caption muted marginBottom="s">
          • xxs: {theme.spacing.xxs}px
        </Caption>
        <Caption muted marginBottom="s">
          • xs: {theme.spacing.xs}px
        </Caption>
        <Caption muted marginBottom="s">
          • s: {theme.spacing.s}px
        </Caption>
        <Caption muted marginBottom="s">
          • sm: {theme.spacing.sm}px
        </Caption>
        <Caption muted marginBottom="s">
          • m: {theme.spacing.m}px
        </Caption>
        <Caption muted marginBottom="s">
          • ml: {theme.spacing.ml}px
        </Caption>
        <Caption muted marginBottom="s">
          • l: {theme.spacing.l}px
        </Caption>
        <Caption muted marginBottom="s">
          • xl: {theme.spacing.xl}px
        </Caption>
        <Caption muted marginBottom="s">
          • xxl: {theme.spacing.xxl}px
        </Caption>
      </View>

      {/* Usage Examples */}
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Title primary marginBottom="m">
          Usage Examples
        </Title>

        <View
          style={{
            backgroundColor: theme.colors.breakLine,
            borderRadius: borderRadius.sm,
            padding: theme.spacing.m,
          }}
        >
          <Caption muted marginBottom="s">
            Example code:
          </Caption>
          <Text
            variant="caption"
            style={{
              fontFamily: 'monospace',
              backgroundColor: theme.colors.background,
              padding: theme.spacing.s,
              borderRadius: borderRadius.xs,
            }}
          >
            {`<Text variant="h2" primary center\n  marginTop="l" paddingHorizontal="m">\n  Styled Text\n</Text>`}
          </Text>
        </View>
      </View>

      <View style={{ height: theme.spacing.xl }} />
    </ScrollView>
  )
}

export default TextExample
