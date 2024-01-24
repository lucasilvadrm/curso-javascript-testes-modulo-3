import CartItem from './cart-item';
import { screen, render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCartStore } from '../store/cart';
import { renderHook } from '@testing-library/react-hooks';
import { setAutoFreeze } from 'immer';

setAutoFreeze(false);

const product = {
  title: 'Relógio',
  price: '22.00',
  image: 'https://m.media-amazon.com/images/I/71TIOhVWQ5L._AC_UF1000,1000_QL80_.jpg',
};

const renderCartItem = () => {
  render(<CartItem product={product} />);
};

describe('CartItem', () => {
  it('should render CartItem', () => {
    renderCartItem();

    expect(screen.getByTestId('cart-item')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    renderCartItem();

    const image = screen.getByTestId('image');

    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument();
    // exp reg para informar que o texto é case insensitive
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();

    expect(image).toHaveProperty('src', product.image);
    expect(image).toHaveProperty('alt', product.title);
  });

  it('should display 1 as initial quantity', () => {
    renderCartItem();

    // retorna o conteúdo que está dentro do elemento html e verifica se esse conteúdo é igual a 2
    expect(screen.getByTestId('quantity').textContent).toBe('1');
  });

  it('should increase quantity by 1 when second button is clicked', async () => {
    renderCartItem();

    const button = screen.getByTestId('increase');

    await fireEvent.click(button);

    expect(screen.getByTestId('quantity').textContent).toBe('2');
  });

  it('should decrease quantity by 1 when first button is clicked', async () => {
    renderCartItem();

    const buttonIncrease = screen.getByTestId('increase');
    const buttonDecrease = screen.getByTestId('decrease');
    const quantity = screen.getByTestId('quantity');

    await fireEvent.click(buttonIncrease);
    expect(quantity.textContent).toBe('2');

    await fireEvent.click(buttonDecrease);
    expect(quantity.textContent).toBe('1');
  });

  it('should not go below zero in the quantity', async () => {
    renderCartItem();

    const buttonDecrease = screen.getByTestId('decrease');
    const quantity = screen.getByTestId('quantity');

    expect(quantity.textContent).toBe('1');

    await fireEvent.click(buttonDecrease);
    await fireEvent.click(buttonDecrease);

    expect(quantity.textContent).toBe('0');
  });

  it('should call remove() when remove button is clicked', async () => {  
    const result = renderHook(() => useCartStore()).result;
  
    const spy = jest.spyOn(result.current.actions, 'remove');

    renderCartItem();

    const button = screen.getByRole('button', { name: /remove/i });

    await userEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });
});
