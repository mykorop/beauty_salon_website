import { expect, test } from '@playwright/test';

for (const locale of ['ro', 'en']) {
  const prefix = locale === 'ro' ? '/' : '/en/';

  test(`terms reader can identify the operator, provider and cost in ${locale}`, async ({ page }) => {
    await page.goto(`${prefix}terms.html`);
    const main = page.getByRole('main');
    await expect(main).toContainText('BOOKME HUB, SRL');
    await expect(main).toContainText('str. Glinka 4, ap./of. 10, Bălți, Moldova');
    await expect(main).toContainText('BookMe Business');
    await expect(main).toContainText('BookMe Salon');
    await expect(main).toContainText(locale === 'ro'
      ? 'Platforma BookMe este gratuită pentru clienți, saloane și specialiști independenți.'
      : 'The BookMe platform is free for clients, salons and independent professionals.');
    await expect(main).toContainText(locale === 'ro'
      ? 'Serviciile rezervate se plătesc direct salonului sau specialistului'
      : 'Booked services are paid for directly to the salon or professional');
    await expect(main).toContainText(locale === 'ro'
      ? 'Prestatorul răspunde pentru serviciul oferit'
      : 'The provider is responsible for the service they deliver');
    await expect(main).toContainText(locale === 'ro' ? 'legislația Republicii Moldova' : 'laws of the Republic of Moldova');
    await expect(main.getByRole('link', { name: 'support@bookme.md', exact: true }).first()).toHaveAttribute('href', 'mailto:support@bookme.md');
  });

  test(`terms reader can find eligibility and protected rights in ${locale}`, async ({ page }) => {
    await page.goto(`${prefix}terms.html`);
    const main = page.getByRole('main');
    await expect(main).toContainText(locale === 'ro' ? 'cel puțin 16 ani' : 'at least 16 years old');
    await expect(main).toContainText(locale === 'ro' ? 'cel puțin 18 ani' : 'at least 18 years old');
    await expect(main).toContainText(locale === 'ro' ? 'nu verifică tehnic vârsta' : 'do not technically verify age');
    await expect(main).toContainText(locale === 'ro' ? 'nu reprezintă consimțământul clientului' : "is not the client's consent");
    await expect(main).toContainText(locale === 'ro' ? 'Nu excludem și nu limităm răspunderea' : 'We do not exclude or limit liability');
    await expect(main).toContainText(locale === 'ro' ? 'poți solicita reexaminarea' : 'you may ask for a review');
  });

  test(`terms reader can reach privacy, deletion and support in ${locale}`, async ({ page }) => {
    for (const destination of [
      { name: locale === 'ro' ? 'Politica de confidențialitate' : 'Privacy Policy', path: 'privacy.html' },
      { name: locale === 'ro' ? 'Instrucțiuni de ștergere a contului' : 'Account deletion instructions', path: 'delete-account.html' },
      { name: locale === 'ro' ? 'Contactează asistența' : 'Contact support', path: '#contact' },
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
