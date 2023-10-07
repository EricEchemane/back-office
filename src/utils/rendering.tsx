export function renderIf(node: React.ReactNode, ...conditions: any[]) {
  return conditions.every(Boolean) ? node : null;
}
