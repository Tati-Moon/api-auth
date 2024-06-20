class UserBuilder {
    constructor() {
        this.user = {
            id: 1,
            username: 'testuser',
            password: 'testpassword',
            hashedPassword: 'hashedpassword',
            email: 'test@example.com',
            phone: '+375291234567',
            firstName: 'Test',
            lastName: 'User',
            isActive: true,
            loginAttemptsCount: 0,
            roles: [],
        };
    }

    withId(id) {
        this.user.id = id;
        return this;
    }

    withUsername(username) {
        this.user.username = username;
        return this;
    }

    withPassword(password) {
        this.user.password = password;
        return this;
    }

    withHashedPassword(hashedPassword) {
        this.user.hashedPassword = hashedPassword;
        return this;
    }

    withEmail(email) {
        this.user.email = email;
        return this;
    }

    withPhone(phone) {
        this.user.phone = phone;
        return this;
    }

    withFirstName(firstName) {
        this.user.firstName = firstName;
        return this;
    }

    withLastName(lastName) {
        this.user.lastName = lastName;
        return this;
    }

    withIsActive(isActive) {
        this.user.isActive = isActive;
        return this;
    }

    withLoginAttemptsCount(count) {
        this.user.loginAttemptsCount = count;
        return this;
    }

    withRoles(roles) {
        this.user.roles = roles;
        return this;
    }

    build() {
        return this.user;
    }
}

module.exports = UserBuilder;
