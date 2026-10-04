export const markdownSlug = (title?: string) =>
  title
    ? title
        .trim()
        .toLowerCase()
        .replace(/[/:]/g, '')
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/-+/g, '-')
    : undefined;
