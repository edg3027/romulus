import type { Locator, Page } from '@playwright/test'

export class Navbar {
  accountDropdown: Locator
  logOutButton: Locator

  constructor(readonly page: Page) {
    this.accountDropdown = this.page.getByRole('button', { name: 'Account Dropdown' })
    this.logOutButton = this.page.getByRole('button', { name: 'Sign Out' })
  }

  async signOut() {
    await this.accountDropdown.click()
    await this.logOutButton.click()
    await this.page.waitForResponse('/sign-out')
  }
}
