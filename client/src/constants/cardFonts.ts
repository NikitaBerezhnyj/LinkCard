export interface CardFontOption {
  value: string;
  label: string;
  previewFamily: string;
}

export const CARD_FONT_OPTIONS: CardFontOption[] = [
  {
    value: "var(--font-manrope), sans-serif",
    label: "Manrope — сучасний",
    previewFamily: "var(--font-manrope), sans-serif"
  },
  {
    value: "var(--font-piazzolla), serif",
    label: "Piazzolla — елегантний",
    previewFamily: "var(--font-piazzolla), serif"
  },
  {
    value: "var(--font-jetbrains-mono), monospace",
    label: "JetBrains Mono — технічний",
    previewFamily: "var(--font-jetbrains-mono), monospace"
  },
  {
    value: "var(--font-unbounded), sans-serif",
    label: "Unbounded — сміливий",
    previewFamily: "var(--font-unbounded), sans-serif"
  },
  {
    value: "var(--font-caveat), cursive",
    label: "Caveat — рукописний",
    previewFamily: "var(--font-caveat), cursive"
  },
  {
    value: "var(--font-rubik), sans-serif",
    label: "Rubik — дружній",
    previewFamily: "var(--font-rubik), sans-serif"
  }
];

export const DEFAULT_CARD_FONT = CARD_FONT_OPTIONS[0].value;
