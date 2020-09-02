const userController = require('../controllers/user');

const resolvers = {
    Query: {
        getUser: () => {
            console.log('Obteniendo usuario..')
            return null;
        }
    },

    Mutation: {
        register: (_, { input }) => userController.register(input),
        login: (_, { input }) => userController.login(input)
    }
}

module.exports = resolvers;