import { test, expect, type BrowserContext, type Page } from '@playwright/test'

class Actor {
  private page!: Page

  constructor(
    private readonly context: BrowserContext,
    readonly name: string,
  ) {}

  async open(): Promise<this> {
    this.page = await this.context.newPage()
    return this
  }

  async startsNewGame(): Promise<string> {
    await this.page.goto('/')
    await this.page.getByRole('button', { name: 'Start new game' }).click()
    await this.page.waitForURL(/\/games\/.*\/facilitator/)
    const match = this.page.url().match(/\/games\/([^/]+)\/facilitator/)
    return match![1]
  }

  async joinsGame(gameId: string): Promise<void> {
    await this.page.goto(`/games/${gameId}/join`)
    await this.page.waitForURL(/\/players\//)
  }

  async sees(what: string, assertion: (page: Page) => Promise<void>): Promise<void> {
    await test.step(`${this.name} sees: ${what}`, () => assertion(this.page))
  }
}

test('two players join a game and the facilitator sees them connect', async ({ browser }) => {
  const facilitator = await new Actor(await browser.newContext(), 'Facilitator').open()
  const john = await new Actor(await browser.newContext(), 'John').open()
  const mary = await new Actor(await browser.newContext(), 'Mary').open()

  const gameId = await test.step('Facilitator starts a new game', () =>
    facilitator.startsNewGame()
  )

  await facilitator.sees('an empty lobby', async (page) => {
    await expect(page.getByText('Waiting for players to join...')).toBeVisible()
  })

  await test.step('John joins the game', () => john.joinsGame(gameId))

  await john.sees('his character name and skills', async (page) => {
    await expect(page.locator('.character-name')).toBeVisible()
    await expect(page.locator('.skills li').first()).toBeVisible()
  })

  await facilitator.sees('John connected in the lobby', async (page) => {
    await expect(page.getByText('Players (1)')).toBeVisible()
  })

  await test.step('Mary joins the game', () => mary.joinsGame(gameId))

  await mary.sees('her character name and skills', async (page) => {
    await expect(page.locator('.character-name')).toBeVisible()
    await expect(page.locator('.skills li').first()).toBeVisible()
  })

  await facilitator.sees('John and Mary both connected', async (page) => {
    await expect(page.getByText('Players (2)')).toBeVisible()
  })

  await john.sees('a different character than Mary', async (johnPage) => {
    await mary.sees('a different character than John', async (maryPage) => {
      const johnCharacter = await johnPage.locator('.character-name').textContent()
      const maryCharacter = await maryPage.locator('.character-name').textContent()
      expect(johnCharacter).not.toBe(maryCharacter)
    })
  })
})
