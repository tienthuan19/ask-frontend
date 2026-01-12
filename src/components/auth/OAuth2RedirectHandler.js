import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Cần cài: npm install jwt-decode

const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            try {

                localStorage.setItem('token', token);

                const decoded = jwtDecode(token);

                console.log("Decoded Token:", decoded);

                const userId = decoded.sub || decoded.email || '';
                const roles = decoded.scope ? decoded.scope.split(' ') : (decoded.roles || ['STUDENT']);
                const role = roles.length > 0 ? roles[0] : 'STUDENT';

                localStorage.setItem('userId', userId);
                localStorage.setItem('userRole', role);
                localStorage.setItem('userLoggedIn', 'true');

                const userObj = {
                    id: userId,
                    email: userId,
                    roles: roles
                };
                localStorage.setItem('user', JSON.stringify(userObj));

                if (role.includes('ADMIN')) {
                    navigate('/multi-accounting-dashboard');
                } else if (role.includes('TEACHER')) {
                    navigate('/teacher-dashboard');
                } else {
                    navigate('/student-dashboard');
                }

            } catch (error) {
                console.error('Login Failed:', error);
                navigate('/login?error=token_invalid');
            }
        } else {
            navigate('/login?error=no_token');
        }
    }, [navigate, searchParams]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <h3>Đang xử lý đăng nhập...</h3>
        </div>
    );
};

export default OAuth2RedirectHandler;