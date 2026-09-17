import { expect, test } from '@playwright/test';

const endpoint = 'https://formbold.com/s/oD7mJ';

for (const language of [
  { path: '/', name: 'Numele tău', email: 'Adresa de e-mail', message: 'Cum te putem ajuta?', send: 'Trimite mesajul', sent: 'Trimis!', error: 'Eroare — Încearcă din nou' },
  { path: '/en/', name: 'Your name', email: 'Email address', message: 'How can we help?', send: 'Send message', sent: 'Sent!', error: 'Error — Try again' },
]) {
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

  test(`failed contact submission in ${language.path} allows retry without losing the message`, async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled, 'Without JavaScript the browser submits directly to FormBold.');
    await page.route(endpoint, (route) => route.fulfill({ status: 500, body: '{}' }));
    await page.goto(language.path);
    await page.getByRole('textbox', { name: language.name, exact: true }).fill('Website smoke test');
    await page.getByRole('textbox', { name: language.email, exact: true }).fill('smoke@example.com');
    const message = page.getByRole('textbox', { name: language.message, exact: true });
    await message.fill('Keep this message');
    await page.getByRole('button', { name: language.send, exact: true }).click();
    await expect(page.getByRole('status')).toHaveText(language.error);
    await expect(message).toHaveValue('Keep this message');
    await expect(page.getByRole('button', { name: language.send, exact: true })).toBeEnabled();
  });
}
