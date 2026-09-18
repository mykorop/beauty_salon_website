// Visual reference harness only. Run the sibling apps on :4200 and :4201 first.
// Uses the actual local Angular views. All remote requests are intercepted; the
// in-memory session below is synthetic and cannot authenticate against an API.
import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const business = process.argv.includes('--business');
const out = business ? 'design/calendar-demo/references' : 'design/booking-demo/references';
await mkdir(out, { recursive: true });
const service = { serviceId: 'demo-service', name: 'Manicure', description: '', category: 'manicure', durationMinutes: 60, price: 300, currency: 'MDL', priceUnit: 'fixed', isActive: true };
const master = { masterId: 'demo-master', masterName: 'Mara Luca', masterAvatar: '', specialization: 'manicure', specializationName: 'Manicure', rating: 0, reviewCount: 0, bookingForwardDays: 60, isIndependent: false, joinedAt: '2026-01-01', status: 'ACTIVE', services: [service] };
const salon = { salonId: 'demo-salon', name: 'Studio Luma', description: 'Fictional demonstration salon', addressStreet: 'Strada Exemplu', addressHouseNumber: '15', addressCity: 'Chișinău', addressCityCode: 'chisinau', addressZipCode: 'MD-2000', email: 'salon@example.test', phone: '+37360000000', imagesUrls: [], rating: 0, reviewCount: 0, minPrice: 300, maxPrice: 300, currency: 'MDL', isActive: true, createdAt: '2026-01-01', bookingForwardDays: 60, bufferMinutes: 0, services: [service], serviceMasters: [{ masterId: master.masterId, services: [service] }], masters: [master], salonHours: [], scheduleMasters: [], categories: [], currencies: ['MDL'], specializations: [] };
const appointment = { appointmentId: 'demo-booking', salonId: salon.salonId, salonName: salon.name, masterId: master.masterId, masterName: master.masterName, status: 'CONFIRMED', startTime: '2026-10-15T11:30:00.000Z', endTime: '2026-10-15T12:30:00.000Z', totalDurationMinutes: 60, services: [service], totalPrice: 300, currency: 'MDL', timezone: 'Europe/Chisinau', address: 'Strada Exemplu 15, Chișinău', createdAt: '2026-09-18T08:00:00Z', clientId: 'demo-client', clientName: 'Ana Demo', clientPhone: '+37360000000' };
const weekAppointment = { ...appointment, appointmentId: 'demo-week', clientId: 'demo-daria', clientName: 'Daria Demo', startTime: '2026-10-16T07:00:00.000Z', endTime: '2026-10-16T07:30:00.000Z', totalDurationMinutes: 30, totalPrice: 200, services: [{ ...service, name: 'Haircut', durationMinutes: 30, price: 200 }] };
const monthAppointment = { ...appointment, appointmentId: 'demo-month', clientId: 'demo-irina', clientName: 'Irina Demo', startTime: '2026-10-22T08:00:00.000Z', endTime: '2026-10-22T08:45:00.000Z', totalDurationMinutes: 45, totalPrice: 250, services: [{ ...service, name: 'Pedicure', durationMinutes: 45, price: 250 }] };
const browser = await chromium.launch();
try {
  for (const role of business || process.argv.includes('--salon') ? ['salon'] : ['client', 'salon']) {
    const base = `http://127.0.0.1:${role === 'client' ? 4200 : 4201}`;
    const context = await browser.newContext({ viewport: { width: 390, height: 915 }, timezoneId: 'Europe/Chisinau' });
    await context.addInitScript(() => {
      localStorage.setItem('bookme.language', 'en');
      localStorage.setItem('bookme.onboarding', JSON.stringify({ completed: true, version: 1 }));
    });
    const page = await context.newPage();
    if (business) await page.clock.setFixedTime(new Date('2026-10-15T08:00:00Z'));
    page.setDefaultTimeout(12000);
    const shot = async name => { await page.evaluate(async () => { await Promise.all(document.getAnimations().filter(a => a.effect?.getComputedTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))); }); await page.screenshot({ path: `${out}/${name}.png` }); console.log(name); };
    page.on('pageerror', (error) => console.error(role, error.message));
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === base) return route.continue();
      if (route.request().resourceType() === 'image') return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect width="60" height="60" fill="#eeeef1"/><circle cx="30" cy="22" r="10" fill="#6c6c72"/><path d="M10 60v-7a20 20 0 0 1 40 0v7" fill="#6c6c72"/></svg>' });
      const path = url.pathname;
      let data;
      if (path.endsWith('/client/search')) data = { intent: { availabilityRequested: false }, items: [{ ...salon, listingType: 'SALON', matchedOffer: { ...service, serviceName: service.name } }] };
      else if (path.endsWith('/client/profile')) data = { email: 'ana@example.test', firstName: 'Ana', lastName: 'Demo', phone: '+37360000000', language: 'en' };
      else if (path.endsWith('/salon/profile') || path.includes('/salon-details/')) data = salon;
      else if (path.endsWith('/available-dates')) data = { dates: ['2026-10-15'], timezone: 'Europe/Chisinau' };
      else if (path.endsWith('/available-slots')) data = { timezone: 'Europe/Chisinau', slotOptions: ['14:30', '16:00', '17:30'].map((localTime, i) => ({ date: '2026-10-15', localTime, startAtUtc: ['2026-10-15T11:30:00.000Z', '2026-10-15T13:00:00.000Z', '2026-10-15T14:30:00.000Z'][i], utcOffset: '+03:00' })) };
      else if (path.includes('/services/') && path.endsWith('/masters')) data = { masters: [master] };
      else if (path.endsWith('/client/appointments')) data = route.request().method() === 'POST' ? appointment : { upcoming: { appointments: [appointment], nextCursor: null }, past: { appointments: [], nextCursor: null } };
      else if (path.endsWith('/appointments/dashboard')) data = business
        ? { timezone: 'Europe/Chisinau', calendarDate: '2026-10-15', today: { appointments: [appointment], nextCursor: null }, week: { appointments: [appointment, weekAppointment], nextCursor: null }, month: { appointments: [appointment, weekAppointment, monthAppointment], nextCursor: null }, summary: { todayCount: 1, weekCount: 2, monthCount: 3 } }
        : { timezone: 'Europe/Chisinau', calendarDate: '2026-09-18', today: { appointments: [], nextCursor: null }, week: { appointments: [], nextCursor: null }, month: { appointments: [appointment], nextCursor: null }, summary: { todayCount: 0, weekCount: 0, monthCount: 1 } };
      else if (path.endsWith('/salon/appointments')) data = [appointment];
      else if (path.endsWith('/currencies')) data = ['MDL'];
      else if (path.endsWith('/exchange-rates')) data = { baseCurrency: 'MDL', rates: { MDL: 1 }, updatedAt: '2026-09-18', nextSyncAt: '2026-09-19' };
      else if (path.endsWith('/notifications') || path.endsWith('/reviews')) data = { items: [], nextCursor: null, reviews: [] };
      else if (path.includes('/cities')) data = [{ code: 'chisinau', name: 'Chișinău' }];
      else if (path.endsWith('/masters')) data = [master];
      else if (path.endsWith('/services/categories')) data = [{ label: 'manicure', name: 'Manicure', icon: 'hand-left-outline' }];
      else if (path.includes('/discovery/nearby')) data = [salon];
      else return route.abort();
      return route.fulfill({ json: { success: true, data, errorText: null } });
    });
    await page.goto(`${base}/auth/sign-in`);
    await expect(page.locator('app-sign-in')).toBeVisible();
    await page.evaluate(async role => {
      const signIn = window.ng.getComponent(document.querySelector('app-sign-in'));
      signIn.authService._currentUser.set({ email: 'ana@example.test', userId: 'demo-client', username: 'ana-demo', role, firstName: 'Ana', lastName: 'Demo' });
      signIn.authService._userRole.set(role);
      signIn.authService._isAuthenticated.set(true);
      window.demoNav = signIn.navCtrl;
      await signIn.navCtrl.navigateRoot(role === 'client' ? '/search/all?search=Manicure' : '/admin/tabs/calendar');
    }, role);
    if (role === 'salon') {
      await expect(page.locator('app-admin-calendar')).toBeVisible();
      if (business) {
        const cards = page.locator('app-appointment-card');
        await expect(cards).toHaveCount(1);
        await shot('business-today');
        await page.locator('ion-segment-button[value="week"]').click();
        await expect(cards).toHaveCount(2);
        await shot('business-week');
        await page.locator('ion-segment-button[value="month"]').click();
        await expect(cards).toHaveCount(3);
        await shot('business-month');
        await page.locator('ion-searchbar input').fill('Ana Demo');
        await expect(cards).toHaveCount(1);
        await shot('business-search');
        await cards.screenshot({ path: `${out}/business-card.png` });
        await page.locator('ion-searchbar input').fill('');
        await expect(cards).toHaveCount(3);
        await shot('business-cleared');
        await context.close();
        continue;
      }
      await page.locator('ion-segment-button[value="month"]').click();
      await expect(page.locator('app-admin-calendar')).toContainText('Mara Luca');
      await shot('salon-calendar');
      await context.close();
      continue;
    }
    await expect(page.locator('app-salon-item')).toContainText('Studio Luma');
    await shot('client-search');
    await page.locator('app-salon-item ion-button').filter({ hasText: 'Book Now' }).click();
    const booking = page.locator('app-booking-modal');
    await expect(booking).toBeVisible();
    await shot('client-booking');
    await booking.locator('ion-select').click();
    await expect(page.locator('ion-action-sheet')).toBeVisible();
    await shot('client-service');
    await page.locator('ion-action-sheet button').filter({ hasText: 'Manicure' }).click();
    await booking.locator('ion-button').filter({ hasText: 'Choose Master' }).click();
    await expect(page.locator('app-booking-master-modal')).toBeVisible();
    await shot('client-master');
    await page.locator('app-booking-master-modal ion-button').filter({ hasText: 'Mara Luca' }).click();
    await booking.locator('ion-button').filter({ hasText: 'Choose Date' }).click();
    await expect(page.locator('app-booking-calendar-modal')).toBeVisible();
    await expect.poll(() => page.locator('app-booking-calendar-modal').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(500);
    await page.locator('ion-datetime').getByRole('button', { name: /Thursday, October 15/ }).click();
    await expect(page.locator('app-booking-calendar-modal')).toContainText('14:30');
    await page.locator('#booking-calendar-modal').evaluate(el => el.setCurrentBreakpoint(1));
    await shot('client-calendar');
    await page.locator('app-booking-calendar-modal ion-button').filter({ hasText: '14:30' }).click();
    await expect(page.locator('app-booking-calendar-modal')).not.toBeVisible();
    await shot('client-confirm');
    // Suppress the optional native notification prompt in this visual harness.
    await booking.evaluate(element => { window.ng.getComponent(element).notificationPrompt.maybePromptAfterBooking = async () => {}; });
    await booking.locator('ion-button').filter({ hasText: 'Book Now' }).click();
    await expect(page.locator('ion-toast')).toBeVisible();
    await shot('client-success');
    await expect(booking).not.toBeVisible();
    await page.evaluate(() => window.demoNav.navigateRoot('/bookings'));
    await expect(page.locator('app-upcoming-booking-card')).toContainText('Studio Luma');
    await expect(page.locator('ion-toast')).not.toBeVisible();
    await shot('client-upcoming');
    await context.close();
  }
} finally {
  await browser.close();
}
