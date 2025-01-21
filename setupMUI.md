To set up Material-UI (MUI) in your current React application, follow these steps:

---

### **1. Install MUI Core**

Install the core MUI library and its peer dependencies:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

Or with Yarn:

```bash
yarn add @mui/material @emotion/react @emotion/styled
```

---

### **2. (Optional) Install MUI Icons**

If you plan to use Material-UI icons, install the `@mui/icons-material` package:

```bash
npm install @mui/icons-material
```

Or with Yarn:

```bash
yarn add @mui/icons-material
```

---

### **3. Add MUI's Roboto Font**

Material-UI recommends using the Roboto font. You can include it in your project by adding this link tag to your `index.html` file in the `<head>` section:

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>
```

Or install the font via `npm`:

```bash
npm install typeface-roboto --save
```

Then import it in your `src/index.js` or `src/index.tsx`:

```javascript
import "typeface-roboto";
```

---

### **4. Apply MUI Theme (Optional)**

To customize your app's theme, create a theme using MUI's `createTheme` and apply it using the `ThemeProvider` component.

#### Example: Setting up a custom theme

1. Import necessary modules:

   ```javascript
   import React from "react";
   import ReactDOM from "react-dom";
   import { ThemeProvider, createTheme } from "@mui/material/styles";
   import App from "./App";
   ```

2. Create a theme:

   ```javascript
   const theme = createTheme({
     palette: {
       primary: {
         main: "#1976d2", // Customize your primary color
       },
       secondary: {
         main: "#dc004e", // Customize your secondary color
       },
     },
   });
   ```

3. Wrap your app with the `ThemeProvider`:
   ```javascript
   ReactDOM.render(
     <ThemeProvider theme={theme}>
       <App />
     </ThemeProvider>,
     document.getElementById("root")
   );
   ```

---

### **5. Use MUI Components**

You can now start using MUI components in your application. For example:

```javascript
import React from "react";
import { Button } from "@mui/material";

const App = () => (
  <div>
    <Button variant="contained" color="primary">
      Hello Material-UI
    </Button>
  </div>
);

export default App;
```

---

### **6. (Optional) Setup MUI Styles**

For custom styling, MUI offers a powerful system based on `@emotion`. You can use the `styled` API or the `sx` prop for styling components.

#### Using `sx` Prop:

```javascript
<Button sx={{ backgroundColor: "primary.main", color: "white" }}>
  Styled Button
</Button>
```

#### Using `styled` API:

```javascript
import { styled } from "@mui/material/styles";

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "white",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const App = () => <CustomButton>Styled Button</CustomButton>;
```

---

You’re all set! You can now use Material-UI in your React application. For more components and customization options, refer to the [MUI documentation](https://mui.com/). 😊
