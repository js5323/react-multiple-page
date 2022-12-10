import { useAppSelector } from '@/hooks/redux-hooks';
import { RootState } from '@/store';
import { decrement, increment } from '@/store/reducers/home';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';

const Home = () => {
  const count = useAppSelector((state: RootState) => state.home.value);
  const dispatcher = useDispatch();

  return (
    <section className='container pt-3'>
      <h1>Home</h1>

      <p>{count}</p>

      <button onClick={() => dispatcher(increment())} className='btn btn-primary me-5'>
        increment
      </button>
      <button onClick={() => dispatcher(decrement())} className='btn btn-secondary'>
        decrement
      </button>
    </section>
  );
};

export default Home;
