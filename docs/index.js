
const get = id => document.getElementById(id);

function main() {
    get('loading').classList.add('hidden')
    get('encrypt').classList.remove('hidden')
    get('encrypt-message').onchange = updateEncryptOutput;
    get('encrypt-message').onkeyup = updateEncryptOutput;
    get('encrypt-password').onchange = updateEncryptOutput;
    get('encrypt-output-copy').onclick = copyLink;

    // if ()
    // get('encrypt-message').value = 'updateEncryptOutput';
    // get('encrypt-password').value = 'updateEncryptOutput';
    // updateEncryptOutput();
}

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
    console.log('hi', message)
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
