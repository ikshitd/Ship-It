import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function LoginPrompt() {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: 'ShipIt - Keeping Dev in Motion',
      html: '<strong> Login </strong> to start using the ultimate productivity application for developers.',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Login',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/login');
      }
    });
  }, [navigate]);

  return null;
}
