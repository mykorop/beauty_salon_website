import { expect, test } from './fixtures';
import { homePath, locales, type Locale } from './support/public-pages';

const terms = {
  ro: {
    free: 'Platforma BookMe este gratuită pentru clienți, saloane și specialiști independenți.',
    payment: 'Serviciile rezervate se plătesc direct salonului sau specialistului',
    provider: 'Prestatorul răspunde pentru serviciul oferit',
    law: 'legislația Republicii Moldova',
    clientAge: 'cel puțin 16 ani', businessAge: 'cel puțin 18 ani', ageCheck: 'nu verifică tehnic vârsta',
    consent: 'nu reprezintă consimțământul clientului', liability: 'Nu excludem și nu limităm răspunderea', review: 'poți solicita reexaminarea',
    privacy: 'Politica de confidențialitate', deletion: 'Instrucțiuni de ștergere a contului', support: 'Contactează asistența',
  },
  en: {
    free: 'The BookMe platform is free for clients, salons and independent professionals.',
    payment: 'Booked services are paid for directly to the salon or professional',
    provider: 'The provider is responsible for the service they deliver',
    law: 'laws of the Republic of Moldova',
    clientAge: 'at least 16 years old', businessAge: 'at least 18 years old', ageCheck: 'do not technically verify age',
    consent: "is not the client's consent", liability: 'We do not exclude or limit liability', review: 'you may ask for a review',
    privacy: 'Privacy Policy', deletion: 'Account deletion instructions', support: 'Contact support',
  },
} satisfies Record<Locale, Record<string, string>>;

for (const locale of locales) {
  const prefix = homePath(locale);
  const text = terms[locale];

  test(`terms reader can identify the operator, provider and cost in ${locale}`, async ({ page }) => {
    await page.goto(`${prefix}terms.html`);
    const main = page.getByRole('main');
    await expect(main).toContainText('BOOKME HUB, SRL');
    await expect(main).toContainText('str. Glinka 4, ap./of. 10, Bălți, Moldova');
    await expect(main).toContainText('BookMe Business');
    await expect(main).toContainText('BookMe Salon');
    await expect(main).toContainText(text.free);
    await expect(main).toContainText(text.payment);
    await expect(main).toContainText(text.provider);
    await expect(main).toContainText(text.law);
    await expect(main.getByRole('link', { name: 'support@bookme.md', exact: true }).first()).toHaveAttribute('href', 'mailto:support@bookme.md');
  });

  test(`terms reader can find eligibility and protected rights in ${locale}`, async ({ page }) => {
    await page.goto(`${prefix}terms.html`);
    const main = page.getByRole('main');
    await expect(main).toContainText(text.clientAge);
    await expect(main).toContainText(text.businessAge);
    await expect(main).toContainText(text.ageCheck);
    await expect(main).toContainText(text.consent);
    await expect(main).toContainText(text.liability);
    await expect(main).toContainText(text.review);
  });

  test(`terms reader can reach privacy, deletion and support in ${locale}`, async ({ page }) => {
    for (const destination of [
      { name: text.privacy, path: 'privacy.html' },
      { name: text.deletion, path: 'delete-account.html' },
      { name: text.support, path: '#contact' },
    ]) {
      await page.goto(`${prefix}terms.html`);
      const link = page.getByRole('main').getByRole('link', { name: destination.name, exact: true });
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(`${prefix}${destination.path}`);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      if (destination.path === '#contact') await expect(page.locator('#contact')).toBeInViewport();
      else await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });
}
