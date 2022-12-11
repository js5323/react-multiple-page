import SvgIcon from '@/components/SvgIcon';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

const Features = () => {
  const count = useSelector((state: RootState) => state.home.value);

  return (
    <section className='container pt-3'>
      <h1>Features</h1>

      <p>count: {count}</p>

      <hr />

      <div style={{ fontSize: '5rem' }}>
        <SvgIcon name='home' color='red' />
        <SvgIcon name='close' color='blue' />
        <SvgIcon name='locate' color='gray' />
        <SvgIcon name='payment' color='pink' />
        <SvgIcon name='secure' color='yellow' />
        <SvgIcon name='share' color='green' />
      </div>
    </section>
  );
};

export default Features;
