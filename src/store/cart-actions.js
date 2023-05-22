import { uiActions } from './ui-slice';
import { cartActions } from './cart-slice';

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        'https://react-http-98ba6-default-rtdb.europe-west1.firebasedatabase.app/cart.json'
      );
      if (!response.ok) {
        throw new Error('could not fetch cart data');
      }
      const data = await response.json();

      return data;
    };

    try {
      const cartData = await fetchData();
      dispatch(
        cartActions.replaceCart({
          items: cartData.items || [],
          totalQuantity: cartData.totalQuantity,
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error',
          message: 'fetching cart data failed',
        })
      );
    }
  };
};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'sending cart data',
      })
    );
    const sendRequest = async () => {
      const response = await fetch(
        'https://react-http-98ba6-default-rtdb.europe-west1.firebasedatabase.app/cart.json',
        {
          method: 'PUT',
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Sending data failed');
      }
    };
    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success',
          message: 'sending cart data successfully',
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error',
          message: 'sending cart data failed',
        })
      );
    }
  };
};
