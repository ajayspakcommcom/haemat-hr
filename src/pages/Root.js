import { useEffect } from 'react';
import { Outlet, useLoaderData, useSubmit, useNavigate } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';
import { getTokenDuration } from '../util/auth';

function RootLayout() {
  const navigation = useNavigate();

  const token = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    if (!token) {
      navigation('/');
      return;
    }

    if (token === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
      return;
    }

    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      submit(null, { action: '/logout', method: 'post' });
    }, [tokenDuration]);

  }, [token, submit]);

  return (
    <>
      <div className='main-wrapper'>
        <MainNavigation />
        <main>
          {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default RootLayout;
