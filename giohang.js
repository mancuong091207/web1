const dssanpham = document.querySelectorAll("#danh-sach-san-pham article");
const main_ui = document.querySelector("#san-pham");
const chi_tiet = document.querySelector("#chi-tiet-san-pham");
const home = document.querySelector(".quay-lai-danh-sach");
let sl = 0;
// Nút quay về danh sách
home.addEventListener("click", function () {
    main_ui.hidden = false;
    chi_tiet.hidden = true;
});

// Bấm vào từng thẻ sản phẩm
dssanpham.forEach(function (sanpham) {
    sanpham.addEventListener("click", function (e) {

        // bấm nút giỏ hàng thì không mở chi tiết
        if (e.target.closest(".them-vao-gio")) return;

        // tìm sản phẩm theo id của thẻ vừa bấm
        const sp = PRODUCTS.find(function (p) {
            return p.id === sanpham.dataset.id;
        });

        // đổ nội dung vào khung chi tiết
        document.getElementById("ct-ten").textContent = sp.ten;
        document.getElementById("ct-hinh").src = sp.hinh;
        document.getElementById("ct-gia").textContent = sp.gia.toLocaleString("vi-VN") + "VNĐ";
        document.getElementById("ct-mota").textContent = sp.moTa;
        document.getElementById("ct-them-gio").dataset.id = sp.id;
        const nutThem = document.getElementById("ct-them-gio");
        nutThem.dataset.id = sp.id;

        // Reset số lượng về 1
        document.getElementById("so-luong").value = 1;


        // bảng thông số
        let hang = "";
        for (const ten in sp.cauHinh) {
            hang += "<tr><th>" + ten + "</th><td>" + sp.cauHinh[ten] + "</td></tr>";
        }
        document.getElementById("ct-bang").innerHTML = hang;

        // ẩn danh sách, hiện chi tiết
        main_ui.hidden = true;
        chi_tiet.hidden = false;
        window.scrollTo(0, 0);
    });
});

// Phần giỏi hàng
const cart = document.querySelector(".cart_ui");
const nut_gio_hang = document.querySelector(".nut-gio-hang");
const add_cart = document.querySelectorAll(".them-vao-gio");
const show_sl = document.querySelector(".so-luong");
const cart_list = document.getElementById("cart-list");
const money = document.getElementById("money");
const o_sl = document.getElementById("so-luong");

let gio = [];   // mỗi món: { id: "7", so: 2 }

// Nút − và + ở khung chi tiết
document.getElementById("giam-sl").addEventListener("click", function () {
    if (o_sl.value > 1) o_sl.value--;
});
document.getElementById("tang-sl").addEventListener("click", function () {
    if (o_sl.value < 10) o_sl.value++;
});

// Bấm "Thêm vào giỏ hàng"
add_cart.forEach(function (nut) {
    nut.addEventListener("click", function () {
        const id = nut.dataset.id;
        let them = 1;
        if (nut.id === "ct-them-gio") them = Number(o_sl.value);   // ở khung chi tiết lấy theo ô số lượng

        const mon = gio.find(function (m) { return m.id === id; });
        if (mon) {
            mon.so += them;
        } else {
            gio.push({ id: id, so: them });
        }

        sl += them;
        show_sl.textContent = sl;
    });
});

// Vẽ giỏ hàng
function ve_gio_hang() {
    let html = "";
    let tong = 0;


    gio.forEach(function (mon) {
        const sp = PRODUCTS.find(function (p) { return p.id === mon.id; });
        tong += sp.gia * mon.so;

        html += `
        <div class="element" data-id="${sp.id}">
            <div class="icon"><img src="${sp.hinh}" class="laptop_icon"></div>
            <div class="namelaptop"><strong>${sp.ten}</strong></div>
            <div class="price">${sp.gia.toLocaleString("vi-VN")} VNĐ</div>
            <div class="so-luong-control">
                <button type="button" class="giam-sl">−</button>
                <input type="number" value="${mon.so}" readonly>
                <button type="button" class="tang-sl">+</button>
            </div>
            <div class="money">${(sp.gia * mon.so).toLocaleString("vi-VN")} VNĐ</div>
            <div class="trash"><i class="fa-solid fa-trash"></i></div>
        </div>`;
    });

    cart_list.innerHTML = html || '<p class="cart-trong">Giỏ hàng đang trống</p>';
    money.textContent = tong.toLocaleString("vi-VN") + " VNĐ";
    document.getElementById("checkout-sl").textContent = sl;
    document.getElementById("checkout").hidden = gio.length === 0;
}

// Bấm biểu tượng giỏ hàng ở header -> hiện giỏ hàng
nut_gio_hang.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("account").hidden = true;
    document.getElementById("history").hidden = true;
    history.replaceState(null, "", location.pathname + location.search);
    main_ui.hidden = true;
    chi_tiet.hidden = true;
    cart.hidden = false;
    ve_gio_hang();
    dien_form_tu_tai_khoan();
});

// Tiếp tục mua sắm
document.querySelector(".tiep-tuc").addEventListener("click", function () {
    cart.hidden = true;
    main_ui.hidden = false;
});

// Bấm −, +, thùng rác trong giỏ
cart_list.addEventListener("click", function (e) {
    const hang = e.target.closest(".element");
    if (!hang) return;
    const mon = gio.find(function (m) { return m.id === hang.dataset.id; });

    if (e.target.closest(".giam-sl") && mon.so > 1) {
        mon.so--;
        sl--;
    }
    if (e.target.closest(".tang-sl") && mon.so < 10) {
        mon.so++;
        sl++;
    }
    if (e.target.closest(".trash")) {
        sl -= mon.so;
        gio = gio.filter(function (m) { return m !== mon; });
    }

    show_sl.textContent = sl;
    ve_gio_hang();
});

// Xóa toàn bộ giỏ
document.querySelector(".remove").addEventListener("click", function () {
    gio = [];
    sl = 0;
    show_sl.textContent = 0;
    ve_gio_hang();
});

// Đặt hàng

const modal = document.getElementById("modal-dat-hang");
const o_ten = document.getElementById("dh-ten");
const o_sdt = document.getElementById("dh-sdt");
const o_email = document.getElementById("dh-email");
const o_diachi = document.getElementById("dh-diachi");
const o_ghichu = document.getElementById("dh-ghichu");
const o_loi = document.getElementById("dh-loi");          // lỗi ở form bên ngoài
const o_thanhtoan = document.getElementById("dh-thanhtoan");
const o_xacnhan = document.getElementById("dh-xacnhan");
const o_loi_modal = document.getElementById("xn-loi");    // lỗi trong modal
const nut_mo_dat_hang = document.getElementById("nut-mo-dat-hang");
const nut_dat_hang = document.getElementById("nut-dat-hang");
let mua_ngay = null;   // { id, so } khi bấm "Mua ngay"; null = đặt từ giỏ hàng

function lay_mon_dat() {
    return mua_ngay ? [mua_ngay] : gio;
}

// Tài khoản đang đăng nhập (dữ liệu do account.js lưu)
function lay_tai_khoan_hien_tai() {
    const id = sessionStorage.getItem("currentUserId");
    if (!id) return null;
    const ds = JSON.parse(localStorage.getItem("accounts")) || [];
    return ds.find(function (a) { return a.id === id; }) || null;
}

// Điền sẵn form từ tài khoản; ô nào người dùng đã tự sửa thì giữ nguyên
function dien_form_tu_tai_khoan() {
    const tk = lay_tai_khoan_hien_tai();
    if (!tk) return;
    const dien = function (o, giaTri) {
        if (!o.dataset.sua) o.value = giaTri || "";
    };
    dien(o_ten, tk.fullname);
    dien(o_sdt, tk.phone);
    dien(o_email, tk.email);
    dien(o_diachi, tk.address);
}

[o_ten, o_sdt, o_email, o_diachi, o_ghichu].forEach(function (o) {
    o.addEventListener("input", function () {
        o.dataset.sua = "1";
        o_loi.hidden = true;
    });
});
o_xacnhan.addEventListener("change", function () { o_loi_modal.hidden = true; });

function bao_loi(o, msg) {
    o.textContent = "- " + msg;
    o.hidden = false;
}

function tinh_tong() {
    let tong = 0;
    lay_mon_dat().forEach(function (mon) {
        const sp = PRODUCTS.find(function (p) { return p.id === mon.id; });
        tong += sp.gia * mon.so;
    });
    return tong;
}

// Kiểm tra form bên ngoài; trả về true nếu hợp lệ
function kiem_tra_form() {
    if (o_ten.value.trim() === "") { bao_loi(o_loi, "Bạn chưa nhập họ tên"); return false; }
    if (!/^(0|\+84)\d{9}$/.test(o_sdt.value.trim())) { bao_loi(o_loi, "Số điện thoại không hợp lệ"); return false; }
    if (!/^\S+@\S+\.\S+$/.test(o_email.value.trim())) { bao_loi(o_loi, "Email không hợp lệ"); return false; }
    if (o_diachi.value.trim() === "") { bao_loi(o_loi, "Bạn chưa nhập địa chỉ"); return false; }
    o_loi.hidden = true;
    return true;
}

function mo_modal() {
    document.getElementById("xn-ten").textContent = o_ten.value.trim();
    document.getElementById("xn-sdt").textContent = o_sdt.value.trim();
    document.getElementById("xn-email").textContent = o_email.value.trim();
    document.getElementById("xn-diachi").textContent = o_diachi.value.trim();


    const ghichu = o_ghichu.value.trim();
    document.getElementById("xn-ghichu").textContent = ghichu;
    document.getElementById("xn-dong-ghichu").hidden = ghichu === "";

    document.getElementById("modal-tong").textContent = tinh_tong().toLocaleString("vi-VN") + " VNĐ";
    o_loi_modal.hidden = true;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
}

function dong_modal() {
    modal.hidden = true;
    mua_ngay = null;
    document.body.style.overflow = "";
}

// Bấm "ĐẶT HÀNG" ở giỏ hàng -> kiểm tra rồi mở modal xác nhận
nut_mo_dat_hang.addEventListener("click", function () {

    if (!lay_tai_khoan_hien_tai()) {
        alert("Vui lòng đăng nhập để đặt hàng.");
        location.hash = "#signin_tab";
        if (typeof open_signinTab === "function") open_signinTab();
        return;
    }
    if (gio.length === 0) return;
    if (!kiem_tra_form()) return;
    if (!kiem_tra_form()) return;
    mua_ngay = null;
    mo_modal();
});

// Quay lại giỏ hàng: đóng modal, giữ nguyên dữ liệu
document.getElementById("modal-quay-lai").addEventListener("click", dong_modal);
modal.addEventListener("click", function (e) {
    if (e.target === modal) dong_modal();
});
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) dong_modal();
});

// Bấm "ĐẶT HÀNG" trong modal -> tạo đơn
nut_dat_hang.addEventListener("click", function () {
    const tk = lay_tai_khoan_hien_tai();
    if (!tk) {
        dong_modal();
        alert("Phiên đăng nhập đã hết, vui lòng đăng nhập lại.");
        return;
    }
    const ds_mon = lay_mon_dat();
    if (ds_mon.length === 0) return bao_loi(o_loi_modal, "Giỏ hàng đang trống");
    if (!o_xacnhan.checked) return bao_loi(o_loi_modal, "Bạn chưa xác nhận thông tin đặt hàng");

    const la_mua_ngay = mua_ngay !== null;
    for (const mon of ds_mon) {
        const sp = PRODUCTS.find(function (p) { return p.id === mon.id; });
        if (!sp || (sp.soluong || 0) < mon.so) {
            return bao_loi(o_loi_modal, "Sản phẩm " + (sp ? sp.ten : mon.id) + " không đủ hàng trong kho");
        }
    }
    const items = ds_mon.map(function (mon) {
        const sp = PRODUCTS.find(function (p) { return p.id === mon.id; });
        return { id: sp.id, ten: sp.ten, gia: sp.gia, so: mon.so };
    });

    const online = o_thanhtoan.value === "online";
    const don = {
        id: crypto.randomUUID(),
        userId: tk.id,
        ngay: new Date().toISOString(),
        nguoiNhan: {
            ten: o_ten.value.trim(),
            sdt: o_sdt.value.trim(),
            email: o_email.value.trim(),
            diaChi: o_diachi.value.trim(),
            ghiChu: o_ghichu.value.trim()
        },
        phuongThuc: o_thanhtoan.value,
        items: items,
        tong: tinh_tong(),
        trangThai: online ? "Chờ thanh toán" : "Chờ xử lý"
    };

    const ds = JSON.parse(localStorage.getItem("orders")) || [];
    ds.push(don);
    localStorage.setItem("orders", JSON.stringify(ds));
    ds_mon.forEach(function (mon) {
        const sp = PRODUCTS.find(function (p) { return p.id === mon.id; });
        sp.soluong = (sp.soluong || 0) - mon.so;
    });
    localStorage.setItem("laptopShop", JSON.stringify(PRODUCTS));
    // reset form
    o_ghichu.value = "";
    delete o_ghichu.dataset.sua;
    o_xacnhan.checked = false;
    o_thanhtoan.value = "tien-mat";

    // chỉ dọn giỏ hàng khi đặt từ giỏ
    if (!la_mua_ngay) {
        gio = [];
        sl = 0;
        show_sl.textContent = 0;
    }
    dong_modal();
    ve_gio_hang();

    alert(online
        ? "Đặt hàng thành công! Đơn hàng đang chờ thanh toán online."
        : "Đặt hàng thành công! Bạn sẽ thanh toán tiền mặt khi nhận hàng.");
});
document.getElementById("buy").addEventListener("click", function () {
    if (!lay_tai_khoan_hien_tai()) {
        alert("Vui lòng đăng nhập để mua hàng.");
        location.hash = "#signin_tab";
        if (typeof open_signinTab === "function") open_signinTab();
        return;
    }

    const id = document.getElementById("ct-them-gio").dataset.id;
    mua_ngay = { id: id, so: Number(o_sl.value) };

    dien_form_tu_tai_khoan();          // lấy họ tên, SĐT, email, địa chỉ từ tài khoản
    if (!kiem_tra_form()) {
        alert(o_loi.textContent.replace(/^- /, "") + ".\nVui lòng cập nhật trong Thông tin tài khoản.");
        mua_ngay = null;
        return;
    }
    mo_modal();
});