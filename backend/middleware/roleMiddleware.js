/**
 * Role-Based Access Control (RBAC) Middleware
 * Verifies if the authenticated user has the necessary role permissions.
 *
 * @param {...string} allowedRoles - List of roles permitted to access the route
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized: No user session found.' });
        }

        const userRole = req.user.role || 'user';

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: `Forbidden: Access denied. Required role: [${allowedRoles.join(', ')}]. Current role: '${userRole}'`
            });
        }

        next();
    };
};

module.exports = { authorizeRoles };
