import { RouteObject, useRoutes } from 'react-router-dom';
import routes from './router';

import '@/styles/main.scss';

const App = () => {
  const element = useRoutes(routes as unknown as RouteObject[]);

  return <>{element}</>;
};

export default App;
