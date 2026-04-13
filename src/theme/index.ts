export const colors = {
  // Surfaces
  background:               '#f4f6ff',
  surface:                  '#f4f6ff',
  surfaceContainerLowest:   '#ffffff',
  surfaceContainerLow:      '#eaf1ff',
  surfaceContainer:         '#dce9ff',
  surfaceContainerHigh:     '#d3e4ff',
  surfaceContainerHighest:  '#c9deff',

  // Text
  onBackground:             '#13304f',
  onSurface:                '#13304f',
  onSurfaceVariant:         '#435d7f',
  outline:                  '#5f789c',
  outlineVariant:           '#95afd5',

  // Primary (blue)
  primary:                  '#17618b',
  primaryDim:               '#00557d',
  primaryFixed:             '#90cdfd',
  primaryContainer:         '#90cdfd',
  onPrimary:                '#eaf4ff',
  onPrimaryContainer:       '#004466',

  // Secondary (green)
  secondary:                '#006b1f',
  secondaryContainer:       '#8df48e',
  onSecondaryContainer:     '#005c19',

  // Tertiary (soft violet)
  tertiary:                 '#595a6b',
  tertiaryContainer:        '#e6e6fa',

  // Error
  error:                    '#b31b25',
  errorContainer:           '#fb5151',
  onError:                  '#ffefee',

  white:                    '#ffffff',
  black:                    '#000f22',
};

export const typography = {
  displaySmall:   { fontSize: 36, fontWeight: '700' as const },
  headlineLarge:  { fontSize: 32, fontWeight: '600' as const },
  headlineMedium: { fontSize: 28, fontWeight: '600' as const },
  headlineSmall:  { fontSize: 24, fontWeight: '600' as const },
  titleLarge:     { fontSize: 22, fontWeight: '500' as const },
  titleMedium:    { fontSize: 16, fontWeight: '500' as const },
  bodyLarge:      { fontSize: 16, fontWeight: '400' as const },
  bodyMedium:     { fontSize: 14, fontWeight: '400' as const },
  labelLarge:     { fontSize: 14, fontWeight: '500' as const },
  labelSmall:     { fontSize: 11, fontWeight: '300' as const },
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const radius = {
  sm:   8,
  md:   16,
  lg:   32,
  xl:   48,
  full: 9999,
};
