package com.oanhtp.fuminihotel.service;

import com.oanhtp.fuminihotel.dto.request.LoginRequest;
import com.oanhtp.fuminihotel.dto.request.RegisterRequest;
import com.oanhtp.fuminihotel.dto.response.AuthResponse;
import com.oanhtp.fuminihotel.security.UserPrincipal;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse getCurrentUser(UserPrincipal principal);
}

