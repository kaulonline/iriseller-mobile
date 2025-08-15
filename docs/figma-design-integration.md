# IRISeller Mobile App - Figma Design Integration Guide

## 🎨 Overview

This guide explains how to use Figma MCP (Model Context Protocol) integration to create and implement designs for the IRISeller mobile app.

## 📱 Mobile App Architecture

### Current Components
- **IrisButton**: Multi-variant button with gradients and states
- **IrisCard**: Consistent card component with shadows
- **IrisText**: Typography system with variants
- **IrisChart**: Data visualization component (NEW)

### Screens
- **LoginScreen**: Authentication with IRIS branding
- **HomeScreen**: Dashboard with metrics and actions
- **AnalyticsScreen**: Comprehensive analytics dashboard (NEW)

## 🎯 Design System

### Color Palette
```typescript
// Primary Brand Colors
iris: {
  offBlack: '#09171F',      // Darkest shade
  inkyBlue: '#153539',      // Dark blue
  peacock: '#265E5A',       // Medium dark teal
  turquoise: '#06868D',     // Main brand color
  plexBlue: '#2EE5EA',      // Light bright teal
  sky: '#A0B8D0',           // Light blue/gray
}

// Semantic Colors
primary: '#06868D',         // iris.turquoise
secondary: '#265E5A',       // iris.peacock
accent: '#2EE5EA',          // iris.plexBlue
```

### Typography Scale
- **display2**: Large display text
- **h2, h3, h4, h5, h6**: Heading hierarchy
- **bodyLarge, bodyMedium, bodySmall**: Body text variants
- **button**: Button text styling
- **caption**: Small descriptive text

## 🚀 Figma MCP Integration Workflow

### Step 1: Create Designs in Figma

#### Mobile Frame Setup
```
Frame Size: iPhone 14 (390x844) or Android (360x800)
Design System: Use exact IRIS brand colors
Components: Follow existing component patterns
```

#### Design Templates
1. **Screen Templates**
   - Header with gradient background
   - Content area with cards
   - Bottom navigation/actions
   - Loading and error states

2. **Component Templates**
   - Button variants (primary, outline, gradient)
   - Card layouts with metrics
   - Chart components
   - Form elements

### Step 2: Generate Code with MCP

#### Example Prompts for Mobile Components

**Generate Screen Component:**
```
"Generate a React Native screen component from this Figma design using our IRISeller mobile design system. Include:
- IrisText, IrisCard, IrisButton components
- Proper TypeScript interfaces
- IRIS brand colors from our theme
- React Native styling with StyleSheet
- SafeAreaView and proper spacing
- Integration with our existing services"
```

**Generate Chart Component:**
```
"Create a React Native chart component from this Figma selection that:
- Follows our IrisChart pattern
- Uses LinearGradient with IRIS colors
- Includes proper TypeScript props
- Supports different chart types (bar, line, pie)
- Has responsive sizing for mobile screens"
```

**Generate Form Component:**
```
"Build a React Native form component based on this Figma design:
- Use TextInput with IRIS styling
- Include validation states
- Use IrisButton for actions
- Follow our spacing and border radius patterns
- Include proper accessibility props"
```

### Step 3: Implementation Patterns

#### Screen Structure Template
```tsx
export const NewScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with gradient */}
      <LinearGradient
        colors={[colors.iris.turquoise, colors.iris.peacock]}
        style={styles.header}
      >
        <IrisText variant="h4" color="inverse">
          Screen Title
        </IrisText>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Components here */}
      </ScrollView>
    </SafeAreaView>
  );
};
```

#### Component Styling Pattern
```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  // Use theme constants for consistency
});
```

## 📋 Design Guidelines

### Mobile-Specific Considerations

1. **Touch Targets**: Minimum 44px height for interactive elements
2. **Spacing**: Use theme spacing constants (spacing.sm, spacing.md, etc.)
3. **Typography**: Ensure readability on small screens
4. **Navigation**: Consider thumb-friendly navigation patterns
5. **Performance**: Optimize images and animations

### Component Consistency

1. **Colors**: Always use theme colors, never hardcoded values
2. **Shadows**: Use predefined shadow styles from theme
3. **Border Radius**: Use theme borderRadius constants
4. **Gradients**: Use predefined gradients from theme

## 🛠️ Advanced Usage

### Custom Component Generation

When generating new components from Figma:

```
"Create a React Native component from this Figma design that:
- Extends our existing component patterns
- Includes proper TypeScript definitions
- Uses our theme system consistently
- Follows React Native best practices
- Includes loading and error states
- Has proper accessibility support"
```

### Screen Integration

For new screens:

```
"Generate a complete React Native screen from this Figma design:
- Include navigation setup
- Connect to our API services
- Use our existing components
- Follow our screen structure pattern
- Include proper error handling
- Add loading states and pull-to-refresh"
```

### Data Visualization

For charts and graphs:

```
"Create data visualization components from this Figma design:
- Use our IrisChart component pattern
- Support multiple data formats
- Include interactive features
- Use IRIS brand colors for data points
- Make it responsive for different screen sizes
- Include proper legends and labels"
```

## 📚 Resources

### Files to Reference
- `src/theme/colors.ts` - Complete color palette
- `src/theme/typography.ts` - Typography scale
- `src/components/common/` - Existing components
- `src/screens/` - Screen examples

### Design Assets
- IRIS brand guidelines
- Mobile design patterns
- Component library in Figma
- Icon library

### Development Tools
- React Native documentation
- Expo documentation
- TypeScript best practices
- Mobile design guidelines (iOS/Android)

## 🎯 Best Practices

1. **Always start with Figma design** before coding
2. **Use existing components** whenever possible
3. **Follow the established patterns** in the codebase
4. **Test on both iOS and Android** simulators
5. **Consider accessibility** from the design phase
6. **Optimize for performance** on mobile devices
7. **Use TypeScript** for all new components
8. **Follow the theme system** consistently

This integration allows you to seamlessly convert Figma designs into production-ready React Native components that perfectly match your IRISeller mobile design system! 🎉
