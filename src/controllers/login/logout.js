module.exports = (req, res) => {
    // limpiar la sesion del usuario en el cliente
    return res
        .clearCookie('TokenID')
        .sendStatus(200);
}