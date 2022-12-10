import { RouteObject, useRoutes } from 'react-router-dom';
import routes from './router';

import { Provider } from 'react-redux';
import store from '@/store';

import '@/styles/main.scss';

import './style/style.scss';

const App = () => {
  const element = useRoutes(routes as unknown as RouteObject[]);

  return <Provider store={store}>{element}</Provider>;
};

export default App;
