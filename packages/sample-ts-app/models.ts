class User {
    id: number
    name: string

    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
}

class UserRepo {
    async findUser(id: number) {
        if (id === 1) {
            return new User(1, 'User 1')
        } else if (id === 2) {
            return new User(2, 'User 2')
        } else {
            throw new Error('User not found')
        }
    }
}

class UserSerializer {
    toJSON(user: User) {
        return JSON.stringify(user)
    }
}

export {User, UserRepo, UserSerializer}
