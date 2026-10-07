import { expect, test } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
import { homePath, linkPath, locales, type Locale } from './support/public-pages';

const faqs = {
  ro: {
    title: 'Întrebări frecvente', deletion: 'Vezi pașii pentru ștergerea contului',
    questions: [
      { question: 'Ce aplicație să aleg?', answer: /BookMe Business.*deschide în browser, la business\.bookme\.md\. Contul de afaceri funcționează în BookMe Business, nu în aplicația pentru clienți\..*BookMe Salon/ },
      { question: 'Unde pot folosi BookMe?', answer: /Moldova/ },
      { question: 'BookMe este gratuit?', answer: /gratuită pentru clienți, saloane și specialiști independenți/ },
      { question: 'Cum plătesc serviciile rezervate?', answer: /direct salonului sau specialistului/ },
      { question: 'Am nevoie de un cont?', answer: /cont.*programările/ },
      { question: 'Cum îmi șterg contul și datele?', answer: /ștergerea din aplicație.*support@bookme.md/ },
    ],
  },
  ru: {
    title: 'Частые вопросы', deletion: 'Посмотреть шаги удаления аккаунта',
    questions: [
      { question: 'Какое приложение выбрать?', answer: /BookMe Business.*открыть в браузере по адресу business\.bookme\.md\. Бизнес-аккаунт работает в BookMe Business, а не в клиентском приложении\..*BookMe Salon/ },
      { question: 'Где можно пользоваться BookMe?', answer: /Молдовы/ },
      { question: 'BookMe бесплатный?', answer: /бесплатна для клиентов, салонов и независимых мастеров/ },
      { question: 'Как оплатить забронированные услуги?', answer: /напрямую салону или мастеру/ },
      { question: 'Нужен ли аккаунт?', answer: /Аккаунт.*записями/ },
      { question: 'Как удалить аккаунт и данные?', answer: /Удаление можно запросить в приложении.*support@bookme.md/ },
    ],
  },
  en: {
    title: 'Frequently asked questions', deletion: 'See the account deletion steps',
    questions: [
      { question: 'Which app should I choose?', answer: /BookMe Business.*open it in your browser at business\.bookme\.md\. Your business account works in BookMe Business, not in the client app\..*BookMe Salon/ },
      { question: 'Where can I use BookMe?', answer: /Moldova/ },
      { question: 'Is BookMe free?', answer: /free for clients, salons and independent professionals/ },
      { question: 'How do I pay for booked services?', answer: /directly to the salon or professional/ },
      { question: 'Do I need an account?', answer: /account.*appointments/ },
      { question: 'How do I delete my account and data?', answer: /deletion in the app.*support@bookme.md/ },
    ],
  },
} satisfies Record<Locale, { title: string; deletion: string; questions: { question: string; answer: RegExp }[] }>;

for (const locale of locales) {
  const language = { path: homePath(locale), ...faqs[locale] };
  test(`FAQ on ${language.path} opens and closes by keyboard, including without JavaScript`, async ({ page, javaScriptEnabled }) => {
    const response = await page.goto(language.path);
    const faq = page.getByRole('region', { name: language.title, exact: true });
    await expect(faq).toBeVisible();
    const html = await response!.text();
    for (const { question, answer } of language.questions) {
      expect(html).toContain(question);
      const disclosure = faq.getByText(question, { exact: true });
      const content = faq.getByText(answer);
      await expect(content).toBeHidden();
      await disclosure.focus();
      await expect(disclosure).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(content).toBeVisible();
      await page.keyboard.press('Space');
      await expect(content).toBeHidden();
      await page.keyboard.press('Enter');
    }
    await expect(faq.getByRole('link', { name: language.deletion })).toHaveAttribute('href', linkPath(locale, 'delete-account'));
    if (javaScriptEnabled) {
      const results = await new AxeBuilder({ page }).include('#faq').analyze();
      expect(results.violations).toEqual([]);
    }
  });
}
