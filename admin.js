const login = document.querySelector(".login-admin");
const adminpass = document.getElementById("admin_pass");
const loginBtn = document.getElementById("loginBtn");
const contain = document.querySelector(".contain");

const menu = document.querySelector(".menu");
const accounts_management_Btn = menu.querySelector("#accounts-management-Btn");
const products_management_Btn = menu.querySelector("#products-management-Btn");
const stock_management_Btn = menu.querySelector("#stock-management-Btn");
const orders_management_Btn = menu.querySelector("#orders-management-Btn");

const accounts_management = document.getElementById("accounts-management");
const products_management = document.getElementById("products-management");
const stock_management = document.getElementById("stock-management");
const orders_management = document.getElementById("orders-management");
const allTabs = [accounts_management, products_management, stock_management, orders_management];

const newBtn = document.getElementById("new-account");
const removeBtn = document.getElementById("remove-account");
const editBtn = document.getElementById("edit-account");
const lockBtn = document.getElementById("lock-account");
const unlockBtn = document.getElementById("unlock-account");
const saveBtn = document.getElementById("save-account");

const accountsBody = document.getElementById("accounts-body");

let isLogin = false;
let editingId = null;


function show(element, type = "block") {
    element.style.display = type;
}

function hide(element) {
    element.style.display = "none";
}


function _getAccounts() {
    return JSON.parse(localStorage.getItem("accounts")) || [];
}

function _saveAccounts(accounts) {
    localStorage.setItem("accounts", JSON.stringify(accounts));
}


function _update() {
    if (isLogin) {
        hide(login);
        show(contain);
    } else {
        show(login, "flex");
        hide(contain);
    }
}

function _login() {
    if (adminpass.value === "123") {
        isLogin = true;
        alert("Đăng nhập thành công!");
        _update();
    } else {
        alert("Sai mật khẩu.");
    }
}


function _openTab(tab) {
    for (const t of allTabs) {
        hide(t);
    }
    show(tab);
}


function _createInput(value) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.disabled = true;
    return input;
}

function _showAccounts() {
    accountsBody.innerHTML = "";

    for (const acc of _getAccounts()) {
        const tr = document.createElement("tr");
        tr.dataset.id = acc.id;

        const tdUser = document.createElement("td");
        const tdPass = document.createElement("td");
        const tdEmail = document.createElement("td");
        const tdAddress = document.createElement("td");
        const tdLock = document.createElement("td");
        const tdSelect = document.createElement("td");

        tdUser.appendChild(_createInput(acc.username));
        tdPass.appendChild(_createInput(acc.password));
        tdEmail.appendChild(_createInput(acc.email || ""));
        tdAddress.appendChild(_createInput(acc.address || ""));

        const dot = document.createElement("span");
        dot.className = "status-dot " + (acc.locked ? "locked" : "unlocked");
        tdLock.appendChild(dot);

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.dataset.id = acc.id;
        tdSelect.appendChild(cb);

        tr.append(tdUser, tdPass, tdEmail, tdAddress, tdLock, tdSelect);
        accountsBody.appendChild(tr);
    }
}


function _getSelected() {
    const checked = accountsBody.querySelectorAll("input[type=checkbox]:checked");
    if (checked.length === 0) {
        alert("Chọn ít nhất một tài khoản trước.");
        return null;
    }
    const ids = [];
    for (const cb of checked) {
        ids.push(cb.dataset.id);
    }
    return ids;
}

function _isEditing() {
    if (editingId !== null) {
        alert("Chưa lưu chỉnh sửa.");
        return true;
    }
    return false;
}

function _stopEdit() {
    editingId = null;
    hide(saveBtn);
    _showAccounts();
}


function _new() {
    if (_isEditing()) return;

    const username = prompt("Nhập username:");
    if (username === null) return;
    const password = prompt("Nhập password:");
    if (password === null) return;
    const email = prompt("Nhập email:");
    if (email === null) return;
    const address = prompt("Nhập địa chỉ:");
    if (address === null) return;

    if (username.trim() === "" || password.trim() === "" || email.trim() === "" || address.trim() === "") {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    const accounts = _getAccounts();
    const isUsernameTaken = accounts.some(function (acc) {
        return acc.username === username.trim();
    });
    if (isUsernameTaken) {
        alert("Username đã tồn tại.");
        return;
    }
    const isEmailTaken = accounts.some(function (acc) {
        return acc.email === email.trim();
    });
    if (isEmailTaken) {
        alert("Email đã tồn tại.");
        return;
    }

    accounts.push({
        id: crypto.randomUUID(),
        username: username.trim(),
        password: password.trim(),
        email: email.trim(),
        address: address.trim(),
        locked: false
    });
    _saveAccounts(accounts);
    _showAccounts();
}

function _remove() {
    if (_isEditing()) return;

    const ids = _getSelected();
    if (ids === null) return;
    if (!confirm("Chắc chắn xoá " + ids.length + " tài khoản?")) return;

    const accounts = _getAccounts().filter(function (acc) {
        return !ids.includes(acc.id);
    });
    _saveAccounts(accounts);
    _showAccounts();
}

function _edit() {
    if (editingId !== null) {
        _stopEdit();
        return;
    }

    const ids = _getSelected();
    if (ids === null) return;
    if (ids.length > 1) {
        alert("Chỉ được sửa 1 tài khoản");
        return;
    }

    editingId = ids[0];

    const row = accountsBody.querySelector('tr[data-id="' + editingId + '"]');
    for (const input of row.querySelectorAll("input[type=text]")) {
        input.disabled = false;
    }
    for (const cb of accountsBody.querySelectorAll("input[type=checkbox]")) {
        cb.disabled = true;
    }
    show(saveBtn);
}

function _save() {
    const row = accountsBody.querySelector('tr[data-id="' + editingId + '"]');
    const inputs = row.querySelectorAll("input[type=text]");
    const username = inputs[0].value.trim();
    const password = inputs[1].value.trim();
    const email = inputs[2].value.trim();
    const address = inputs[3].value.trim();

    if (username === "" || password === "" || email === "" || address === "") {
        alert("Không được để trống.");
        return;
    }

    const accounts = _getAccounts();
    const isUsernameTaken = accounts.some(function (acc) {
        return acc.username === username && acc.id !== editingId;
    });
    if (isUsernameTaken) {
        alert("Username đã tồn tại.");
        return;
    }
    const isEmailTaken = accounts.some(function (acc) {
        return acc.email === email && acc.id !== editingId;
    });
    if (isEmailTaken) {
        alert("Email đã tồn tại.");
        return;
    }

    const account = accounts.find(function (acc) {
        return acc.id === editingId;
    });
    account.username = username;
    account.password = password;
    account.email = email;
    account.address = address;

    _saveAccounts(accounts);
    _stopEdit();
}

function _setLocked(state) {
    if (_isEditing()) return;

    const ids = _getSelected();
    if (ids === null) return;

    const accounts = _getAccounts();
    let changed = 0;
    for (const acc of accounts) {
        if (ids.includes(acc.id) && acc.locked !== state) {
            acc.locked = state;
            changed++;
        }
    }

    if (changed === 0) {
        alert(state ? "Tất cả đã bị khoá" : "Tất cả đã mở khoá");
        return;
    }
    _saveAccounts(accounts);
    _showAccounts();
}


loginBtn.addEventListener("click", _login);

accounts_management_Btn.addEventListener("click", function () { _openTab(accounts_management); });
products_management_Btn.addEventListener("click", function () { _openTab(products_management); });
stock_management_Btn.addEventListener("click", function () { _openTab(stock_management); });
orders_management_Btn.addEventListener("click", function () { _openTab(orders_management); });

newBtn.addEventListener("click", _new);
removeBtn.addEventListener("click", _remove);
editBtn.addEventListener("click", _edit);
saveBtn.addEventListener("click", _save);
lockBtn.addEventListener("click", function () { _setLocked(true); });
unlockBtn.addEventListener("click", function () { _setLocked(false); });


_update();
_showAccounts();
_openTab(accounts_management);