const bcrypt = require('bcrypt');



const generatePassword = async () => {
    const password = "pass"
    const hash = await bcrypt.hash(password, 0);
    console.log(hash);
}

generatePassword();