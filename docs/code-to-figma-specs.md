# Code → Figma Design Specifications

## 📱 Analytics Screen Design Specification

Based on the `AnalyticsScreen.tsx` component, here's a detailed Figma design specification:

### 🎨 **Frame Setup**
- **Device**: iPhone 14 (390x844px) or create custom mobile frame
- **Background**: `#F9FAFB` (colors.background.secondary)

### 📐 **Layout Structure**

#### **1. Header Section** (Fixed at top)
```
Component: LinearGradient Header
- Height: 120px
- Gradient: #06868D → #265E5A (turquoise to peacock)
- Border Radius: Bottom corners 24px
- Padding: 16px horizontal, 24px vertical

Text Elements:
- Title: "Analytics Dashboard"
  - Font: Bold, 18px, White
  - Position: Top left of header
- Subtitle: "Track your sales performance"
  - Font: Regular, 14px, White (90% opacity)
  - Position: Below title, 4px spacing
```

#### **2. Period Selector** (Below header)
```
Component: Button Group
- Position: 16px from header, 16px horizontal margins
- Layout: 3 buttons in row with equal spacing
- Gap: 8px between buttons

Button Specs:
- Size: Flexible width, 32px height
- Active State: #06868D background, white text
- Inactive State: Transparent background, #06868D border (2px), #06868D text
- Border Radius: 16px
- Font: Medium, 14px
- Labels: "7 Days", "30 Days", "90 Days"
```

#### **3. Metrics Grid** (2x2 layout)
```
Component: Card Grid
- Layout: 2 columns, 2 rows
- Card Size: (Screen width - 48px) / 2 per card
- Gap: 16px between cards
- Margin: 16px from screen edges

Individual Metric Card:
- Background: White (#FFFFFF)
- Border Radius: 12px
- Padding: 16px
- Shadow: 0px 2px 4px rgba(6, 134, 141, 0.1)

Card Content:
- Header Row (space between):
  - Title: "Total Revenue" (etc.)
    - Font: Regular, 12px, #153539
  - Trend Badge: "+12.5%" or "-3.2%"
    - Background: #10B981 (green) or #EF4444 (red)
    - Padding: 4px 8px
    - Border Radius: 4px
    - Font: Medium, 10px, White
- Value: "$125,430" (etc.)
  - Font: Bold, 20px, #06868D
  - Margin Top: 8px

Data for Cards:
1. Total Revenue: $125,430, +12.5% (green)
2. Active Leads: 847, -3.2% (red)
3. Conversion Rate: 24.8%, +5.1% (green)
4. AI Agent Tasks: 1,234, +18.7% (green)
```

#### **4. Chart Section**
```
Component: Chart Card
- Position: Below metrics grid, 16px spacing
- Margin: 16px horizontal
- Background: White
- Border Radius: 12px
- Padding: 16px
- Shadow: 0px 2px 4px rgba(6, 134, 141, 0.1)

Content:
- Title: "Revenue Trend"
  - Font: Semibold, 16px, #06868D
  - Margin Bottom: 16px
- Chart Placeholder:
  - Size: Full width, 200px height
  - Background: #F9FAFB
  - Border: 2px dashed #E5E7EB
  - Border Radius: 8px
  - Center Text: "Chart component will be rendered here"
    - Font: Regular, 14px, #6B7280
  - Subtext: "(Generated from Figma design)"
    - Font: Regular, 12px, #9CA3AF
```

#### **5. Action Buttons** (Bottom section)
```
Component: Button Stack
- Position: Below chart, 16px spacing
- Margin: 16px horizontal, 24px bottom
- Layout: Vertical stack
- Gap: 12px between buttons

Button 1: Export Report
- Style: Outline button
- Width: Full width
- Height: 44px
- Border: 2px solid #06868D
- Background: Transparent
- Text: #06868D, Medium, 16px
- Border Radius: 12px

Button 2: View Details
- Style: Gradient button
- Width: Full width
- Height: 44px
- Gradient: #06868D → #265E5A
- Text: White, Medium, 16px
- Border Radius: 12px
- Shadow: 0px 4px 8px rgba(6, 134, 141, 0.15)
```

## 🎨 **Color Reference**

```css
/* IRIS Brand Colors */
--turquoise: #06868D     /* Primary brand */
--peacock: #265E5A       /* Secondary */
--plex-blue: #2EE5EA     /* Accent */
--off-black: #09171F     /* Dark text */
--inky-blue: #153539     /* Secondary text */
--sky: #A0B8D0          /* Light accent */

/* Status Colors */
--success: #10B981       /* Green for positive trends */
--error: #EF4444         /* Red for negative trends */

/* Neutral Colors */
--white: #FFFFFF
--gray-50: #F9FAFB      /* Light background */
--gray-200: #E5E7EB     /* Light border */
--gray-500: #6B7280     /* Medium text */
--gray-400: #9CA3AF     /* Light text */
```

## 🔧 **How to Create in Figma**

### Step 1: Setup
1. Create new file in Figma
2. Add iPhone 14 frame (390x844px)
3. Set up color styles using the IRIS palette above

### Step 2: Build Components
1. **Create Header Component**
   - Rectangle with gradient fill
   - Add corner radius (bottom only)
   - Add text layers for title and subtitle

2. **Create Button Components**
   - Primary button (gradient)
   - Outline button (border only)
   - Small button for period selector
   - Make them reusable components

3. **Create Card Component**
   - White rectangle with shadow
   - Text layers for title and value
   - Badge component for trend indicator

4. **Create Chart Placeholder**
   - Dashed border rectangle
   - Placeholder text

### Step 3: Assemble Screen
1. Place header at top
2. Add period selector buttons
3. Create 2x2 grid of metric cards
4. Add chart card
5. Place action buttons at bottom

### Step 4: Add Interactions (Optional)
1. Button hover states
2. Period selector active states
3. Card hover effects

## 🚀 **Alternative Workflows**

### **Option 1: AI Design Description**
Use this specification to prompt an AI design tool:

```
"Create a mobile analytics dashboard design with:
- Gradient header in teal colors (#06868D to #265E5A)
- 2x2 grid of metric cards showing revenue, leads, conversion rate
- Chart section with placeholder
- Action buttons at bottom
- Use IRIS brand colors and modern mobile design patterns"
```

### **Option 2: Component Library Approach**
1. Build reusable components in Figma first
2. Create design system with IRIS colors
3. Use components to quickly assemble new screens
4. Generate code from these designs using MCP

### **Option 3: Figma Plugin Integration**
Look into Figma plugins that can:
- Import design tokens from code
- Generate designs from component specifications
- Sync design systems between code and Figma

## 📋 **Design Checklist**

- [ ] Frame size matches target device
- [ ] All colors use IRIS brand palette
- [ ] Typography follows mobile guidelines
- [ ] Touch targets are minimum 44px
- [ ] Spacing is consistent (8px grid)
- [ ] Components are reusable
- [ ] Shadows and effects are subtle
- [ ] Design works in light mode
- [ ] Consider dark mode variant

This specification allows you to recreate the exact design in Figma manually, then use the MCP integration for future iterations and refinements!
