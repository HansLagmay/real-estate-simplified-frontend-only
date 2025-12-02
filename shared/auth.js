/**
 * Auth Module
 * Handles mock authentication using localStorage
 */

const Auth = {
    login(email, password) {
        const users = Storage.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Don't store password in session
            const sessionUser = { ...user };
            delete sessionUser.password;
            Storage.setCurrentUser(sessionUser);
            return { success: true, user: sessionUser };
        }
        
        return { success: false, error: 'Invalid email or password' };
    },

    logout() {
        Storage.clearCurrentUser();
        return { success: true };
    },

    getCurrentUser() {
        return Storage.getCurrentUser();
    },

    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    },

    isAgent() {
        const user = this.getCurrentUser();
        return user && user.role === 'agent';
    },

    requireAuth(requiredRole = null) {
        const user = this.getCurrentUser();
        
        if (!user) {
            return { success: false, error: 'Not logged in' };
        }
        
        if (requiredRole && user.role !== requiredRole) {
            return { success: false, error: 'Insufficient permissions' };
        }
        
        return { success: true, user };
    },

    // Redirect helpers
    redirectToLogin(portalType) {
        const loginPages = {
            admin: '../admin/index.html',
            agent: '../agent/index.html'
        };
        window.location.href = loginPages[portalType] || '../admin/index.html';
    },

    redirectToDashboard(role) {
        if (role === 'admin') {
            window.location.href = '../admin/index.html#dashboard';
        } else if (role === 'agent') {
            window.location.href = '../agent/index.html#dashboard';
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
