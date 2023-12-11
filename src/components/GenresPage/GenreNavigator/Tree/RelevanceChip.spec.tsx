import { expect, test } from '@playwright/experimental-ct-react'

import RelevanceChip from './RelevanceChip'

test.use({ viewport: { width: 500, height: 500 } })

test.describe('RelevanceChip', () => {
  test('should render with correct relevance value', async ({ mount }) => {
    const component = await mount(<RelevanceChip relevance={50} />)
    await expect(component).toContainText('50')
  })

  test('should render with "?" when relevance is 99', async ({ mount }) => {
    const component = await mount(<RelevanceChip relevance={99} />)
    await expect(component).toContainText('?')
  })

  test('should apply custom class names', async ({ mount }) => {
    const component = await mount(
      // eslint-disable-next-line tailwindcss/no-custom-classname
      <RelevanceChip relevance={50} className='__test__' />,
    )
    await expect(component).toHaveClass(/__test__/)
  })
})
