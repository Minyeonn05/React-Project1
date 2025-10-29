import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directoryPath = './users';

function generateAlphaNumericUid(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function login(req, res) {
    const { email, password } = req.body;
    const user = {
        userAt: new Date(), email, password
    }

    const filePath = path.join(__dirname, "..", "data", "user.json");
    //step 1 - 2 : read the existing file an parse it into an arry
    let users = [];
    let emailDupli = -1;
    let passDupli = -1;

    if (fs.existsSync(filePath)) {
        let data = fs.readFileSync(filePath, "utf-8");
        users = JSON.parse(data);
        for (let i = 0; i <= users.length; i++) {
            if (users[i] && users[i].email === user.email) {
                emailDupli = i;
                break;
            }
        }
        for (let i = 0; i <= users.length; i++) {
            if (users[i] && users[i].password === user.password) {
                passDupli = i;
                break;
            }
        }
        for (let i = 0; i <= users.length; i++) {
            if (users[i] && users[i].password === user.password && users[i].email === user.email) {
                emailDupli = i;
                passDupli = i;
                break;
            }
        }
        if (emailDupli != -1) {
            if (passDupli == -1) {
                console.log('Incorrected Username or Password', { email });
                res.status(400).json({ status: 'Incorrected Username or Password', user })
            } else {
                if (emailDupli == passDupli) {
                    console.log('Login successfully', { email });
                    res.status(200).json({ status: 'Login successfully', email })
                } else if (emailDupli != passDupli) {
                    console.log('Incorrected Username or Password', { email });
                    res.status(400).json({ status: 'Incorrected Username or Password', user })
                }
            }
        } else {
            console.log('Incorrected Username or Password', { email });
            res.status(400).json({ status: 'Incorrected Username or Password', user })
        }

    } else {
        console.log('Login error', { email });
        res.status(400).json({ status: 'Login fail', user })
    }

    // console.log('Content form summited', {email});
    // res.status(200).json({message : 'Email Received'});
}

function register(req, res) {
    const { fname, lname, email, password } = req.body;

    const filePath = path.join(__dirname, "..", "data", "user.json");
    //step 1 - 2 : read the existing file an parse it into an arry
    let users = [];
    let userslist = [];
    let emailDupli = false;
    let id = '';
    let idDupli = true;

    if (fs.existsSync(filePath)) {
        let data = fs.readFileSync(filePath, "utf-8");
        users = JSON.parse(data);
        while (idDupli == true) {
            id = generateAlphaNumericUid(32);
            for (let j = 0; j < users.length; j++) {
                if (users[j].id !== id) {
                    idDupli = false;
                }
            }
        }
        const user = {
            userAt: new Date(), id, email, password
        }
        for (let i = 0; i < users.length; i++) {
            if (users[i] && users[i].email === user.email) {
                emailDupli = true;
                break;
            }
        }
        if (emailDupli == false) {
            //step 3 : append new data
            users.push(user)
            //step 4 : write array back into file
            fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
            const userFile = path.join(__dirname, "..", "users", `${id}.json`);
            if (fs.existsSync(userFile)) {
                let dataUser = fs.readFileSync(userFile, "utf-8");
                userslist = JSON.parse(dataUser);
                let userp = {
                    fname: fname, lname: lname, profile: '/users/img/blank-profile-picture.webp', address: [], orders: []
                };
                userslist.push(userp);
                fs.writeFileSync(userFile, JSON.stringify(userslist, null, 2));
            } else {
                let userp = {
                    fname: fname, lname: lname, profile: '/users/img/blank-profile-picture.webp', address: [], orders: []
                };
                userslist.push(userp);
                fs.writeFileSync(userFile, JSON.stringify(userslist, null, 2));
            }
            console.log('Register successfully', { email });
            res.status(200).json({ status: 'Register successfully', user })
        } else {
            console.log('This email has already been used', { email });
            res.status(400).json({ status: 'This email has already been used', user })
        }

    } else {
        id = generateAlphaNumericUid(32);
        const user = {
            userAt: new Date(), id, email, password
        }
        users.push(user)
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
        const userFile = path.join(__dirname, "..", "users", `${id}.json`);
        if (fs.existsSync(userFile)) {
            let dataUser = fs.readFileSync(userFile, "utf-8");
            userslist = JSON.parse(dataUser);
            let userp = {
                fname: fname, lname: lname, profile: '/users/img/blank-profile-picture.webp', address: [], orders: []
            };
            userslist.push(userp);
            fs.writeFileSync(userFile, JSON.stringify(userslist, null, 2));
        } else {
            let userp = {
                fname: fname, lname: lname, profile: '/users/img/blank-profile-picture.webp', address: [], orders: []
            };
            userslist.push(userp);
            fs.writeFileSync(userFile, JSON.stringify(userslist, null, 2));
        }
        console.log('Register successfully', { email });
        res.status(200).json({ status: 'Register successfully', user })
    }

    // console.log('Content form summited', {email});
    // res.status(200).json({message : 'Email Received'});
}

function changePass(req, res) {
    const { email, currentPass, newPass, samePass } = req.body;

    const filePath = path.join(__dirname, "..", "data", "user.json");
    let users = [];
    let userIndex = -1;

    if (fs.existsSync(filePath)) {
        let data = fs.readFileSync(filePath, "utf-8");
        users = JSON.parse(data);
        //console.log(users);

        for (let i = 0; i < users.length; i++) {
            if (users[i] && users[i].email === email && users[i].password === currentPass) {
                userIndex = i;
                break;
            }
        }

        if (userIndex == -1) {
            console.log('Check your oldPass', { email });
            res.status(400).json({ status: 'Check your oldPass' })
        } else {
            if (newPass == samePass) {
                users[userIndex].password = newPass;
                fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
                console.log('Change Password successfully');
                res.status(200).json({ status: 'Change Password successfully' })
            } else {
                console.log('Check your newPass', { email });
                res.status(400).json({ status: 'Check your newPass' })
            }
        }
    } else {
        console.log('error not have file');
        res.status(400).json({ status: 'error not have file' })
    }

}

async function addOrder(req, res) {
    const { email, order } = req.body;
    let findIdFile = false;
    let datas = [];
    let usedata = [];
    let id = '';
    const filePathUser = path.join(__dirname, "..", "data", "user.json");
    if (fs.existsSync(filePathUser)) {
        let dat = fs.readFileSync(filePathUser, "utf-8");
        usedata = JSON.parse(dat);
        for (let p = 0; p < usedata.length; p++) {
            if (usedata[p].email == email) {
                id = usedata[p].id;
                break;
            }
        }
        //console.log(id);
        if (id == '') {
            console.log('AddOrder IdNotFind error', { order });
            res.status(400).json({ status: 'AddOrder IdNotFind error', order })
        } else {
            try {
                const filesAndFolders = await fs.readdirSync(directoryPath); // No callback needed here!
                //console.log('ไฟล์และโฟลเดอร์ใน', directoryPath, ':', filesAndFolders);
                //files = JSON.parse(filesAndFolders);
                for (let i = 0; i < filesAndFolders.length; i++) {
                    if (filesAndFolders[i] == id + '.json') {
                        findIdFile = true;
                        break;
                    }
                }
                if (findIdFile) {
                    const filePath = path.join(__dirname, "..", "users", `${id}.json`);
                    let data = fs.readFileSync(filePath, "utf-8");
                    datas = JSON.parse(data);
                    datas[0].orders.push(order);
                    fs.writeFileSync(filePath, JSON.stringify(datas, null, 2));
                    console.log('AddOrder successfully', { order });
                    res.status(200).json({ status: 'AddOrder successfully', order })
                } else {
                    console.log('AddOrder DontHaveFile error', { order });
                    res.status(200).json({ status: 'AddOrder DontHaveFile error', order })
                }
            } catch (err) {
                console.error('เกิดข้อผิดพลาดในการอ่าน directory:', err);
            }
        }
    } else {
        console.log('AddOrder FileNotFind error', { order });
        res.status(400).json({ status: 'AddOrder FileNotFind error', order })
    }

}
async function removeOrder(req, res) {
    const { email, index } = req.body;
    let findIdFile = false;
    let datas = [];
    let usedata = [];
    let id = '';
    const filePathUser = path.join(__dirname, "..", "data", "user.json");
    if (fs.existsSync(filePathUser)) {
        let dat = fs.readFileSync(filePathUser, "utf-8");
        usedata = JSON.parse(dat);
        for (let p = 0; p < usedata.length; p++) {
            if (usedata[p].email == email) {
                id = usedata[p].id;
                break;
            }
        }
        //console.log(id);
        if (id == '') {
            console.log('RemoveOrder IdNotFind error', { index });
            res.status(400).json({ status: 'RemoveOrder IdNotFind error', index })
        } else {
            try {
                const filesAndFolders = await fs.readdirSync(directoryPath); // No callback needed here!
                //console.log('ไฟล์และโฟลเดอร์ใน', directoryPath, ':', filesAndFolders);
                //files = JSON.parse(filesAndFolders);
                for (let i = 0; i < filesAndFolders.length; i++) {
                    if (filesAndFolders[i] == id + '.json') {
                        findIdFile = true;
                        break;
                    }
                }
                if (findIdFile) {
                    const filePath = path.join(__dirname, "..", "users", `${id}.json`);
                    let data = fs.readFileSync(filePath, "utf-8");
                    datas = JSON.parse(data);
                    const removeorder = datas[0].orders.splice(index, 1);
                    fs.writeFileSync(filePath, JSON.stringify(datas, null, 2));
                    console.log('RemoveOrder successfully', { index });
                    res.status(200).json({ status: 'RemoveOrder successfully', index })
                } else {
                    console.log('RemoveOrder DontHaveFile error', { index });
                    res.status(200).json({ status: 'RemoveOrder DontHaveFile error', index })
                }
            } catch (err) {
                console.error('เกิดข้อผิดพลาดในการอ่าน directory:', err);
            }
        }
    } else {
        console.log('RemoveOrder FileNotFind error', { index });
        res.status(400).json({ status: 'RemoveOrder FileNotFind error', index })
    }
}
async function addAddress(req, res) {
    const { email, address } = req.body;
    let findIdFile = false;
    let datas = [];
    let usedata = [];
    let id = '';
    const filePathUser = path.join(__dirname, "..", "data", "user.json");
    if (fs.existsSync(filePathUser)) {
        let dat = fs.readFileSync(filePathUser, "utf-8");
        usedata = JSON.parse(dat);

        for (let p = 0; p < usedata.length; p++) {
            if (usedata[p].email == email) {
                id = usedata[p].id;
                break;
            }
        }
        //console.log(id);
        if (id == '') {
            console.log('addAddress IdNotFind error', { address });
            res.status(400).json({ status: 'addAddress IdNotFind error', address })
        } else {
            try {
                const filesAndFolders = await fs.readdirSync(directoryPath); // No callback needed here!
                //console.log('ไฟล์และโฟลเดอร์ใน', directoryPath, ':', filesAndFolders);
                //files = JSON.parse(filesAndFolders);
                for (let i = 0; i < filesAndFolders.length; i++) {
                    if (filesAndFolders[i] == id + '.json') {
                        findIdFile = true;
                        break;
                    }
                }
                if (findIdFile) {
                    const filePath = path.join(__dirname, "..", "users", `${id}.json`);
                    let data = fs.readFileSync(filePath, "utf-8");
                    datas = JSON.parse(data);
                    datas[0].address.push(address);
                    fs.writeFileSync(filePath, JSON.stringify(datas, null, 2));
                    console.log('addAddress successfully', { address });
                    res.status(200).json({ status: 'addAddress successfully', address })
                } else {
                    console.log('addAddress DontHaveFile error', { address });
                    res.status(200).json({ status: 'addAddress DontHaveFile error', address })
                }
            } catch (err) {
                console.error('เกิดข้อผิดพลาดในการอ่าน directory:', err);
            }
        }
    } else {
        console.log('addAddress FileNotFind error', { address });
        res.status(400).json({ status: 'addAddress FileNotFind error', address })
    }
}
async function removeAddress(req, res) {
    const { email, index } = req.body;
    let findIdFile = false;
    let datas = [];
    let usedata = [];
    let id = '';
    const filePathUser = path.join(__dirname, "..", "data", "user.json");
    if (fs.existsSync(filePathUser)) {
        let dat = fs.readFileSync(filePathUser, "utf-8");
        usedata = JSON.parse(dat);
        for (let p = 0; p < usedata.length; p++) {
            if (usedata[p].email == email) {
                id = usedata[p].id;
                break;
            }
        }
        //console.log(id);
        if (id == '') {
            console.log('removeAddress IdNotFind error', { index });
            res.status(400).json({ status: 'removeAddress IdNotFind error', index })
        } else {
            try {
                const filesAndFolders = await fs.readdirSync(directoryPath); // No callback needed here!
                //console.log('ไฟล์และโฟลเดอร์ใน', directoryPath, ':', filesAndFolders);
                //files = JSON.parse(filesAndFolders);
                for (let i = 0; i < filesAndFolders.length; i++) {
                    if (filesAndFolders[i] == id + '.json') {
                        findIdFile = true;
                        break;
                    }
                }
                if (findIdFile) {
                    const filePath = path.join(__dirname, "..", "users", `${id}.json`);
                    let data = fs.readFileSync(filePath, "utf-8");
                    datas = JSON.parse(data);
                    const removeorder = datas[0].address.splice(index, 1);
                    fs.writeFileSync(filePath, JSON.stringify(datas, null, 2));
                    console.log('removeAddress successfully', { index });
                    res.status(200).json({ status: 'removeAddress successfully', index })
                } else {
                    console.log('removeAddress DontHaveFile error', { index });
                    res.status(200).json({ status: 'removeAddress DontHaveFile error', index })
                }
            } catch (err) {
                console.error('เกิดข้อผิดพลาดในการอ่าน directory:', err);
            }
        }
    } else {
        console.log('removeAddress FileNotFind error', { index });
        res.status(400).json({ status: 'removeAddress FileNotFind error', index })
    }
}

export const userService = {
    login,
    register,
    changePass,
    addOrder,
    removeOrder,
    addAddress,
    removeAddress
};