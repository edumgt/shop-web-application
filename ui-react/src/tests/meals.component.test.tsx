import React from 'react';
import {render, waitFor} from '@testing-library/react';
import Meals from './../components/meals.component';
import userEvent from '@testing-library/user-event';

const renderMealsComponent = () => {

  const addMeal = jest.fn()
  const utils = render(
    <Meals
      meals={[{id: 1, name: 'potatos', description: 'yummi', price: 2}]}
      addMeal={addMeal}
      deleteMeal={() => jest.fn()}
      modifyMeal={() => jest.fn()}
      canAdd={true}
      isInOrder={false}
    />
  )
  return {
    ...utils,
    addMeal
  }
}
describe('Meals component', () => {
  it('has all the components', async () => {
    const {findByText, findByPlaceholderText} = renderMealsComponent();
    expect(await findByText(/potatos/)).toBeInTheDocument()
    expect(await findByText(/yummi/)).toBeInTheDocument()
    expect(await findByPlaceholderText(/Name/)).toBeInTheDocument()
    expect(await findByPlaceholderText(/Description/)).toBeInTheDocument()
    expect(await findByPlaceholderText(/Price/)).toBeInTheDocument()
  })

  it('triggers add a meal', async () => {
    const {findByText, findByPlaceholderText, addMeal} = renderMealsComponent();

    userEvent.type(await findByPlaceholderText(/Name/), 'Carrot')
    userEvent.type(await findByPlaceholderText(/Description/), 'Orange Vitamin')
    userEvent.type(await findByPlaceholderText(/Price/), '3')

    userEvent.click(await findByText(/Add meal/))

    await waitFor(() => {
      expect(addMeal).toHaveBeenCalled()
    })
  })
})