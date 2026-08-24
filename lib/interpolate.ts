export function interpolate(template: string, data: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(data[key] ?? `{${key}}`));
}
