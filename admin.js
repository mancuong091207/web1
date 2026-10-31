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
function _isValidPhone(phone) {
    return /^0\d{9}$/.test(phone); // 10 số, bắt đầu bằng 0
}

function _showAccounts() {
    accountsBody.innerHTML = "";

    for (const acc of _getAccounts()) {
        const tr = document.createElement("tr");
        tr.dataset.id = acc.id;

const tdUser = document.createElement("td");
const tdFullname = document.createElement("td");
const tdPhone = document.createElement("td");
const tdPass = document.createElement("td");
const tdEmail = document.createElement("td");
const tdAddress = document.createElement("td");
const tdLock = document.createElement("td");
const tdSelect = document.createElement("td");

tdUser.appendChild(_createInput(acc.username));
tdFullname.appendChild(_createInput(acc.fullname || ""));
tdPhone.appendChild(_createInput(acc.phone || ""));
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

        tr.append(tdUser, tdFullname, tdPhone, tdPass, tdEmail, tdAddress, tdLock, tdSelect);
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
const username = prompt("Nhập username:");
if (username === null) return;
const fullname = prompt("Nhập họ tên:");
if (fullname === null) return;
const phone = prompt("Nhập số điện thoại:");
if (phone === null) return;
const password = prompt("Nhập password:");
if (password === null) return;
const email = prompt("Nhập email:");
if (email === null) return;
const address = prompt("Nhập địa chỉ:");
if (address === null) return;

if (username.trim() === "" || fullname.trim() === "" || phone.trim() === "" ||
    password.trim() === "" || email.trim() === "" || address.trim() === "") {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
}
if (!_isValidPhone(phone.trim())) {
    alert("Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).");
    return;
}

const accounts = _getAccounts();
// ... kiểm tra username, email giữ nguyên, thêm:
const isPhoneTaken = accounts.some(function (acc) {
    return acc.phone === phone.trim();
});
if (isPhoneTaken) {
    alert("Số điện thoại đã tồn tại.");
    return;
}

accounts.push({
    id: crypto.randomUUID(),
    username: username.trim(),
    fullname: fullname.trim(),
    phone: phone.trim(),
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
const inputs = row.querySelectorAll("input[type=text]");
const username = inputs[0].value.trim();
const fullname = inputs[1].value.trim();
const phone = inputs[2].value.trim();
const password = inputs[3].value.trim();
const email = inputs[4].value.trim();
const address = inputs[5].value.trim();

if (username === "" || fullname === "" || phone === "" || password === "" || email === "" || address === "") {
    alert("Không được để trống.");
    return;
}
if (!_isValidPhone(phone)) {
    alert("Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).");
    return;
}

// ... kiểm tra username, email giữ nguyên, thêm:
const isPhoneTaken = accounts.some(function (acc) {
    return acc.phone === phone && acc.id !== editingId;
});
if (isPhoneTaken) {
    alert("Số điện thoại đã tồn tại.");
    return;
}

const account = accounts.find(function (acc) {
    return acc.id === editingId;
});
account.username = username;
account.fullname = fullname;
account.phone = phone;
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


// QUẢN LÝ PHIẾU NHẬP - TỒN KHO - ĐƠN HÀNG (TV5)
let receipts = JSON.parse(localStorage.getItem("receipts")) || [];
let showOnlyLowStock = false;
let pendingCompleteReceiptId = null;

function _saveReceipts() {
    localStorage.setItem("receipts", JSON.stringify(receipts));
}

function _getProductsList() {
    const stored = localStorage.getItem("products");
    if (stored) return JSON.parse(stored);
    if (typeof PRODUCTS !== "undefined") {
        localStorage.setItem("products", JSON.stringify(PRODUCTS));
        return PRODUCTS;
    }
    return [];
}

function _saveProductsList(prods) {
    localStorage.setItem("products", JSON.stringify(prods));
    if (typeof PRODUCTS !== "undefined") {
        window.PRODUCTS = prods;
    }
}

function _formatVND(amount) {
    return Number(amount).toLocaleString('vi-VN') + " VNĐ";
}

// =========================================================================
// QUẢN LÝ SẢN PHẨM (DỰA TRÊN PRODUCT.JS)
// =========================================================================

function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    const search = (document.getElementById('prodSearch')?.value || '').toLowerCase();
    const category = document.getElementById('prodCategoryFilter')?.value || 'ALL';
    const prods = _getProductsList();

    const filtered = prods.filter(p => {
        const matchSearch = p.ten.toLowerCase().includes(search) || p.id.toLowerCase().includes(search);
        const matchCat = category === 'ALL' || p.loai === category;
        return matchSearch && matchCat;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="padding:16px;text-align:center;color:#888;">Không tìm thấy sản phẩm nào.</td></tr>`;
        return;
    }

    const catLabels = {
        'hoc-tap': 'Học tập',
        'van-phong': 'Văn phòng',
        'gaming': 'Gaming'
    };

    tbody.innerHTML = filtered.map(p => `
        <tr>
            <td style="text-align:center;">
                <img src="${p.hinh || 'images/default.jpg'}" alt="${p.ten}" style="width:48px;height:36px;object-fit:contain;border-radius:4px;border:1px solid #ddd;">
            </td>
            <td><strong>${p.id}</strong></td>
            <td>${p.ten}</td>
            <td>${catLabels[p.loai] || p.loai || 'Khác'}</td>
            <td style="text-align:right"><strong>${_formatVND(p.gia)}</strong></td>
            <td style="text-align:center;font-weight:bold;color:${(p.soluong || 0) <= 5 ? 'red' : 'inherit'}">${p.soluong || 0}</td>
            <td style="text-align:center">
                <button class="btn-small" onclick="openProductModal('${p.id}')">Sửa</button>
                <button class="btn-secondary" style="padding:3px 8px;font-size:12px;color:red;" onclick="deleteProduct('${p.id}')">Xóa</button>
            </td>
        </tr>
    `).join('');
}

function openProductModal(id = null) {
    const prods = _getProductsList();
    const form = document.getElementById('productForm');
    if (form) form.reset();

    if (id) {
        const p = prods.find(x => x.id === id);
        if (!p) return;
        document.getElementById('productModalId').value = p.id;
        document.getElementById('productModalTen').value = p.ten;
        document.getElementById('productModalLoai').value = p.loai || 'hoc-tap';
        document.getElementById('productModalGia').value = p.gia;
        document.getElementById('productModalSoLuong').value = p.soluong;
        document.getElementById('productModalHinh').value = p.hinh || '';
        document.getElementById('productModalMoTa').value = p.moTa || '';
        document.getElementById('productModalTitle').innerText = `Sửa Sản Phẩm (#${p.id})`;
    } else {
        document.getElementById('productModalId').value = '';
        document.getElementById('productModalTitle').innerText = 'Thêm Sản Phẩm Mới';
    }

    document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function handleProductSubmit(e) {
    e.preventDefault();
    const prods = _getProductsList();
    const id = document.getElementById('productModalId').value;
    const ten = document.getElementById('productModalTen').value.trim();
    const loai = document.getElementById('productModalLoai').value;
    const gia = parseFloat(document.getElementById('productModalGia').value) || 0;
    const soluong = parseInt(document.getElementById('productModalSoLuong').value) || 0;
    const hinh = document.getElementById('productModalHinh').value.trim() || 'images/default.jpg';
    const moTa = document.getElementById('productModalMoTa').value.trim();

    if (id) {
        const index = prods.findIndex(x => x.id === id);
        if (index >= 0) {
            prods[index] = { ...prods[index], ten, loai, gia, soluong, hinh, moTa };
        }
    } else {
        const newId = String(prods.length > 0 ? Math.max(...prods.map(p => parseInt(p.id) || 0)) + 1 : 1);
        prods.push({ id: newId, ten, loai, gia, soluong, hinh, moTa, cauHinh: {} });
    }

    _saveProductsList(prods);
    closeProductModal();
    renderProducts();
    renderInventory();
    alert("Đã lưu thông tin sản phẩm thành công!");
}

function deleteProduct(id) {
    pendingCompleteReceiptId = id;
    document.getElementById('confirmModalTitle').innerText = "Xác Nhận Xóa Sản Phẩm";
    document.getElementById('confirmModalMessage').innerText = `Bạn có chắc chắn muốn xóa sản phẩm mã #${id}? Thao tác này không thể hoàn tác.`;
    document.getElementById('confirmModalActionBtn').onclick = function() {
        let prods = _getProductsList();
        prods = prods.filter(x => x.id !== id);
        _saveProductsList(prods);
        closeConfirmModal();
        renderProducts();
        renderInventory();
        alert(`Đã xóa sản phẩm #${id}`);
    };
    document.getElementById('confirmModal').style.display = 'flex';
}

function switchStockSubTab(subTab) {
    document.getElementById('stock-sec-receipts').style.display = subTab === 'receipts' ? 'block' : 'none';
    document.getElementById('stock-sec-inventory').style.display = subTab === 'inventory' ? 'block' : 'none';
    document.getElementById('stock-sec-card').style.display = subTab === 'card' ? 'block' : 'none';

    document.querySelectorAll('.admin-subtabs button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`subtab-${subTab}`).classList.add('active');

    if (subTab === 'receipts') renderReceipts();
    if (subTab === 'inventory') renderInventory();
    if (subTab === 'card') populateCardProducts();
}

function _initStockTab() {
    switchStockSubTab('receipts');
}

// 1. DSH PHIẾU NHẬP (TV5-02)
function renderReceipts() {
    const tbody = document.getElementById('receiptTableBody');
    if (!tbody) return;

    const search = (document.getElementById('receiptSearch')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('receiptStatusFilter')?.value || 'ALL';

    const filtered = receipts.filter(r => {
        const matchSearch = r.id.toLowerCase().includes(search) || r.supplier.toLowerCase().includes(search);
        const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="padding:16px;text-align:center;color:#888;">Không tìm thấy phiếu nhập nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(r => {
        const totalAmount = r.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
        const isDraft = r.status === 'DRAFT';
        const statusBadge = isDraft 
            ? `<span class="badge-draft"><i class="fa-regular fa-clock"></i> Bản nháp</span>`
            : `<span class="badge-completed"><i class="fa-solid fa-lock"></i> Đã hoàn thành</span>`;

        return `
            <tr>
                <td><strong>${r.id}</strong></td>
                <td>${r.date}</td>
                <td>${r.supplier}</td>
                <td style="text-align:center">${r.items.length} mặt hàng</td>
                <td style="text-align:right"><strong>${_formatVND(totalAmount)}</strong></td>
                <td style="text-align:center">${statusBadge}</td>
                <td style="text-align:center">
                    ${isDraft ? `
                        <button class="btn-small" onclick="editReceipt('${r.id}')" title="Sửa bản nháp">Sửa</button>
                        <button class="btn-success" style="padding:3px 8px;font-size:12px;" onclick="completeReceipt('${r.id}')"><i class="fa-solid fa-check"></i> Hoàn Thành</button>
                    ` : `
                        <button class="btn-secondary" style="padding:3px 8px;font-size:12px;" onclick="viewReceipt('${r.id}')"><i class="fa-solid fa-eye"></i> Xem</button>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

// 2. TẠO & SỬA PHIẾU NHẬP (TV5-03, TV5-04)
function openReceiptModal() {
    document.getElementById('receiptForm').reset();
    document.getElementById('receiptModalId').value = '';
    document.getElementById('receiptModalCode').value = 'PN' + String(receipts.length + 1).padStart(3, '0');
    document.getElementById('receiptModalTitle').innerText = 'Tạo Phiếu Nhập Kho Mới';
    document.getElementById('receiptModalDate').value = new Date().toISOString().split('T')[0];

    toggleFormEditable(true);
    const container = document.getElementById('receiptItemsContainer');
    container.innerHTML = '';
    addReceiptRow();

    document.getElementById('receiptModal').style.display = 'flex';
}

function closeReceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
}

function toggleFormEditable(isEditable) {
    document.getElementById('receiptModalDate').disabled = !isEditable;
    document.getElementById('receiptModalSupplier').disabled = !isEditable;
    document.getElementById('btnAddReceiptRow').style.display = isEditable ? 'inline-block' : 'none';
    document.getElementById('btnSaveDraft').style.display = isEditable ? 'inline-block' : 'none';
    document.getElementById('btnModalComplete').style.display = isEditable ? 'inline-block' : 'none';
}

function addReceiptRow(productId = '', qty = 1, price = 0, isEditable = true) {
    const container = document.getElementById('receiptItemsContainer');
    const rowId = Date.now() + Math.random().toString(36).substr(2, 4);

    const prods = _getProductsList();
    const optionsHTML = prods.map(p => `<option value="${p.id}" ${p.id === productId ? 'selected' : ''}>${p.id} - ${p.ten}</option>`).join('');

    const row = document.createElement('div');
    row.className = "item-row";
    row.id = `row-${rowId}`;
    row.innerHTML = `
        <select ${!isEditable ? 'disabled' : ''} onchange="onReceiptProductChange(this, '${rowId}')" style="flex:2;" class="item-prod">
            <option value="">-- Chọn sản phẩm --</option>
            ${optionsHTML}
        </select>
        <input type="number" ${!isEditable ? 'disabled' : ''} min="1" value="${qty}" oninput="calculateReceiptTotal()" style="width:70px;" class="item-qty" placeholder="SL">
        <input type="number" ${!isEditable ? 'disabled' : ''} min="0" value="${price}" oninput="calculateReceiptTotal()" style="flex:1;" class="item-price" placeholder="Giá nhập">
        ${isEditable ? `<button type="button" onclick="removeReceiptRow('row-${rowId}')" class="btn-secondary" style="color:red;padding:4px 8px;">&times;</button>` : ''}
    `;
    container.appendChild(row);
    calculateReceiptTotal();
}

function onReceiptProductChange(selectEl, rowId) {
    const pId = selectEl.value;
    const p = _getProductsList().find(x => x.id === pId);
    if (p) {
        const row = document.getElementById(`row-${rowId}`);
        const priceInput = row.querySelector('.item-price');
        if (priceInput && (!priceInput.value || priceInput.value == 0)) {
            priceInput.value = Math.round(p.gia * 0.8);
        }
    }
    calculateReceiptTotal();
}

function removeReceiptRow(rowId) {
    document.getElementById(rowId)?.remove();
    calculateReceiptTotal();
}

function calculateReceiptTotal() {
    let total = 0;
    document.querySelectorAll('#receiptItemsContainer .item-row').forEach(row => {
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        total += qty * price;
    });
    document.getElementById('receiptModalTotal').innerText = _formatVND(total);
}

function getModalReceiptData() {
    const id = document.getElementById('receiptModalId').value || document.getElementById('receiptModalCode').value;
    const date = document.getElementById('receiptModalDate').value;
    const supplier = document.getElementById('receiptModalSupplier').value;

    const items = [];
    document.querySelectorAll('#receiptItemsContainer .item-row').forEach(row => {
        const pId = row.querySelector('.item-prod').value;
        const qty = parseInt(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        if (pId && qty > 0) items.push({ productId: pId, qty, price });
    });

    return { id, date, supplier, items };
}

function handleReceiptSubmit(e) {
    e.preventDefault();
    const { id, date, supplier, items } = getModalReceiptData();
    if (items.length === 0) {
        alert("Vui lòng chọn ít nhất 1 sản phẩm hợp lệ!");
        return;
    }

    const index = receipts.findIndex(r => r.id === id);
    if (index >= 0) {
        receipts[index].date = date;
        receipts[index].supplier = supplier;
        receipts[index].items = items;
    } else {
        receipts.push({ id, date, supplier, status: 'DRAFT', items });
    }

    _saveReceipts();
    closeReceiptModal();
    renderReceipts();
    alert(`Đã lưu bản nháp phiếu nhập ${id}`);
}

function editReceipt(id) {
    const r = receipts.find(x => x.id === id);
    if (!r) return;

    document.getElementById('receiptModalId').value = r.id;
    document.getElementById('receiptModalCode').value = r.id;
    document.getElementById('receiptModalTitle').innerText = `Sửa Phiếu Nhập (${r.id})`;
    document.getElementById('receiptModalDate').value = r.date;
    document.getElementById('receiptModalSupplier').value = r.supplier;

    toggleFormEditable(r.status === 'DRAFT');

    const container = document.getElementById('receiptItemsContainer');
    container.innerHTML = '';
    r.items.forEach(item => addReceiptRow(item.productId, item.qty, item.price, r.status === 'DRAFT'));

    document.getElementById('receiptModal').style.display = 'flex';
}

function viewReceipt(id) {
    const r = receipts.find(x => x.id === id);
    if (!r) return;

    document.getElementById('receiptModalId').value = r.id;
    document.getElementById('receiptModalCode').value = r.id;
    document.getElementById('receiptModalTitle').innerText = `Chi Tiết Phiếu Nhập (${r.id})`;
    document.getElementById('receiptModalDate').value = r.date;
    document.getElementById('receiptModalSupplier').value = r.supplier;

    toggleFormEditable(false);

    const container = document.getElementById('receiptItemsContainer');
    container.innerHTML = '';
    r.items.forEach(item => addReceiptRow(item.productId, item.qty, item.price, false));

    document.getElementById('receiptModal').style.display = 'flex';
}

function handleModalComplete() {
    const { id, date, supplier, items } = getModalReceiptData();
    if (!date || !supplier || items.length === 0) {
        alert("Vui lòng nhập đủ ngày, nhà cung cấp và chọn ít nhất 1 sản phẩm!");
        return;
    }

    let r = receipts.find(x => x.id === id);
    if (!r) {
        r = { id, date, supplier, status: 'DRAFT', items };
        receipts.push(r);
    } else {
        r.date = date;
        r.supplier = supplier;
        r.items = items;
    }

    _saveReceipts();
    closeReceiptModal();
    executeCompleteReceipt(id);
}

// KHÓA PHIẾU & CẬP NHẬT TỒN KHO KHÔNG DÙNG confirm() NATIVE
function completeReceipt(id) {
    pendingCompleteReceiptId = id;
    document.getElementById('confirmModalTitle').innerText = "Xác Nhận Hoàn Thành Phiếu Nhập";
    document.getElementById('confirmModalMessage').innerText = `Xác nhận hoàn thành phiếu ${id}? Trạng thái sẽ chuyển thành "Đã Hoàn Thành" (Đã Khóa) và Tồn Kho sản phẩm sẽ tự động được tăng thêm.`;
    document.getElementById('confirmModalActionBtn').onclick = function() {
        executeCompleteReceipt(pendingCompleteReceiptId);
        closeConfirmModal();
    };
    document.getElementById('confirmModal').style.display = 'flex';
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    pendingCompleteReceiptId = null;
}

function executeCompleteReceipt(id) {
    const r = receipts.find(x => x.id === id);
    if (!r || r.status === 'COMPLETED') return;

    r.status = 'COMPLETED';
    _saveReceipts();

    // Cộng tồn kho cho sản phẩm
    const prods = _getProductsList();
    r.items.forEach(item => {
        const p = prods.find(x => x.id === item.productId);
        if (p) p.soluong = (p.soluong || 0) + parseInt(item.qty);
    });

    renderReceipts();
    renderInventory();
    calculateStockCard();
    alert(`Đã hoàn thành và khóa phiếu nhập ${id}. Số lượng tồn kho đã được tăng tự động!`);
}

// 3. TRA CỨU TỒN KHO & CẢNH BÁO (TV5-07, TV5-08)
function renderInventory() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    const search = (document.getElementById('invSearch')?.value || '').toLowerCase();
    const prods = _getProductsList();

    let countLow = 0;
    prods.forEach(p => { if ((p.soluong || 0) <= 5) countLow++; });

    document.getElementById('lowStockDetailText').innerText = `Cảnh báo: Có ${countLow} sản phẩm sắp hết hàng (tồn kho \u2264 5).`;

    const filtered = prods.filter(p => {
        const matchSearch = p.ten.toLowerCase().includes(search) || p.id.toLowerCase().includes(search);
        const matchLow = showOnlyLowStock ? ((p.soluong || 0) <= 5) : true;
        return matchSearch && matchLow;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="padding:16px;text-align:center;color:#888;">Không tìm thấy sản phẩm tồn kho nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(p => {
        const isLow = (p.soluong || 0) <= 5;
        const statusBadge = isLow 
            ? `<span class="badge-draft" style="color:red;background:#ffe6e6;"><i class="fa-solid fa-triangle-exclamation"></i> Sắp hết hàng</span>`
            : `<span class="badge-completed"><i class="fa-solid fa-check"></i> An toàn</span>`;

        return `
            <tr>
                <td><strong>${p.id}</strong></td>
                <td>${p.ten}</td>
                <td>${p.loai || 'Laptop'}</td>
                <td style="text-align:right">${_formatVND(p.gia)}</td>
                <td style="text-align:center;font-weight:bold;color:${isLow ? 'red' : 'inherit'}">${p.soluong || 0}</td>
                <td style="text-align:center">${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

function toggleLowStockFilter() {
    showOnlyLowStock = !showOnlyLowStock;
    document.getElementById('btnFilterLowStock').innerText = showOnlyLowStock ? "Xem tất cả sản phẩm" : "Chỉ xem cảnh báo";
    renderInventory();
}

// 4. THẺ KHO (TV5-09)
function populateCardProducts() {
    const select = document.getElementById('cardProductSelect');
    if (!select) return;

    const prods = _getProductsList();
    select.innerHTML = prods.map(p => `<option value="${p.id}">${p.id} - ${p.ten}</option>`).join('');
    calculateStockCard();
}

function calculateStockCard() {
    const productId = document.getElementById('cardProductSelect')?.value;
    const startDate = document.getElementById('cardStartDate')?.value;
    const endDate = document.getElementById('cardEndDate')?.value;
    const tbody = document.getElementById('cardTableBody');
    if (!productId || !tbody) return;

    let trans = [];

    // Nhập từ phiếu hoàn thành
    receipts.filter(r => r.status === 'COMPLETED').forEach(r => {
        r.items.forEach(item => {
            if (item.productId === productId) {
                trans.push({ date: r.date, type: 'NHẬP', docCode: r.id, qty: item.qty, price: item.price, note: `Nhập kho (${r.supplier})` });
            }
        });
    });

    // Xuất từ đơn hàng
    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    allOrders.filter(o => o.trangThai !== 'Hủy').forEach(o => {
        (o.items || []).forEach(item => {
            if (item.id === productId) {
                trans.push({ date: o.ngay.split('T')[0], type: 'XUẤT', docCode: o.id.slice(0, 8).toUpperCase(), qty: item.so, price: item.gia, note: `Xuất bán (${o.nguoiNhan?.ten || 'Khách hàng'})` });
            }
        });
    });

    let filtered = trans.filter(t => {
        let match = true;
        if (startDate && t.date < startDate) match = false;
        if (endDate && t.date > endDate) match = false;
        return match;
    });

    let sumImport = 0, sumExport = 0;
    filtered.forEach(t => {
        if (t.type === 'NHẬP') sumImport += t.qty;
        if (t.type === 'XUẤT') sumExport += t.qty;
    });

    const currentProd = _getProductsList().find(p => p.id === productId);

    document.getElementById('kpiImport').innerText = sumImport;
    document.getElementById('kpiExport').innerText = sumExport;
    document.getElementById('kpiBalance').innerText = currentProd ? (currentProd.soluong || 0) : 0;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="padding:16px;text-align:center;color:#888;">Không có biến động nhập/xuất trong khoảng thời gian này.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(t => `
        <tr>
            <td>${t.date}</td>
            <td><span class="${t.type === 'NHẬP' ? 'badge-completed' : 'badge-draft'}">${t.type}</span></td>
            <td><strong>${t.docCode}</strong></td>
            <td style="text-align:right;font-weight:bold;color:${t.type === 'NHẬP' ? '#10b981' : '#ef4444'}">${t.type === 'NHẬP' ? '+' : '-'}${t.qty}</td>
            <td style="text-align:right">${_formatVND(t.price)}</td>
            <td style="color:#666">${t.note}</td>
        </tr>
    `).join('');
}

// =========================================================================
// 5. QUẢN LÝ ĐƠN HÀNG ADMIN (TV5-05, TV5-06)
// =========================================================================

function _getOrdersList() {
    let orders = JSON.parse(localStorage.getItem("orders"));
    if (!orders || !Array.isArray(orders)) {
        orders = [];
    }
    return orders;
}

// Helper chọn kiểu hiển thị Badge cho từng trạng thái đơn hàng
function _getOrderStatusBadge(status) {
    switch (status) {
        case "Chờ thanh toán":
            return `<span class="badge-draft" style="background:#fef3c7;color:#92400e;"><i class="fa-regular fa-clock"></i> Chờ thanh toán</span>`;
        case "Chờ xử lý":
        case "Mới đặt":
            return `<span class="badge-draft" style="background:#dbeafe;color:#1e40af;"><i class="fa-solid fa-spinner"></i> Chờ xử lý</span>`;
        case "Đã xử lý":
            return `<span class="badge-completed" style="background:#e0f2fe;color:#0369a1;"><i class="fa-solid fa-box-archive"></i> Đã xử lý</span>`;
        case "Đã giao":
            return `<span class="badge-completed" style="background:#d1fae5;color:#065f46;"><i class="fa-solid fa-circle-check"></i> Đã giao</span>`;
        case "Hủy":
            return `<span class="badge-draft" style="background:#fee2e2;color:#991b1b;"><i class="fa-solid fa-ban"></i> Đã hủy</span>`;
        default:
            return `<span class="badge-draft">${status || 'Mới đặt'}</span>`;
    }
}

function renderOrders() {
    const tbody = document.getElementById('orderTableBody');
    if (!tbody) return;

    const startDate = document.getElementById('orderStartDate')?.value;
    const endDate = document.getElementById('orderEndDate')?.value;
    const statusFilter = document.getElementById('orderStatusFilter')?.value || 'ALL';

    const allOrders = _getOrdersList();

    const filtered = allOrders.filter(o => {
        const oDate = o.ngay ? o.ngay.split('T')[0] : '';
        let matchDate = true;
        if (startDate && oDate < startDate) matchDate = false;
        if (endDate && oDate > endDate) matchDate = false;

        let matchStatus = true;
        if (statusFilter !== 'ALL') {
            if (statusFilter === 'Chờ xử lý') {
                matchStatus = (o.trangThai === 'Chờ xử lý' || o.trangThai === 'Mới đặt');
            } else {
                matchStatus = o.trangThai === statusFilter;
            }
        }

        return matchDate && matchStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="padding:16px;text-align:center;color:#888;">Không có đơn hàng nào phù hợp bộ lọc.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(o => {
        const formattedDate = o.ngay ? new Date(o.ngay).toLocaleDateString('vi-VN') : 'N/A';
        const shortId = o.id ? o.id.slice(0, 8).toUpperCase() : 'N/A';
        const customerName = o.nguoiNhan?.ten || 'Khách vãng lai';
        const currentStatus = o.trangThai || 'Chờ xử lý';

        return `
            <tr>
                <td><strong>#${shortId}</strong></td>
                <td>${customerName}</td>
                <td>${formattedDate}</td>
                <td style="text-align:right"><strong>${_formatVND(o.tong || 0)}</strong></td>
                <td style="text-align:center">${_getOrderStatusBadge(currentStatus)}</td>
                <td style="text-align:center">
                    <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:5px;border-radius:6px;border:1px solid #cbd5e1;font-size:13px;">
                        <option value="Chờ thanh toán" ${currentStatus === 'Chờ thanh toán' ? 'selected' : ''}>Chờ thanh toán</option>
                        <option value="Chờ xử lý" ${currentStatus === 'Chờ xử lý' || currentStatus === 'Mới đặt' ? 'selected' : ''}>Chờ xử lý</option>
                        <option value="Đã xử lý" ${currentStatus === 'Đã xử lý' ? 'selected' : ''}>Đã xử lý</option>
                        <option value="Đã giao" ${currentStatus === 'Đã giao' ? 'selected' : ''}>Đã giao</option>
                        <option value="Hủy" ${currentStatus === 'Hủy' ? 'selected' : ''}>Hủy</option>
                    </select>
                </td>
                <td style="text-align:center">
                    <button class="btn-small" onclick="openOrderModal('${o.id}')"><i class="fa-solid fa-eye"></i> Xem</button>
                </td>
            </tr>
        `;
    }).join('');
}

function resetOrderFilters() {
    if (document.getElementById('orderStartDate')) document.getElementById('orderStartDate').value = '';
    if (document.getElementById('orderEndDate')) document.getElementById('orderEndDate').value = '';
    if (document.getElementById('orderStatusFilter')) document.getElementById('orderStatusFilter').value = 'ALL';
    renderOrders();
}

function updateOrderStatus(orderId, newStatus) {
    const allOrders = _getOrdersList();
    const o = allOrders.find(x => x.id === orderId);
    if (o) {
        o.trangThai = newStatus;
        localStorage.setItem("orders", JSON.stringify(allOrders));
        renderOrders();

        // Nếu tab Thẻ kho đang mở, cập nhật tự động lại biến động thẻ kho
        if (typeof calculateStockCard === "function") {
            calculateStockCard();
        }

        const shortCode = orderId.slice(0, 8).toUpperCase();
        alert(`Đã cập nhật trạng thái đơn hàng #${shortCode} sang "${newStatus}"`);
    }
}

function openOrderModal(orderId) {
    const allOrders = _getOrdersList();
    const o = allOrders.find(x => x.id === orderId);
    if (!o) return;

    const shortCode = o.id ? o.id.slice(0, 8).toUpperCase() : 'N/A';
    const formattedDateTime = o.ngay ? new Date(o.ngay).toLocaleString('vi-VN') : 'N/A';
    const paymentText = o.phuongThuc === 'online' ? 'Thanh toán online' : 'Tiền mặt khi nhận hàng (COD)';

    document.getElementById('orderModalCode').innerText = `#${shortCode}`;
    document.getElementById('orderModalCustomer').innerText = `${o.nguoiNhan?.ten || 'N/A'} - SĐT: ${o.nguoiNhan?.sdt || 'N/A'}`;
    document.getElementById('orderModalDate').innerText = formattedDateTime;
    document.getElementById('orderModalAddress').innerText = `${o.nguoiNhan?.diaChi || 'N/A'} ${o.nguoiNhan?.ghiChu ? `(Ghi chú: ${o.nguoiNhan.ghiChu})` : ''}`;

    const itemsHTML = (o.items || []).map(item => `
        <tr>
            <td><strong>${item.ten}</strong> <br><small style="color:#666;">Mã: ${item.id}</small></td>
            <td style="text-align:center">${item.so}</td>
            <td style="text-align:right">${_formatVND(item.gia)}</td>
            <td style="text-align:right;font-weight:bold;">${_formatVND(item.so * item.gia)}</td>
        </tr>
    `).join('');

    document.getElementById('orderModalItems').innerHTML = itemsHTML;
    document.getElementById('orderModalTotal').innerHTML = `${_formatVND(o.tong || 0)} <br><small style="font-size:12px;font-weight:normal;color:#555;">Phương thức: ${paymentText}</small>`;

    document.getElementById('orderModal').style.display = 'flex';
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

_update();
_showAccounts();
_openTab(accounts_management);