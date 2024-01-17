import Search from './search';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserEvent from '@testing-library/user-event';

// mock function
const doSearch = jest.fn();

describe('Search', () => {
  it('should render a form', () => {
    render(<Search />);

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('should render a input equals search', () => {
    render(<Search doSearch={doSearch}/>);

    // verificando type do input
    expect(screen.getByRole('searchbox')).toHaveProperty('type', 'search');
  });

  it('should call props.doSearch() when form is submitted', async () => {
    render(<Search doSearch={doSearch} />);

    //criando referência ao form
    const form = screen.getByRole('form');

    // disparando evento
    await fireEvent.submit(form);

    // espera que o método doSearch seja chamado ao menos uma vez
    expect(doSearch).toHaveBeenCalledTimes(1);

  });

  it('should call props.doSearch() with the user input', async () => {
    render(<Search doSearch={doSearch} />);

    //criando referência ao form
    const inputText = 'some text here'
    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, inputText);
    await fireEvent.submit(form);

    expect(doSearch).toHaveBeenCalledWith(inputText)

  });
});
