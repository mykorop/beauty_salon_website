import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const endpoint = 'https://formbold.com/s/oD7mJ';

// A fallback interceptor keeps every test away from the real support inbox.
test.beforeEach(async ({ page }) => {
  await page.route(endpoint, (route) => route.abort());
});

for (const language of [
  {
    path: '/', name: 'Numele tău', email: 'Adresa de e-mail', message: 'Cum te putem ajuta?', send: 'Trimite mesajul',
    sending: 'Se trimite mesajul…', sent: 'Mesajul tău a fost trimis. Îți mulțumim că ne-ai scris!',
    error: 'Nu am putut confirma trimiterea mesajului. Datele introduse au fost păstrate. Încearcă din nou sau scrie la support@bookme.md.',
    invalid: 'Verifică numele și adresa de e-mail înainte de a trimite.',
    nameError: 'Introdu numele tău.', emailError: 'Introdu o adresă de e-mail validă.',
    privacy: 'Politica de confidențialitate',
    formNote: 'Numele, adresa de e-mail și mesajul sunt transmise prin FormBold echipei BookMe pentru a răspunde solicitării tale.',
  },
  {
    path: '/en/', name: 'Your name', email: 'Email address', message: 'How can we help?', send: 'Send message',
    sending: 'Sending your message…', sent: 'Your message has been sent. Thank you for contacting BookMe!',
    error: 'We could not confirm your message was sent. Your text has been kept. Try again or email support@bookme.md.',
    invalid: 'Check your name and email address before sending.',
    nameError: 'Enter your name.', emailError: 'Enter a valid email address.',
    privacy: 'Privacy Policy',
    formNote: 'Your name, email address and message are sent through FormBold to the BookMe team to respond to your request.',
  },
]) {
  test(`support alternatives on ${language.path} stay available without JavaScript`, async ({ page, javaScriptEnabled }) => {
    await page.goto(language.path);
    const contact = page.locator('#contact');
    await expect(contact.getByText(language.formNote, { exact: false })).toBeVisible();
    await expect(contact.getByRole('link', { name: language.privacy })).toHaveAttribute('href', `${language.path}privacy.html`);
    await expect(contact.getByRole('link', { name: 'support@bookme.md', exact: true })).toHaveAttribute('href', 'mailto:support@bookme.md');
    await expect(contact.getByRole('status')).toBeEmpty();
    if (javaScriptEnabled) {
      expect((await new AxeBuilder({ page }).include('#contact').analyze()).violations).toEqual([]);
    }
  });

  test(`contact validation in ${language.path} explains errors before sending`, async ({ page, javaScriptEnabled }) => {
    let requests = 0;
    await page.route(endpoint, (route) => {
      requests += 1;
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });
    await page.goto(language.path);
    const name = page.getByRole('textbox', { name: language.name, exact: true });
    const email = page.getByRole('textbox', { name: language.email, exact: true });
    const send = page.getByRole('button', { name: language.send, exact: true });
    await send.click();
    await expect(name).toBeFocused();
    if (javaScriptEnabled) {
      await expect(page.getByRole('status')).toHaveText(language.invalid);
      await expect(name).toHaveAttribute('aria-invalid', 'true');
      await expect(name).toHaveAccessibleDescription(language.nameError);
      await expect(email).toHaveAccessibleDescription(language.emailError);
      expect((await new AxeBuilder({ page }).include('#contact').analyze()).violations).toEqual([]);
    } else {
      await expect(page.getByRole('status')).toBeEmpty();
    }
    expect(requests).toBe(0);
    await name.fill('   ');
    await send.click();
    await expect(name).toBeFocused();
    expect(requests).toBe(0);
    await name.fill('Website smoke test');
    await email.fill('invalid-address');
    await send.click();
    await expect(email).toBeFocused();
    expect(requests).toBe(0);
    if (javaScriptEnabled) {
      await expect(name).not.toHaveAttribute('aria-invalid', 'true');
      await expect(email).toHaveAttribute('aria-invalid', 'true');
      await email.fill('smoke@example.com');
      await send.click();
      await expect(page.getByRole('status')).toHaveText(language.sent);
      expect(requests).toBe(1);
    }
  });

  test(`contact form in ${language.path} keeps the FormBold POST contract`, async ({ page, javaScriptEnabled }) => {
    // Fulfill at the external boundary: never send test messages to the real inbox.
    await page.route(endpoint, (route) => route.fulfill({
      status: 200,
      contentType: javaScriptEnabled ? 'application/json' : 'text/html',
      body: javaScriptEnabled ? '{"success":true}' : '<p>Received</p>',
    }));
    await page.goto(language.path);
    const name = page.getByRole('textbox', { name: language.name, exact: true });
    const email = page.getByRole('textbox', { name: language.email, exact: true });
    const message = page.getByRole('textbox', { name: language.message, exact: true });
    await expect(name).toHaveAttribute('name', 'name');
    await expect(email).toHaveAttribute('name', 'email');
    await expect(message).toHaveAttribute('name', 'message');
    await expect(name).toHaveAttribute('autocomplete', 'name');
    await expect(email).toHaveAttribute('autocomplete', 'email');
    await expect(name).toHaveAttribute('required', '');
    await expect(email).toHaveAttribute('required', '');
    await expect(message).not.toHaveAttribute('required', '');
    await name.fill('Website smoke test');
    await email.fill('smoke@example.com');
    await message.fill('Contract check');

    const requestPromise = page.waitForRequest(endpoint);
    await page.getByRole('button', { name: language.send, exact: true }).click();
    const request = await requestPromise;
    expect(request.method()).toBe('POST');
    const body = request.postData() ?? '';
    if (javaScriptEnabled) {
      expect(request.headers().accept).toBe('application/json');
      expect(request.headers()['content-type']).toContain('multipart/form-data');
      for (const [field, value] of [['name', 'Website smoke test'], ['email', 'smoke@example.com'], ['message', 'Contract check']]) {
        expect(body).toContain(`name="${field}"\r\n\r\n${value}`);
      }
      await expect(page.getByRole('status')).toHaveText(language.sent);
      await expect(name).toHaveValue('');
    } else {
      expect(Object.fromEntries(new URLSearchParams(body))).toEqual({ name: 'Website smoke test', email: 'smoke@example.com', message: 'Contract check' });
      await expect(page).toHaveURL(endpoint);
    }
  });

  test(`pending contact submission in ${language.path} blocks duplicates and allows another message after success`, async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled, 'Without JavaScript the browser submits directly to FormBold.');
    let requests = 0;
    let releaseResponse!: () => void;
    const responseReady = new Promise<void>((resolve) => { releaseResponse = resolve; });
    await page.route(endpoint, async (route) => {
      requests += 1;
      await responseReady;
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });
    await page.goto(language.path);
    const name = page.getByRole('textbox', { name: language.name, exact: true });
    const email = page.getByRole('textbox', { name: language.email, exact: true });
    const message = page.getByRole('textbox', { name: language.message, exact: true });
    const send = page.getByRole('button', { name: language.send, exact: true });
    const status = page.getByRole('status');
    await name.fill('Website smoke test');
    await email.fill('smoke@example.com');
    await message.fill('Delayed message');
    await send.click();
    try {
      await expect(status).toHaveText(language.sending);
      await expect(status).toHaveAttribute('aria-live', 'polite');
      await expect(status).toHaveAttribute('aria-atomic', 'true');
      await expect(send).toBeDisabled();
      await expect(name).toHaveValue('Website smoke test');
      await expect(email).toHaveValue('smoke@example.com');
      await expect(message).toHaveValue('Delayed message');
      // Enter exercises implicit resubmission while the network response is held.
      await name.press('Enter');
      expect((await new AxeBuilder({ page }).include('#contact').analyze()).violations).toEqual([]);
      expect(requests).toBe(1);
      await expect(status).toHaveText(language.sending);
    } finally {
      releaseResponse();
    }
    await expect(status).toHaveText(language.sent);
    for (const field of [name, email, message]) await expect(field).toHaveValue('');
    await expect(send).toBeEnabled();
    expect((await new AxeBuilder({ page }).include('#contact').analyze()).violations).toEqual([]);

    await name.fill('Website smoke test');
    await email.fill('smoke@example.com');
    await message.fill('Another message');
    await send.click();
    await expect(message).toHaveValue('');
    await expect(status).toHaveText(language.sent);
    await expect(send).toBeEnabled();
    expect(requests).toBe(2);
  });

  for (const failure of ['server', 'network']) {
    test(`${failure} failure in ${language.path} preserves every field and allows a successful retry`, async ({ page, javaScriptEnabled }) => {
      test.skip(!javaScriptEnabled, 'Without JavaScript the browser submits directly to FormBold.');
      let requests = 0;
      await page.route(endpoint, (route) => {
        requests += 1;
        if (requests === 1) {
          return failure === 'network' ? route.abort('failed') : route.fulfill({ status: 500, body: '{}' });
        }
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
      });
      await page.goto(language.path);
      const name = page.getByRole('textbox', { name: language.name, exact: true });
      const email = page.getByRole('textbox', { name: language.email, exact: true });
      const message = page.getByRole('textbox', { name: language.message, exact: true });
      const send = page.getByRole('button', { name: language.send, exact: true });
      await name.fill('Website smoke test');
      await email.fill('smoke@example.com');
      await message.fill('Keep this message');
      await send.click();
      await expect(page.getByRole('status')).toHaveText(language.error);
      await expect(name).toHaveValue('Website smoke test');
      await expect(email).toHaveValue('smoke@example.com');
      await expect(message).toHaveValue('Keep this message');
      await expect(send).toBeEnabled();
      await expect(page.locator('#contact').getByRole('link', { name: 'support@bookme.md' })).toBeVisible();
      expect((await new AxeBuilder({ page }).include('#contact').analyze()).violations).toEqual([]);
      await send.click();
      await expect(page.getByRole('status')).toHaveText(language.sent);
      for (const field of [name, email, message]) await expect(field).toHaveValue('');
      await expect(send).toBeEnabled();
      expect(requests).toBe(2);
    });
  }
}
