import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Signup, Login, VerifyOTP, ForgotPassword, ResetPassword } from "../api/index.js";

import loginImg from "../assets/login.png";
import signupImg from "../assets/signup.png";
import verifyImg from "../assets/verify.png";
import forgotImg from "../assets/forgot.png";
import resetImg from "../assets/reset.png";

// ── Keyframes ──────────────────────────────────────────────────────────────
const slideLeft = keyframes`from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}`;

// ── Layout ─────────────────────────────────────────────────────────────────
const Outer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $bg }) => $bg};
  transition: background 0.6s ease;
  padding: 24px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 900px;
  min-height: 540px;
  display: flex;
  border-radius: 28px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 32px 80px rgba(0,0,0,0.28);
  padding-left:10px;
`;

// ── Left panel ─────────────────────────────────────────────────────────────
const LeftPanel = styled.div`
  width: 46%;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  background: ${({ $color }) => $color};
  transition: background 0.6s ease;
`;

const VRImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: opacity 0.5s ease;
`;

const Logo = styled.div`
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;

const LogoSvg = () => (
    <svg width="44" height="34" viewBox="0 0 44 34" fill="none">
        <path d="M22 17C22 17 10 4 4 10C-2 16 10 28 22 17Z" fill="white" opacity="0.9" />
        <path d="M22 17C22 17 34 4 40 10C46 16 34 28 22 17Z" fill="white" opacity="0.9" />
        <path d="M22 17C22 17 10 30 4 24C-2 18 10 6 22 17Z" fill="white" opacity="0.6" />
        <path d="M22 17C22 17 34 30 40 24C46 18 34 6 22 17Z" fill="white" opacity="0.6" />
    </svg>
);

// ── Right panel ─────────────────────────────────────────────────────────────
const RightPanel = styled.div`
  flex: 1;
  padding: 36px 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${slideLeft} 0.4s ease;
  key: ${({ $key }) => $key};
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: 18px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  &:hover { color: #000; }
`;

const Title = styled.h1`
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 6px;
`;

const Subtitle = styled.p`
  font-size: 13.5px;
  color: #666;
  margin: 0 0 24px;
  a { color: #111; font-weight: 600; text-decoration: underline; cursor: pointer; }
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #222;
  margin-bottom: 6px;
  display: block;
`;

const InputWrap = styled.div`
  position: relative;
  margin-bottom: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 13px 16px;
  padding-right: ${({ $hasIcon }) => $hasIcon ? "44px" : "16px"};
  border: 1.5px solid #e0e0e0;
  border-radius: 50px;
  font-size: 14px;
  background: #fafafa;
  color: #111;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus { border-color: #111; background: #fff; }
  &::placeholder { color: #aaa; }
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  padding: 0;
  &:hover { color: #333; }
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  display: ${({ show }) => show ? "block" : "none"};
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
`;

const RowGroup = styled.div`
  flex: 1;
`;

const ForgotLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #111;
  text-decoration: underline;
  text-align: right;
  display: block;
  margin-left: auto;
  margin-bottom: 18px;
  padding: 0;
`;

const LinkBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #111;
  font-weight: 600;
  text-decoration: underline;
  font-size: inherit;
  &:hover { opacity: 0.8; }
`;

const TermsLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #111;
  font-weight: 600;
  text-decoration: underline;
  font-size: inherit;
  &:hover { opacity: 0.8; }
`;

const PrimaryBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 14px;
  transition: background 0.2s, transform 0.1s;
  &:hover { background: #333; }
  &:active { transform: scale(0.98); }
`;

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #444;
  cursor: pointer;
  margin-bottom: 14px;
  a { font-weight: 600; color: #111; text-decoration: underline; }
  input { accent-color: #111; width: 16px; height: 16px; }
`;

const OrDivider = styled.div`
  text-align: center;
  color: #bbb;
  font-size: 13px;
  margin: 8px 0 14px;
  position: relative;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const SocialBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: none;
  background: none;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 500;
  &:hover { background: #f4f4f4; }
`;

// ── OTP inputs ──────────────────────────────────────────────────────────────
const OTPRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
`;

const OTPInput = styled.input`
  width: 44px;
  height: 44px;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  border: 2 px solid #111;
  border-radius: 50px;
  background: #fafafa;
  color: #111;
  outline: none;
  &:focus { border-color: #111; background: #fff; }
`;

const ResendRow = styled.div`
  text-align: right;
  font-size: 13px;
  color: #888;
  margin-bottom: 20px;
  span { font-weight: 700; color: #111; }
`;

// ── Eye icon ────────────────────────────────────────────────────────────────
const EyeOff = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const Eye = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

// ── VR image placeholders (using gradient placeholders since no real images) ─
const VR_IMAGES = {
    login: loginImg,
    signup: signupImg,
    verify: verifyImg,
    forgot: forgotImg,
    reset: resetImg,
};

const BG_COLORS = {
    login: "linear-gradient(135deg,#6b1010 0%,#c0392b 100%)",
    signup: "linear-gradient(135deg,#0d1b2a 0%,#1a3a5c 100%)",
    verify: "linear-gradient(135deg,#6b0035 0%,#c0186a 100%)",
    forgot: "linear-gradient(135deg,#2d0a5e 0%,#7b2ff7 100%)",
    reset: "linear-gradient(135deg,#0a1628 0%,#1e3a5f 100%)",
};

// ── Google / Facebook SVGs ──────────────────────────────────────────────────
// const GoogleIcon = () => (
//     <svg width="18" height="18" viewBox="0 0 48 48">
//         <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
//         <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
//         <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
//         <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
//     </svg>
// );

// const FBIcon = () => (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
//         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//     </svg>
// );

// ── Main Component ──────────────────────────────────────────────────────────
export default function Authentication({ initialScreen = "login", onSuccess, onBack }) {
    const [screen, setScreen] = useState(initialScreen);
    const [showPass, setShowPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(24);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    // Form state for signup
    const [signupForm, setSignupForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Form state for login
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    // Form state for forgot/reset password
    const [resetForm, setResetForm] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [currentEmail, setCurrentEmail] = useState("");

    // countdown timer for OTP
    useEffect(() => {
        if (screen !== "verify") return;
        setTimer(60);
        const id = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
        return () => clearInterval(id);
    }, [screen]);

    const handleOtp = (i, val) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...otp];
        next[i] = val;
        setOtp(next);
        if (val && i < 5) otpRefs[i + 1].current?.focus();
    };

    const handleOtpKey = (i, e) => {
        if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs[i - 1].current?.focus();
    };

    const go = (s) => { 
        setShowPass(false); 
        setError("");
        setScreen(s); 
    };

    // API Handlers
    const handleSignup = async () => {
        if (!signupForm.name || !signupForm.email || !signupForm.password) {
            setError("All fields are required");
            return;
        }
        if (signupForm.password !== signupForm.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            await Signup({
                name: signupForm.name,
                email: signupForm.email,
                password: signupForm.password,
                confirmPassword: signupForm.confirmPassword,
            });
            setCurrentEmail(signupForm.email);
            setOtp(["", "", "", "", "", ""]);
            setError("");
            go("verify");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!loginForm.email || !loginForm.password) {
            setError("Email and password are required");
            return;
        }
        setLoading(true);
        try {
            await Login({
                email: loginForm.email,
                password: loginForm.password,
            });
            setError("");
            // Save user data or token as needed
            onSuccess?.();
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }
        setLoading(true);
        try {
            await VerifyOTP({
                email: currentEmail,
                otp: otpValue,
            });
            setError("");
            onSuccess?.();
        } catch (err) {
            setError(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!resetForm.email) {
            setError("Email is required");
            return;
        }
        setLoading(true);
        try {
            await ForgotPassword({
                email: resetForm.email,
            });
            setCurrentEmail(resetForm.email);
            setOtp(["", "", "", "", "", ""]);
            setError("");
            go("reset");
        } catch (err) {
            setError(err.response?.data?.message || "Request failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        const otpValue = otp.join("");
        if (!resetForm.newPassword || !resetForm.confirmPassword) {
            setError("All fields are required");
            return;
        }
        if (resetForm.newPassword !== resetForm.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (otpValue.length !== 6) {
            setError("Please enter a valid 4-digit code");
            return;
        }
        setLoading(true);
        try {
            await ResetPassword({
                email: currentEmail,
                otp: otpValue,
                newPassword: resetForm.newPassword,
                confirmPassword: resetForm.confirmPassword,
            });
            setError("");
            setOtp(["", "", "", "", "", ""]);
            setResetForm({ email: "", newPassword: "", confirmPassword: "" });
            go("login");
        } catch (err) {
            setError(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    const bg = BG_COLORS[screen];
    const img = VR_IMAGES[screen];

    // ── Screens ──────────────────────────────────────────────────────────────
    const screens = {
        login: (
            <RightPanel $key="login">
                <BackBtn onClick={() => onBack?.()}>←</BackBtn>
                <Title>Log in</Title>
                <Subtitle>Don't have an account? <LinkBtn onClick={() => go("signup")}>Create an Account</LinkBtn></Subtitle>
                <ErrorMessage show={!!error}>{error}</ErrorMessage>
                <Label>Email Address</Label>
                <InputWrap><Input 
                    placeholder="john52martinez@gmail.com" 
                    type="email" 
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                /></InputWrap>
                <Label>Password</Label>
                <InputWrap>
                    <Input 
                        $hasIcon 
                        placeholder="Password" 
                        type={showPass ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                    <EyeBtn type="button" onClick={() => setShowPass(p => !p)}>{showPass ? <Eye /> : <EyeOff />}</EyeBtn>
                </InputWrap>
                <ForgotLink onClick={() => go("forgot")}>Forgot Password?</ForgotLink>
                <PrimaryBtn onClick={handleLogin} disabled={loading}>{loading ? "Logging in..." : "Log in"}</PrimaryBtn>
                {/* Terms and conditions - commented out for future use
                <CheckRow><input type="checkbox" defaultChecked /> I agree to the <TermsLink>Terms &amp; Condition</TermsLink></CheckRow>
                */}
                {/* Social login buttons - commented out for future use
                <OrDivider>or</OrDivider>
                <SocialRow>
                    <SocialBtn><GoogleIcon /> Continue with Google</SocialBtn>
                    <SocialBtn><FBIcon /> Continue with Facebook</SocialBtn>
                </SocialRow>
                */}
            </RightPanel>
        ),

        signup: (
            <RightPanel $key="signup">
                <BackBtn onClick={() => go("login")}>←</BackBtn>
                <Title>Create an Account</Title>
                <Subtitle>Already have an account? <LinkBtn onClick={() => go("login")}>Log in</LinkBtn></Subtitle>
                <ErrorMessage show={!!error}>{error}</ErrorMessage>
                <Row>
                    <RowGroup>
                        <Label>Full Name</Label>
                        <InputWrap><Input 
                            placeholder="John Doe" 
                            value={signupForm.name}
                            onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        /></InputWrap>
                    </RowGroup>
                </Row>
                <Label>Email Address</Label>
                <InputWrap><Input 
                    placeholder="Email Address" 
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                /></InputWrap>
                <Label>Password</Label>
                <InputWrap>
                    <Input 
                        $hasIcon 
                        placeholder="Password" 
                        type={showPass ? "text" : "password"}
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    />
                    <EyeBtn type="button" onClick={() => setShowPass(p => !p)}>{showPass ? <Eye /> : <EyeOff />}</EyeBtn>
                </InputWrap>
                <Label>Confirm Password</Label>
                <InputWrap>
                    <Input 
                        $hasIcon 
                        placeholder="Confirm Password" 
                        type={showConfPass ? "text" : "password"}
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    />
                    <EyeBtn type="button" onClick={() => setShowConfPass(p => !p)}>{showConfPass ? <Eye /> : <EyeOff />}</EyeBtn>
                </InputWrap>
                <PrimaryBtn onClick={handleSignup} disabled={loading}>{loading ? "Creating Account..." : "Create Account"}</PrimaryBtn>
                {/* Terms and conditions - commented out for future use
                <CheckRow><input type="checkbox" defaultChecked /> I agree to the <TermsLink>Terms &amp; Condition</TermsLink></CheckRow>
                */}
                {/* Social login buttons - commented out for future use
                <OrDivider>or</OrDivider>
                <SocialRow>
                    <SocialBtn><GoogleIcon /> Continue with Google</SocialBtn>
                    <SocialBtn><FBIcon /> Continue with Facebook</SocialBtn>
                </SocialRow>
                */}
            </RightPanel>
        ),

        verify: (
            <RightPanel $key="verify">
                <BackBtn onClick={() => go("login")}>←</BackBtn>
                <Title>Verification Code</Title>
                <Subtitle>We sent you verification code on <strong>{currentEmail}</strong></Subtitle>
                <ErrorMessage show={!!error}>{error}</ErrorMessage>
                <OTPRow>
                    {otp.map((v, i) => (
                        <OTPInput
                            key={i}
                            ref={otpRefs[i]}
                            maxLength={1}
                            value={v}
                            onChange={e => handleOtp(i, e.target.value)}
                            onKeyDown={e => handleOtpKey(i, e)}
                        />
                    ))}
                </OTPRow>
                <ResendRow>
                    Resend Code in: <span>{String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}</span>
                </ResendRow>
                <PrimaryBtn onClick={handleVerifyOTP} disabled={loading}>{loading ? "Verifying..." : "Verify Code"}</PrimaryBtn>
            </RightPanel>
        ),

        forgot: (
            <RightPanel $key="forgot">
                <BackBtn onClick={() => go("login")}>←</BackBtn>
                <Title>Forgot Password</Title>
                <Subtitle>We'll send a verification code to your email address</Subtitle>
                <ErrorMessage show={!!error}>{error}</ErrorMessage>
                <Label>Email Address</Label>
                <InputWrap><Input 
                    placeholder="john52martinez@gmail.com" 
                    type="email"
                    value={resetForm.email}
                    onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
                /></InputWrap>
                <PrimaryBtn onClick={handleForgotPassword} disabled={loading}>{loading ? "Sending..." : "Send Verification Code"}</PrimaryBtn>
            </RightPanel>
        ),

        reset: (
            <RightPanel $key="reset">
                <BackBtn onClick={() => go("forgot")}>←</BackBtn>
                <Title>Reset Password</Title>
                <Subtitle>Your new password must be different from <br /> your previous passwords.</Subtitle>
                <ErrorMessage show={!!error}>{error}</ErrorMessage>
                <Label>Enter Verification Code</Label>
                <OTPRow>
                    {otp.map((v, i) => (
                        <OTPInput
                            key={i}
                            ref={otpRefs[i]}
                            maxLength={1}
                            value={v}
                            onChange={e => handleOtp(i, e.target.value)}
                            onKeyDown={e => handleOtpKey(i, e)}
                        />
                    ))}
                </OTPRow>
                <Label>New Password</Label>
                <InputWrap>
                    <Input 
                        $hasIcon 
                        placeholder="New Password" 
                        type={showNewPass ? "text" : "password"}
                        value={resetForm.newPassword}
                        onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                    />
                    <EyeBtn type="button" onClick={() => setShowNewPass(p => !p)}>{showNewPass ? <Eye /> : <EyeOff />}</EyeBtn>
                </InputWrap>
                <Label>Confirm Password</Label>
                <InputWrap>
                    <Input 
                        $hasIcon 
                        placeholder="Confirm Password" 
                        type={showConfPass ? "text" : "password"}
                        value={resetForm.confirmPassword}
                        onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                    />
                    <EyeBtn type="button" onClick={() => setShowConfPass(p => !p)}>{showConfPass ? <Eye /> : <EyeOff />}</EyeBtn>
                </InputWrap>
                <PrimaryBtn onClick={handleResetPassword} disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</PrimaryBtn>
            </RightPanel>
        ),
    };

    return (
        <Outer $bg={bg}>
            <Card>
                <LeftPanel $color={bg}>
                    <Logo><LogoSvg /></Logo>
                    <VRImage src={img} alt="VR" />
                </LeftPanel>
                {screens[screen]}
            </Card>
        </Outer>
    );
}