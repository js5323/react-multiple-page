import classNames from 'classnames';
import { useState } from 'react';

const Pricing = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section
      className={classNames(['pricing-container container pt-3', isLoading ? 'loading' : ''])}
    >
      <h1>Pricing</h1>
      <button className='btn btn-primary' onClick={() => setIsLoading(!isLoading)}>
        run
      </button>
      <div className='loading-txt'>Loading</div>
    </section>
  );
};

export default Pricing;
