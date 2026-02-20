import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="login_Admin">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
