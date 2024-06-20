class RoleBuilder {
    constructor() {
        this.role = {
            id: 1,
            name: 'user',
        };
    }

    withId(id) {
        this.role.id = id;
        return this;
    }

    withName(name) {
        this.role.name = name;
        return this;
    }

    build() {
        return this.role;
    }
}

module.exports = RoleBuilder;
