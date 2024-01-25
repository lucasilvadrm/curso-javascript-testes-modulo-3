import CartItem from './cart-item';
import { screen, render } from '@testing-library/react';
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

  let result;

  beforeEach(() => {
    result = renderHook(() => useCartStore()).result;
  })

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

  it('should call remove() when remove button is clicked', async () => {  
    const spy = jest.spyOn(result.current.actions, 'remove');

    renderCartItem();

    const button = screen.getByRole('button', { name: /remove/i });

    await userEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });

  it('should call increase() when increase button is clicked', async () => {
    const spy = jest.spyOn(result.current.actions, 'increase');

    renderCartItem();

    const button = screen.getByTestId('increase');

    await userEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });

  it('should call decrease() when decrease button is clicked', async () => {
    const spy = jest.spyOn(result.current.actions, 'decrease');

    renderCartItem();

    const button = screen.getByTestId('decrease');

    await userEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });
});
