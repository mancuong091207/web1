const signin = document.getElementById("sign-in");
const signoutBtn = document.getElementById("sign-out");
const textUserInfo = document.getElementById("accountBtn");
const _signinTab = document.querySelector("#signin_tab");
const _signupTab = document.querySelector("#signup_tab");
const inputSignupUser = document.getElementById("user");
const inputSignupPass = document.getElementById("pass");
const inputAddress = document.getElementById("address");
const inputFullname = document.getElementById("fullname");
const inputPhone = document.getElementById("phone");
const inputEmail = document.getElementById("email");
const signupBtn = document.getElementById("signup_Btn");
const inputSigninUser = document.getElementById("user1");
const inputSigninPass = document.getElementById("pass1");
const signinBtn = document.getElementById("signin_Btn");
const closeBtns = document.querySelectorAll(".closeBtn");
const infoName = document.getElementById("infoName");
const infoBtn = document.getElementById("infoBtn");
const historyBuy = document.getElementById("historyBuyBtn");
const infoUser = document.getElementById("user_account");
const infoPass = document.getElementById("pass_account");
const infoEmail = document.getElementById("email_account");
const infoAddress = document.getElementById("address_account");
const infoFullname = document.getElementById("fullname_account");
const infoPhone = document.getElementById("phone_account");
const edit_Fullname = document.querySelector("#edit_fullname");
const edit_Phone = document.querySelector("#edit_phone");
const edit_User = document.querySelector("#edit_user");
const edit_Pass = document.querySelector("#edit_pass");
const edit_Email = document.querySelector("#edit_email");
const edit_Address = document.querySelector("#edit_address");
const saveInfo = document.querySelector(".saveInfo");
const saveInfo1 = document.querySelector(".saveInfo1");
const saveInfo2 = document.querySelector(".saveInfo2");
const saveInfo3 = document.querySelector(".saveInfo3");
const saveInfo4 = document.querySelector(".saveInfo4");
const saveInfo5 = document.querySelector(".saveInfo5");
const _checkPass = document.querySelector("#check_pass");
const oldPass = document.querySelector("#old_pass");
const newPass = document.querySelector("#new_pass");
const showPass1 = document.getElementById("show-pass1");
const showPass2 = document.getElementById("show-pass2");


function _getAccounts() {
    return JSON.parse(localStorage.getItem("accounts")) || [];
}
function _isValidPhone(phone) {
    return /^0\d{9}$/.test(phone); // 10 số, bắt đầu bằng 0
}
function _saveAccounts(accounts) {
    localStorage.setItem("accounts", JSON.stringify(accounts));
}

function _getCurrentUser() {
    return sessionStorage.getItem("currentUser");
}

function _isLogged() {
    return _getCurrentUser() !== null;
}

function show(element, type = "block") {
    element.style.display = type;
}

function hide(element) {
    element.style.display = "none";
}

function toggleShowPass1() {
    if (showPass1.checked) {
        inputSigninPass.type = "text";
    }
    else {
        inputSigninPass.type = "password";
    }
}
function toggleShowPass2() {
    if (showPass2.checked) {
        inputSignupPass.type = "text";
    }
    else {
        inputSignupPass.type = "password";
    }
}

function _update() {
    if (_isLogged()) {
        hide(signin);
        infoName.textContent = _getCurrentUser();
        show(textUserInfo);
    } else {
        show(signin);
        hide(textUserInfo);
    }
}

function open_signinTab() {
    show(_signinTab, "flex");
    hide(_signupTab);
}

function open_signupTab() {
    show(_signupTab, "flex");
    hide(_signinTab);
}

function _closeAllTabs() {
    hide(_signinTab);
    hide(_signupTab);
    hide(_checkPass);
    history.replaceState(null, "", location.pathname + location.search);
}

function _hashChange() {
    const accountSection = document.getElementById("account");
    if (location.hash === "#account") {
        if (_isLogged()) _showinfo();
        return;
    }
    accountSection.hidden = true;

    const historyBuySection = document.getElementById("history");
    if (location.hash === "#history") {
        if (_isLogged()) _showhistory();
        return;
    }
    historyBuySection.hidden = true;

    if (_isLogged()) return;
    if (location.hash === "#signup_tab")
        open_signupTab();
    else if (location.hash === "#signin_tab")
        open_signinTab();
}

window.addEventListener("hashchange", _hashChange);

function _signup() {
    const username = inputSignupUser.value.trim();
    const fullname = inputFullname.value.trim();
    const phone = inputPhone.value.trim();
    const password = inputSignupPass.value.trim();
    const email = inputEmail.value.trim();
    const address = inputAddress.value.trim();
    if (username === "" || fullname === "" || phone === "" || password === "" || email === "" || address === "") {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }
    if (!_isValidPhone(phone)) {
        alert("Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).");
        return;
    }
    const accounts = _getAccounts();
    if (accounts.some(function (acc) { return acc.username === username; })) {
        alert("Username đã tồn tại");
        return;
    }
    if (accounts.some(function (acc) { return acc.email === email; })) {
        alert("Email đã tồn tại");
        return;
    }
    if (accounts.some(function (acc) { return acc.phone === phone; })) {
        alert("Số điện thoại đã tồn tại");
        return;
    }
    const newAccount = {
        id: crypto.randomUUID(),
        username: username,
        fullname: fullname,
        phone: phone,
        password: password,
        email: email,
        address: address,
        locked: false
    };
    accounts.push(newAccount);
    _saveAccounts(accounts);

    alert("Đăng ký thành công.");
    _closeAllTabs();
    open_signinTab();
}


function _signin() {
    const username = inputSigninUser.value.trim();
    const password = inputSigninPass.value.trim();
    if (username === "" || password === "") {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }
    const accounts = _getAccounts();
    const account = accounts.find(function (acc) {
        return acc.username === username && acc.password === password;
    });
    if (!account) {
        alert("Sai tài khoản hoặc mật khẩu.");
        return;
    }

    if (account.locked) {
        alert("Tài khoản của bạn đã bị khóa.");
        return;
    }
    //ghi lại tài khoản đang đăng nhập
    sessionStorage.setItem("currentUser", account.username);
    sessionStorage.setItem("currentUserId", account.id);
    _closeAllTabs();
    location.reload();
}

//hiện thông tin
function _showinfo() {
    document.querySelector(".cart_ui").hidden = true;
    document.getElementById("chi-tiet-san-pham").hidden = true;
    document.getElementById("san-pham").hidden = true;
    document.getElementById("account").hidden = false;
    document.getElementById("history").hidden = true;
    const accounts = _getAccounts();
    const account = accounts.find(function (acc) {
        return acc.id === sessionStorage.getItem("currentUserId");
    });
    infoUser.value = account.username;
    infoPass.value = account.password;
    infoEmail.value = account.email;
    infoAddress.value = account.address;
    infoFullname.value = account.fullname || "";
    infoPhone.value = account.phone || "";

}
// Phần Lịch sử đơn hàng
function _formatMoney(n) {
    return Number(n).toLocaleString("vi-VN") + " VNĐ";
}

// chống chèn HTML từ dữ liệu người dùng nhập (họ tên, địa chỉ, ghi chú)
function _escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
}

// trạng thái đơn: đơn cũ "Chờ xử lý" coi như "Đang xử lý"
// thêm nút hủy đơn hàng
function _statusInfo(trangThai) {
    if (trangThai === "Chờ xử lý") trangThai = "Đang xử lý";
    if (trangThai === "Hủy" || trangThai === "Đã hủy") {
        return { text: "Đã hủy", cls: "status-cancel" };
    }
    const cls = trangThai === "Chờ thanh toán" ? "status-wait" : "status-processing";
    return { text: trangThai, cls: cls };
}
//hiện lịch sử mua
function _showhistory() {
    // --- phần ẩn/hiện giữ như cấu trúc ban đầu ---
    document.querySelector(".cart_ui").hidden = true;
    document.getElementById("chi-tiet-san-pham").hidden = true;
    document.getElementById("san-pham").hidden = true;
    document.getElementById("account").hidden = true;
    const historySection = document.getElementById("history");
    historySection.hidden = false;

    // --- phần phát triển thêm: đổ danh sách đơn hàng ---
    const userId = sessionStorage.getItem("currentUserId");
    const orders = (JSON.parse(localStorage.getItem("orders")) || [])
        .filter(function (o) { return o.userId === userId; })
        .reverse();   // đơn mới nhất lên đầu

    let html = "<h1>Lịch sử mua hàng</h1>";

    if (orders.length === 0) {
        historySection.innerHTML = html + '<p class="history-trong">Bạn chưa có đơn hàng nào.</p>';
        return;
    }

    orders.forEach(function (don) {
        const st = _statusInfo(don.trangThai);
        const ngay = new Date(don.ngay).toLocaleString("vi-VN");
        const pt = don.phuongThuc === "online" ? "Thanh toán online" : "Tiền mặt khi nhận hàng";
        const nn = don.nguoiNhan || {};

        // vòng lặp này CHỈ vẽ các dòng sản phẩm, không có nút hủy
        let dong = "";
        don.items.forEach(function (it) {
            const sp = (typeof PRODUCTS !== "undefined")
                ? PRODUCTS.find(function (p) { return p.id === it.id; })
                : null;
            dong += `
            <div class="order-item">
                ${sp ? `<img src="${_escapeHtml(sp.hinh)}" alt="">` : ""}
                <div class="order-item-ten">${_escapeHtml(it.ten)}</div>
                <div class="order-item-sl">x${it.so}</div>
                <div class="order-item-gia">${_formatMoney(it.gia * it.so)}</div>
            </div>`;
        });

        // nút hủy nằm ở đây, mỗi đơn đúng 1 nút
        const nutHuy = st.text === "Đang xử lý"
            ? `<button type="button" class="nut-huy-don" data-id="${_escapeHtml(don.id)}">Hủy đơn hàng</button>`
            : "<span></span>";

        html += `
        <div class="order-card">
            <div class="order-head">
                <div>
                    <strong>Mã đơn: ${_escapeHtml(don.id.slice(0, 8).toUpperCase())}</strong>
                    <small>${_escapeHtml(ngay)}</small>
                </div>
                <span class="order-status ${st.cls}">${_escapeHtml(st.text)}</span>
            </div>
            <div class="order-items">${dong}</div>
            <div class="order-info">
                <p><span>Người nhận:</span> ${_escapeHtml(nn.ten)} - ${_escapeHtml(nn.sdt)}</p>
                <p><span>Địa chỉ:</span> ${_escapeHtml(nn.diaChi)}</p>
                ${nn.ghiChu ? `<p><span>Ghi chú:</span> ${_escapeHtml(nn.ghiChu)}</p>` : ""}
                <p><span>Thanh toán:</span> ${pt}</p>
            </div>
            <div class="order-total">
                ${nutHuy}
                <div>Tổng tiền: <strong>${_formatMoney(don.tong)}</strong></div>
            </div>
        </div>`;
    });


    historySection.innerHTML = html;
}
// Hủy đơn hangg
function _huyDon(orderId) {
    const userId = sessionStorage.getItem("currentUserId");
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const don = orders.find(function (o) { return o.id === orderId && o.userId === userId; });
    if (!don) return;

    // chỉ hủy được khi còn đang xử lý
    if (_statusInfo(don.trangThai).text !== "Đang xử lý") {
        alert("Đơn hàng này không thể hủy.");
        _showhistory();
        return;
    }
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;

    don.trangThai = "Đã hủy";
    don.ngayHuy = new Date().toISOString();
    localStorage.setItem("orders", JSON.stringify(orders));

    // trả lại số lượng vào kho
    if (typeof PRODUCTS !== "undefined") {
        don.items.forEach(function (it) {
            const sp = PRODUCTS.find(function (p) { return p.id === it.id; });
            if (sp) sp.soluong = (sp.soluong || 0) + it.so;
        });
        localStorage.setItem("laptopShop", JSON.stringify(PRODUCTS));
    }

    alert("Đã hủy đơn hàng.");
    _showhistory();
}

//đăng xuất
function _signout() {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUserId");
    location.reload();
}


//click
signin.addEventListener("click", open_signinTab);
edit_User.addEventListener("click", function () {
    infoUser.disabled = false;
    saveInfo.style.display = "block";
    infoFullname.disabled = true;
    saveInfo4.style.display = "none";
    infoPhone.disabled = true;
    saveInfo5.style.display = "none";
    infoEmail.disabled = true;
    saveInfo2.style.display = "none";
    infoAddress.disabled = true;
    saveInfo3.style.display = "none";
    infoPass.disabled = true;
    saveInfo1.style.display = "none";
});
edit_Fullname.addEventListener("click", function () {
    infoUser.disabled = true;
    saveInfo.style.display = "none";
    infoFullname.disabled = false;
    saveInfo4.style.display = "block";
    infoPhone.disabled = true;
    saveInfo5.style.display = "none";
    infoEmail.disabled = true;
    saveInfo2.style.display = "none";
    infoAddress.disabled = true;
    saveInfo3.style.display = "none";
    infoPass.disabled = true;
    saveInfo1.style.display = "none";
});
edit_Phone.addEventListener("click", function () {
    infoUser.disabled = true;
    saveInfo.style.display = "none";
    infoFullname.disabled = true;
    saveInfo4.style.display = "none";
    infoPhone.disabled = false;
    saveInfo5.style.display = "block";
    infoEmail.disabled = true;
    saveInfo2.style.display = "none";
    infoAddress.disabled = true;
    saveInfo3.style.display = "none";
    infoPass.disabled = true;
    saveInfo1.style.display = "none";
});
edit_Pass.addEventListener("click", function () {
    infoPass.disabled = false;
    show(_checkPass, "flex");
    saveInfo1.style.display = "block";

    infoUser.disabled = true;
    saveInfo.style.display = "none";
    infoFullname.disabled = true;
    saveInfo4.style.display = "none";
    infoPhone.disabled = true;
    saveInfo5.style.display = "none";
    infoEmail.disabled = true;
    saveInfo2.style.display = "none";
    infoAddress.disabled = true;
    saveInfo3.style.display = "none";
});
function _saveEdit(accounts) {
    localStorage.setItem("accounts", JSON.stringify(accounts));
    infoUser.disabled = true;
    saveInfo.style.display = "none";
    infoFullname.disabled = true;
    saveInfo4.style.display = "none";
    infoPhone.disabled = true;
    saveInfo5.style.display = "none";
    infoEmail.disabled = true;
    saveInfo2.style.display = "none";
    infoAddress.disabled = true;
    saveInfo3.style.display = "none";
    infoPass.disabled = true;
    saveInfo1.style.display = "none";
}
edit_Email.addEventListener("click", function () {
    infoUser.disabled = true;
    saveInfo.style.display = "none";
    infoFullname.disabled = true;
    saveInfo4.style.display = "none";
    infoPhone.disabled = true;
    saveInfo5.style.display = "none";
    infoEmail.disabled = false;
    saveInfo2.style.display = "block";
    infoAddress.disabled = true;
    saveInfo3.style.display = "none";
    infoPass.disabled = true;
    saveInfo1.style.display = "none";
});
edit_Address.addEventListener("click", function () {
    infoUser.disabled = true;
    saveInfo.style.display = "none";
    infoFullname.disabled = true;
    saveInfo4.style.display = "none";
    infoPhone.disabled = true;
    saveInfo5.style.display = "none";
    infoEmail.disabled = true;
    saveInfo2.style.display = "none";
    infoAddress.disabled = false;
    saveInfo3.style.display = "block";
    infoPass.disabled = true;
    saveInfo1.style.display = "none";
});
saveInfo.addEventListener("click", function () {
    const username = infoUser.value.trim();


    if (username === "") {
        alert("Không được để trống.");
        return;
    }

    const accounts = _getAccounts();
    const isUsernameTaken = accounts.some(function (acc) {
        return acc.username === username && acc.id !== sessionStorage.getItem("currentUserId");
    });
    if (isUsernameTaken) {
        alert("Username đã tồn tại.");
        return;
    }
    const account = accounts.find(function (acc) {
        return acc.id === sessionStorage.getItem("currentUserId");
    });
    account.username = username;
    _saveEdit(accounts);
    sessionStorage.setItem("currentUser", username);
    infoName.textContent = username;

});
saveInfo1.addEventListener("click", function () {
    const accounts = _getAccounts();
    const account = accounts.find(function (acc) {
        return acc.id === sessionStorage.getItem("currentUserId");
    });
    if (oldPass.value !== account.password) {
        alert("Sai mật khẩu!");
        return;
    }
    const password = newPass.value.trim();
    if (password === "") {
        alert("Không được để trống.");
        return;
    }
    account.password = password;
    alert("Đã đổi mật khẩu thành công.");
    hide(_checkPass);
    _saveEdit(accounts);
});
saveInfo2.addEventListener("click", function () {
    const email = infoEmail.value.trim();
    const accounts = _getAccounts();
    if (email === "") {
        alert("Không được để trống.");
        return;
    }

    const isEmailTaken = accounts.some(function (acc) {
        return acc.email === email && acc.id !== sessionStorage.getItem("currentUserId");
    });
    if (isEmailTaken) {
        alert("Email đã tồn tại.");
        return;
    }
    const account = accounts.find(function (acc) {
        return acc.id === sessionStorage.getItem("currentUserId");
    });
    account.email = email;
    _saveEdit(accounts);

});
saveInfo3.addEventListener("click", function () {
    const address = infoAddress.value.trim();
    if (address === "") {
        alert("Không được để trống.");
        return;
    }
    const accounts = _getAccounts();
    const account = accounts.find(function (acc) {
        return acc.id === sessionStorage.getItem("currentUserId");
    });
    account.address = address;
    _saveEdit(accounts);


});
saveInfo4.addEventListener("click", function () {
    const fullname = infoFullname.value.trim();
    if (fullname === "") {
        alert("Không được để trống.");
        return;
    }
    const accounts = _getAccounts();
    const account = accounts.find(function (acc) {
        return acc.id === sessionStorage.getItem("currentUserId");
    });
    account.fullname = fullname;
    _saveEdit(accounts);
});

saveInfo5.addEventListener("click", function () {
    const phone = infoPhone.value.trim();
    if (phone === "") {
        alert("Không được để trống.");
        return;
    }
    if (!_isValidPhone(phone)) {
        alert("Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).");
        return;
    }
    const accounts = _getAccounts();
    const isPhoneTaken = accounts.some(function (acc) {
        return acc.phone === phone && acc.id !== sessionStorage.getItem("currentUserId");
    });
    if (isPhoneTaken) {
        alert("Số điện thoại đã tồn tại.");
        return;
    }
    const account = accounts.find(function (acc) {
        return acc.id === sessionStorage.getItem("currentUserId");
    });
    account.phone = phone;
    _saveEdit(accounts);
});

for (const btn of closeBtns) {
    btn.addEventListener("click", _closeAllTabs);
}

signupBtn.addEventListener("click", _signup);
signinBtn.addEventListener("click", _signin);
signoutBtn.addEventListener("click", _signout);
showPass1.addEventListener("click", toggleShowPass1);
showPass2.addEventListener("click", toggleShowPass2);
// hủy đơn event
document.getElementById("history").addEventListener("click", function (e) {
    const nut = e.target.closest(".nut-huy-don");
    if (nut) _huyDon(nut.dataset.id);
});


_hashChange();
//load lại giao diện
_update();