import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should successfully login and logout', async ({ page }) => {
    // Go to login page
    await page.goto('/login');
    
    // Verify we're on the login page
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    
    // Click login button
    await page.getByText('Sign in with Keycloak').click();
    
    // We should be redirected to Keycloak
    await expect(page.url()).toContain(process.env.NEXT_PUBLIC_KEYCLOAK_URL as string);
    
    // Fill in Keycloak login form
    await page.getByLabel('Username or email').fill(process.env.E2E_TEST_USERNAME || 'test-user');
    await page.getByLabel('Password').fill(process.env.E2E_TEST_PASSWORD || 'test-password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // We should be redirected back to our app's dashboard
    await expect(page.url()).toContain('/dashboard');
    
    // Verify we're logged in by checking for user menu
    const userMenu = page.getByRole('button', { name: /user menu/i });
    await expect(userMenu).toBeVisible();
    
    // Test logout
    await userMenu.click();
    await page.getByText('Logout').click();
    
    // Verify we're logged out and back on login page
    await expect(page.url()).toContain('/login');
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByText('Sign in with Keycloak').click();
    
    // Fill in invalid credentials
    await page.getByLabel('Username or email').fill('invalid-user');
    await page.getByLabel('Password').fill('invalid-password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should show error message
    await expect(page.getByText(/Invalid username or password/i)).toBeVisible();
  });
}); 