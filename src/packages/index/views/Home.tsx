import { useAppSelector } from '@/hooks/redux-hooks';
import { RootState } from '@/store';
import { decrement, increment } from '@/store/reducers/home';
import { useRequest } from 'ahooks';
import axios from 'axios';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';

interface TestDataType {
  name: string;
  short_name: string;
  display: string;
  start_url: string;
  description: string;
  background_color: string;
  theme_color: string;
  scope: string;
}

const getTestData = (): Promise<TestDataType> => axios.get('/media/path/test/data/test.json');

const TestDataContent = () => {
  const {
    data: testData,
    error,
    loading,
    run,
  } = useRequest(getTestData, {
    manual: true,
  });

  if (loading) {
    return <p>loading</p>;
  }

  if (error) {
    return (
      <>
        <p>load data error:</p>
        <code>{JSON.stringify(error)}</code>
      </>
    );
  }

  return (
    <>
      <button onClick={() => run()} className='btn btn-primary mb-3'>
        start get Data
      </button>

      <h3>data loaded:</h3>
      <code>{testData ? JSON.stringify(testData) : 'no data loaded'}</code>
    </>
  );
};

const Home = () => {
  const count = useAppSelector((state: RootState) => state.home.value);
  const dispatcher = useDispatch();

  return (
    <section className='container pt-3 '>
      <h1>Home</h1>

      <section className='mb-5'>
        <h2>counter</h2>
        <p>{count}</p>

        <button onClick={() => dispatcher(increment())} className='btn btn-primary me-5'>
          increment
        </button>
        <button onClick={() => dispatcher(decrement())} className='btn btn-secondary'>
          decrement
        </button>
      </section>

      <section>
        <h2>data testing</h2>

        <TestDataContent />
      </section>
    </section>
  );
};

export default Home;
