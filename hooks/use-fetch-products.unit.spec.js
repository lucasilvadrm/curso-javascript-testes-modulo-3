import { useFetchProducts } from './use-fetch-products';
import { makeServer } from '../miragejs/server';
import { renderHook } from '@testing-library/react-hooks';
import { Response } from 'miragejs';

describe('useFetchProducts', () => {
  let server;

  beforeEach(() => {
    // criar instancia antes de cada teste
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should return a list of 10 products', async () => {
    server.createList('product', 10);

    // renderHook: possibilidade de testar hooks customizados
    const { result, waitForNextUpdate } = renderHook(() => useFetchProducts());

    await waitForNextUpdate();

    const { products, error } = result.current;

    expect(products).toHaveLength(10);
    expect(error).toBe(false);
  });

  it('should set error to true when catch() block is executed', async () => {
    server.get('products', () => {
      return new Response(500, {}, '');
    });

    const { result, waitForNextUpdate } = renderHook(() => useFetchProducts());

    await waitForNextUpdate();

    const { products, error } = result.current;

    expect(error).toBe(true);
    expect(products).toHaveLength(0);
  });
});
