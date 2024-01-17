import ProductCard from "./product-card";
import { screen, render, fireEvent } from "@testing-library/react";

const product = {
  title: 'Relógio',
  price: '22.00',
  image: 'https://m.media-amazon.com/images/I/71TIOhVWQ5L._AC_UF1000,1000_QL80_.jpg'
}

const addToCard = jest.fn();

const renderProductCard = () => {
  render(<ProductCard product={product} addToCard={addToCard} />);
}

describe('ProductCard', () => { 
  it('should render ProductCard', () => {
    renderProductCard();

    expect(screen.getByTestId('product-card')).toBeInTheDocument();
  });  

  it('should display proper content', () => {
    renderProductCard();

    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument();
    // exp reg para informar que o texto é case insensitive
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();

    expect(screen.getByTestId('image')).toHaveStyle({
      backgroundImage: product.image
    })
  });

  // async pois terá um interação do usuário
  it('should call props.addToCart() when button gets clicked', async () => {
    renderProductCard();

    const button = screen.getByRole('button');

    await fireEvent.click(button);

    expect(addToCard).toHaveBeenCalledTimes(1);
    expect(addToCard).toHaveBeenCalledWith(product);
  });
})