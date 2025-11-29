# LooksMax Welcome Screen Assets

## Logo Image Placement

To complete the Welcome screen, please place your logo/illustration image at:

```
frontend/src/assets/images/welcome-logo.png
```

### Image Specifications:
- **Format**: PNG (with transparent background recommended)
- **Size**: 400x400px minimum (for high-DPI displays)
- **Content**: The glowing man profile with razor and dumbbell illustration shown in your reference

### Directory Structure:
```
LooksMaxApp/
└── frontend/
    └── src/
        └── assets/
            └── images/
                └── welcome-logo.png  ← Place your image here
```

The WelcomeScreen component is already configured to display this image once you add it.

## To Use the Image in Code:

Once you place the image, update `WelcomeScreen.js` to import and display it:

```javascript
// At the top of WelcomeScreen.js
import welcomeLogo from '../assets/images/welcome-logo.png';

// Replace the logoPlaceholder View with:
<Image source={welcomeLogo} style={{ width: 200, height: 200 }} resizeMode="contain" />
```

## Current State:
The Welcome screen currently shows a placeholder with blueprint styling that matches your theme. Once you add the logo image, it will be displayed with the glowing animation effect.
