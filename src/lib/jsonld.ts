/**
 * Серіалізація JSON-LD для <script type="application/ld+json">.
 * `<` замінюємо на <, щоб текст із назви чи опису товару не міг закрити тег (рекомендація Next.js).
 */
export function ldJson(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
