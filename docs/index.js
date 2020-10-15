
const get = id => document.getElementById(id);

function main() {
    get('loading').classList.add('hidden')
    get('encrypt-message').onchange  = updateEncryptOutput;
    get('encrypt-message').onkeyup   = updateEncryptOutput;
    get('encrypt-password').onchange = updateEncryptOutput;
    get('encrypt-password').onkeyup  = updateEncryptOutput;
    get('encrypt-output-copy').onclick = copyLink;
    get('decrypt-password').onchange = updateDecryptOutput;
    get('decrypt-password').onkeyup = hidePasswordError;

    const url = new URL(document.location);
    const cyphertext = url.searchParams.get('m');
    const want_hash = url.searchParams.get('h');
    if (cyphertext) {
        get('decrypt').classList.remove('hidden')
        get('decrypt-cyphertext').value = cyphertext;
        get('decrypt-pwhash').value = want_hash;
    } else {
        get('encrypt').classList.remove('hidden')
    }
}


//
// Decrypt
//

function updateDecryptOutput() {
    const password = get('decrypt-password').value;
    const want_hash = get('decrypt-pwhash').value;
    if (want_hash && want_hash != pwhash(password)) {
        if (password.toLowerCase().startsWith('password')) {
            document.location = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // HAHA
        }
        get('decrypt-wrong-password').classList.remove('hidden');
        get('decrypt-plaintext').classList.add('hidden')
        return
    }
    hidePasswordError();
    const plain_textarea = get('decrypt-plaintext');
    plain_textarea.classList.remove('hidden');
    const plaintext = CryptoJS.AES.decrypt(get('decrypt-cyphertext').value, password).toString(CryptoJS.enc.Utf8);
    plain_textarea.textContent = plaintext;
}

function hidePasswordError(e) {
    if (e && e.key == "Enter") return
    get('decrypt-wrong-password').classList.add('hidden');
}


//
// Encrypt
//


function copyLink(e) {
    e.preventDefault();
    navigator.clipboard.writeText(get('encrypt-output-link').href + '').then(
        (a) => { get('encrypt-output-copy').textContent = `Copied.`; },
        (a) => { get('encrypt-output-copy').textContent = `copy failed :(`; console.error(a) },
    );
}

function updateEncryptOutput() {
    const message = get('encrypt-message').value;
    const password = get('encrypt-password').value;

    const out_container = get('encrypt-output');
    if (!message || !password) {
        out_container.classList.add('hidden');
        return
    }

    out_container.classList.remove('hidden');
    const link = get('encrypt-output-link');
    const url = new URL(document.location);
    for (const [k, v] of url.searchParams.entries()) {
        url.searchParams.delete(k);
    }
    url.searchParams.append('m', encrypt(message, password))
    url.searchParams.append('h', pwhash(password))
    url.hash = ''
    link.textContent = url;
    link.href = url;
    get('encrypt-output-copy').textContent = `Copy`;
}

const salt = 'spies win';
function pwhash(password) {
    return (CryptoJS.SHA256(password + salt) + '').slice(0, 8);
}

function encrypt(message, password) {
    const o = CryptoJS.AES.encrypt(message, password);
    return '' + (CryptoJS.AES.encrypt(message, password));
}

main();
