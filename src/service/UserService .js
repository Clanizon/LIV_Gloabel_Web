export class UserService {
    _userKey = 'user';
    _roleKey = 'userRole';

    resetUser() {
        localStorage.removeItem(this._userKey);
        localStorage.removeItem(this._roleKey);
    }

    getUser() {
        return JSON.parse(localStorage.getItem(this._userKey));
    }

    setUser(data, role) {
        localStorage.setItem(this._userKey, JSON.stringify(data));
        localStorage.setItem(this._roleKey, role);
    }

    getUserRole() {
        return localStorage.getItem(this._roleKey) || 'user';
    }
}
