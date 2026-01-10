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
                // 1. Lưu token
                localStorage.setItem('token', token);

                // 2. Decode token để lấy thông tin user (nếu backend có nhét role vào claim)
                // Nếu không cài thư viện jwt-decode, bạn có thể dùng hàm parse base64 thủ công
                const decoded = jwtDecode(token);

                // Giả sử token có cấu trúc standard hoặc backend custom claim 'scope' hoặc 'roles'
                // Bạn cần kiểm tra log của decoded để map đúng key
                console.log("Decoded Token:", decoded);

                const userId = decoded.sub || decoded.email || '';
                const roles = decoded.scope ? decoded.scope.split(' ') : (decoded.roles || ['STUDENT']);
                const role = roles.length > 0 ? roles[0] : 'STUDENT';

                // 3. Lưu thông tin user giả lập từ token (vì backend api oauth2 redirect chỉ trả về token)
                localStorage.setItem('userId', userId);
                localStorage.setItem('userRole', role);
                localStorage.setItem('userLoggedIn', 'true');

                // Lưu object user tối thiểu để app không bị lỗi
                const userObj = {
                    id: userId,
                    email: userId, // Token thường dùng email làm subject
                    roles: roles
                };
                localStorage.setItem('user', JSON.stringify(userObj));

                // 4. Redirect dựa trên Role
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