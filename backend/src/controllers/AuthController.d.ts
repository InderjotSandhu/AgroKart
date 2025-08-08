import { Request, Response } from 'express';
export declare class AuthController {
    /**
     * Register a new user
     */
    register: (req: Request, res: Response) => Promise<void>;
    /**
     * Login user
     */
    login: (req: Request, res: Response) => Promise<void>;
    /**
     * Logout user
     */
    logout: (req: Request, res: Response) => Promise<void>;
    /**
     * Refresh JWT token
     */
    refreshToken: (req: Request, res: Response) => Promise<void>;
    /**
     * Verify JWT token
     */
    verifyToken: (req: Request, res: Response) => Promise<void>;
    /**
     * Request password reset
     */
    forgotPassword: (req: Request, res: Response) => Promise<void>;
    /**
     * Reset password
     */
    resetPassword: (req: Request, res: Response) => Promise<void>;
    /**
     * Verify email address
     */
    verifyEmail: (req: Request, res: Response) => Promise<void>;
    /**
     * Resend verification email
     */
    resendVerification: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map