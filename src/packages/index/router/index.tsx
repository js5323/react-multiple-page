import Layout from '@/components/Layout';
import Features from '../views/Features';
import Home from '../views/Home';
import Pricing from '../views/Pricing';

const routes = [
  {
    path: '/',
    name: 'Home',
    key: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        index: true,
        key: '/',
        element: <Home />,
      },
      {
        path: 'features',
        key: 'features',
        element: <Features />,
      },
      {
        path: 'pricing',
        key: 'pricing',
        element: <Pricing />,
      },
    ],
  },
];

export default routes;
