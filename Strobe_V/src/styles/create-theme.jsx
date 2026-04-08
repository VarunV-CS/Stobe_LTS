import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

import { colorSchemes } from './color-schemes';
// import { components } from './components/components';
import { shadows } from './shadows';
// import type { Theme } from './types';
import { typography } from './typography';

export function createTheme() {
    const theme = extendTheme({
      breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1440 } },
    //   components,
      colorSchemes,
      shadows,
      shape: { borderRadius: 8 },
      typography,
    });
  
    return theme;
  }