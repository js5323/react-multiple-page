import { RootState } from '@/store';
import { useSelector } from 'react-redux';

const Features = () => {
  const count = useSelector((state: RootState) => state.home.value);

  return (
    <section className='container pt-3'>
      <h1>Features</h1>

      <p>count: {count}</p>
    </section>
  );
};

export default Features;
