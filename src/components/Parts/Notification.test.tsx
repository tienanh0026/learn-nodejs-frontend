import { describe, expect, it, test } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import AccordionList from './AccordionList'

const accordionProps = {
  title: 'title',
  list: ['a', 'b', 'c'],
  renderItem: (a: string) => <span>{a}</span>,
  isDefaultOpen: false,
}

describe('Render the arcordion', () => {
  render(
    <AccordionList
      title={accordionProps.title}
      list={accordionProps.list}
      isDefaultOpen={accordionProps.isDefaultOpen}
      renderItem={accordionProps.renderItem}
    />
  )
  test('Title text', () => {
    screen.getByText(accordionProps.title)
  })
  test('open action', () => {
    fireEvent.click(screen.getByText(accordionProps.title))
    for (let i = 0; i < accordionProps.list.length; i++) {
      screen.getByText(accordionProps.list[i])
    }
  })
})
