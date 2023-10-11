export function formatDate(
  date: string,
  locale: Intl.LocalesArgument = 'en-ph',
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
) {
  return new Date(date).toLocaleDateString(locale, options);
}
