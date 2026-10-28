const dssanpham = document.querySelectorAll("#danh-sach-san-pham article");
const main_ui = document.querySelector("#san-pham");
const chi_tiet = document.querySelector("#chi-tiet-san-pham");
const home = document.querySelector(".quay-lai-danh-sach");
let sl =0;
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
}

// Bấm biểu tượng giỏ hàng ở header -> hiện giỏ hàng
nut_gio_hang.addEventListener("click", function (e) {
    e.preventDefault();
    main_ui.hidden = true;
    chi_tiet.hidden = true;
    cart.hidden = false;
    ve_gio_hang();
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