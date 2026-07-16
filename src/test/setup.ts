import "@testing-library/jest-dom";

const WIDTH_SM = 576,
  WIDTH_MD = 768,
  WIDTH_LG = 992,
  WIDTH_XL = 1200,
  WIDTH_XXL = 1600,
  QUERY_SM = "(min-width: 576px)",
  QUERY_MD = "(min-width: 768px)",
  QUERY_LG = "(min-width: 992px)",
  QUERY_XL = "(min-width: 1200px)",
  QUERY_XXL = "(min-width: 1600px)",
  DEFAULT_MIN_WIDTH = 0,
  QUERY_WIDTH_MAP: Record<string, number> = {
    [QUERY_LG]: WIDTH_LG,
    [QUERY_MD]: WIDTH_MD,
    [QUERY_SM]: WIDTH_SM,
    [QUERY_XL]: WIDTH_XL,
    [QUERY_XXL]: WIDTH_XXL,
  },
  noop = (): void => {
    // Mock empty implementation
  },
  getMinWidth = (query: string): number => QUERY_WIDTH_MAP[query] ?? DEFAULT_MIN_WIDTH;

Object.defineProperty(window, "matchMedia", {
  value: (query: string): MediaQueryList => {
    const minWidth = getMinWidth(query),
      matches = window.innerWidth >= minWidth;

    return {
      addEventListener: noop,
      addListener: noop,
      dispatchEvent: (): boolean => true,
      matches,
      media: query,
      onchange: null,
      removeEventListener: noop,
      removeListener: noop,
    };
  },
  writable: true,
});
