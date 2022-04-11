import CreatePlaylist from './component/pages/CreatePlaylist';
import { useLocation, Switch, Route } from 'react-router-dom';
import Auth from './component/pages/Auth';
import GuardRoute from './component/components/GuardRoute';
import NotFound from './component/pages/NotFound';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './slice/authSlice';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const accessTokenState = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const expiredDate = localStorage.getItem('expiredDate');

      if (expiredDate < +new Date()) {
        dispatch(logout());
      } else if (!accessTokenState) {
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch(login({
          accessToken,
          user,
          expiredDate,
          }));
      }
    }
  }, [accessTokenState, dispatch, location.pathname]);

  return (
    <Switch>
      <GuardRoute path="/create-playlist" type="private" exact>
        <CreatePlaylist />
      </GuardRoute>
      <GuardRoute path="/" type="guest" exact>
        <Auth />
      </GuardRoute>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default App;