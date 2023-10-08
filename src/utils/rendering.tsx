export function renderIf(node: React.ReactNode, ...conditions: boolean[]) {
  return conditions.every(Boolean) ? node : null;
}
