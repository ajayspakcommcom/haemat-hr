import { useNavigate } from "react-router-dom";
import AuthForm from '../components/AuthForm';
import { Card } from 'primereact/card';

function AuthenticationPage() {

  const navigate = useNavigate();

  const redirectHandler = () => {
    navigate('/dashboard');
  };

  return (
    <section className='login-wrapper'>
      <Card>
        <AuthForm onRedirect={redirectHandler} />
      </Card>
    </section>
  );
}

export default AuthenticationPage;


