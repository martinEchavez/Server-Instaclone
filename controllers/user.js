const User = require('../models/user');
const bcriptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

function createToken(user, SECRET_KEY, expiresIn) {
    const { id, name, username, email } = user;
    const payload = {
        id,
        name,
        username,
        email,
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

async function register(input) {
    const newUser = input;
    newUser.email = newUser.email.toLowerCase();
    newUser.username = newUser.username.toLowerCase();

    const { email, username, password } = newUser;

    // Revisamos si el email ya está en uso
    const foundEmail = await User.findOne({ email });
    if (foundEmail) throw new Error('El Correo electrónico ya está en uso');

    // Revisamos si el username ya está en uso
    const foundUsername = await User.findOne({ username });
    if (foundUsername) throw new Error('El Nombre de usuario ya está en uso');

    // Encriptar contraseña
    const salt = await bcriptjs.genSalt(10);
    newUser.password = await bcriptjs.hash(password, salt);

    try {
        const user = new User(newUser);
        user.save();
        return user;
    } catch (error) {
        console.log(error.message);
    }
}

async function login(input) {
    const { email, password } = input;

    const userFound = await User.findOne({ email: email.toLowerCase() });
    if (!userFound) throw new Error('Error en el email o contraseña');

    const passwordSucess = await bcriptjs.compare(password, userFound.password);
    if (!passwordSucess) throw new Error('Error en el email o contraseña');

    return {
        token: createToken(userFound, process.env.SECRET_KEY, "12h")
    }
}

module.exports = {
    register,
    login
}