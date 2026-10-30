let danhSachLoai = [
    { ma: "hoc-tap", ten: "Laptop học tập" },
    { ma: "van-phong", ten: "Laptop văn phòng" },
    { ma: "gaming", ten: "Laptop gaming" }
];

const duLieuDaLuu = localStorage.getItem("loaiLaptop");

if (duLieuDaLuu !== null) {
    danhSachLoai = JSON.parse(duLieuDaLuu);
}
for (let i = 0; i < danhSachLoai.length; i++) {
    if (danhSachLoai[i].ma === "hoctap") {
        danhSachLoai[i].ma = "hoc-tap";
    }

    if (danhSachLoai[i].ma === "vanphong") {
        danhSachLoai[i].ma = "van-phong";
    }
}

localStorage.setItem("loaiLaptop", JSON.stringify(danhSachLoai));
const bangLoai = document.getElementById("danh-sach-loai");
const formLoai = document.getElementById("form-loai");
const oMaLoai = document.getElementById("ma-loai");
const oTenLoai = document.getElementById("ten-loai");

function hienThiLoai() {
    capNhatLoaiLaptop();
    hienThiLoiNhuanLoai();
    bangLoai.textContent = "";

    for (let i = 0; i < danhSachLoai.length; i++) {
        const dong = bangLoai.insertRow();

        dong.insertCell().textContent = danhSachLoai[i].ma;
        dong.insertCell().textContent = danhSachLoai[i].ten;
        const oThaoTac = dong.insertCell();
const nutSua = document.createElement("button");

nutSua.type = "button";
nutSua.textContent = "Sửa";

nutSua.addEventListener("click", function () {
    const tenMoi = prompt("Nhập tên loại mới:", danhSachLoai[i].ten);

    if (tenMoi === null) {
        return;
    }

    if (tenMoi.trim() === "") {
        alert("Tên loại không được để trống!");
        return;
    }

    danhSachLoai[i].ten = tenMoi.trim();

    localStorage.setItem("loaiLaptop", JSON.stringify(danhSachLoai));

    hienThiLoai();
});

oThaoTac.appendChild(nutSua);
const nutAn = document.createElement("button");

nutAn.type = "button";

if (danhSachLoai[i].an === true) {
    nutAn.textContent = "Hiện lại";
    dong.cells[1].textContent = danhSachLoai[i].ten + " (Đã ẩn)";
} else {
    nutAn.textContent = "Ẩn";
}

nutAn.addEventListener("click", function () {
    danhSachLoai[i].an = !danhSachLoai[i].an;

    localStorage.setItem("loaiLaptop", JSON.stringify(danhSachLoai));

    hienThiLoai();
});

oThaoTac.appendChild(nutAn);
    }
}

hienThiLoai();

formLoai.addEventListener("submit", function (suKien) {
    suKien.preventDefault();

    const ma = oMaLoai.value.trim().toLowerCase();
    const ten = oTenLoai.value.trim();

    if (ma === "" || ten === "") {
        alert("Vui lòng nhập đủ mã và tên loại!");
        return;
    }

    for (let i = 0; i < danhSachLoai.length; i++) {
        if (danhSachLoai[i].ma === ma) {
            alert("Mã loại đã tồn tại!");
            return;
        }
    }

    danhSachLoai.push({ ma: ma, ten: ten });

    localStorage.setItem("loaiLaptop", JSON.stringify(danhSachLoai));

    hienThiLoai();
    formLoai.reset();
});
const laptopDaLuu = localStorage.getItem("laptopShop");

if (laptopDaLuu !== null) {
    window.PRODUCTS = JSON.parse(laptopDaLuu);
}
let viTriSuaLaptop = -1;
const bangLaptop = document.getElementById("danh-sach-laptop");

function hienThiLaptop() {
    hienThiGia();
    hienThiLoiNhuanLaptop();
    bangLaptop.textContent = "";

    for (let i = 0; i < PRODUCTS.length; i++) {
        const laptop = PRODUCTS[i];
        const dong = bangLaptop.insertRow();

        dong.insertCell().textContent = laptop.id;
        dong.insertCell().textContent = laptop.ten;
        dong.insertCell().textContent = laptop.loai;
        dong.insertCell().textContent =
            laptop.gia.toLocaleString("vi-VN") + " đ";
const oThaoTacLaptop = dong.insertCell();
const nutSuaLaptop = document.createElement("button");

nutSuaLaptop.type = "button";
nutSuaLaptop.textContent = "Sửa";

nutSuaLaptop.addEventListener("click", function () {
    viTriSuaLaptop = i;

    capNhatLoaiLaptop();

let daCoLoai = false;

for (let j = 0; j < oLoaiLaptop.options.length; j++) {
    if (oLoaiLaptop.options[j].value === laptop.loai) {
        daCoLoai = true;
        break;
    }
}

if (daCoLoai === false) {
    const luaChon = document.createElement("option");

    luaChon.value = laptop.loai;
    luaChon.textContent = laptop.loai + " (Loại hiện tại)";

    oLoaiLaptop.appendChild(luaChon);
}

    oMaLaptop.value = laptop.id;
    oMaLaptop.readOnly = true;
    oTenLaptop.value = laptop.ten;
    oLoaiLaptop.value = laptop.loai;
    oGiaLaptop.value = laptop.gia;
    oHinhLaptop.value = laptop.hinh;
    oMoTaLaptop.value = laptop.moTa;
    oCpuLaptop.value = laptop.cauHinh["CPU"] || "";
    oRamLaptop.value = laptop.cauHinh["RAM"] || "";
    oOCungLaptop.value = laptop.cauHinh["Ổ cứng"] || "";
    oManHinhLaptop.value = laptop.cauHinh["Màn hình"] || "";

    formLaptop.querySelector('button[type="submit"]').textContent =
        "Lưu thay đổi";

    formLaptop.scrollIntoView({ block: "center" });
});

oThaoTacLaptop.appendChild(nutSuaLaptop);
const nutAnLaptop = document.createElement("button");

nutAnLaptop.type = "button";

if (laptop.an === true) {
    nutAnLaptop.textContent = "Hiện lại";
    dong.cells[1].textContent = laptop.ten + " (Đã ẩn)";
} else {
    nutAnLaptop.textContent = "Ẩn";
}

nutAnLaptop.addEventListener("click", function () {
    if (laptop.an === true) {
        laptop.an = false;
    } else {
        laptop.an = true;
    }

    localStorage.setItem("laptopShop", JSON.stringify(PRODUCTS));

    hienThiLaptop();
});

oThaoTacLaptop.appendChild(nutAnLaptop);
const nutXoaLaptop = document.createElement("button");

nutXoaLaptop.type = "button";
nutXoaLaptop.textContent = "Xóa";

nutXoaLaptop.addEventListener("click", function () {
    const dongY = confirm("Bạn muốn xóa laptop: " + laptop.ten + "?");

    if (dongY === false) {
        return;
    }

    PRODUCTS.splice(i, 1);

    localStorage.setItem("laptopShop", JSON.stringify(PRODUCTS));

    viTriSuaLaptop = -1;
    formLaptop.reset();
    oMaLaptop.readOnly = false;

    formLaptop.querySelector('button[type="submit"]').textContent =
        "Thêm laptop";

    hienThiLaptop();
});

oThaoTacLaptop.appendChild(nutXoaLaptop);
    }
}

hienThiLaptop();
function capNhatLoaiLaptop() {
    const oChonLoai = document.getElementById("loai-laptop-admin");

    oChonLoai.textContent = "";

    for (let i = 0; i < danhSachLoai.length; i++) {
        if (danhSachLoai[i].an !== true) {
            const luaChon = document.createElement("option");

            luaChon.value = danhSachLoai[i].ma;
            luaChon.textContent = danhSachLoai[i].ten;

            oChonLoai.appendChild(luaChon);
        }
    }
}

capNhatLoaiLaptop();
const formLaptop = document.getElementById("form-laptop");
const oMaLaptop = document.getElementById("ma-laptop");
const oTenLaptop = document.getElementById("ten-laptop-admin");
const oLoaiLaptop = document.getElementById("loai-laptop-admin");
const oGiaLaptop = document.getElementById("gia-laptop");
const oHinhLaptop = document.getElementById("hinh-laptop");
const oMoTaLaptop = document.getElementById("mota-laptop");
const oCpuLaptop = document.getElementById("cpu-laptop");
const oRamLaptop = document.getElementById("ram-laptop");
const oOCungLaptop = document.getElementById("ocung-laptop");
const oManHinhLaptop = document.getElementById("manhinh-laptop");

formLaptop.addEventListener("submit", function (suKien) {
    suKien.preventDefault();

    const ma = oMaLaptop.value.trim();
    const ten = oTenLaptop.value.trim();
    const loai = oLoaiLaptop.value;
    const gia = Number(oGiaLaptop.value);
    const hinh = oHinhLaptop.value.trim();
    const moTa = oMoTaLaptop.value.trim();

    if (ma === "" || ten === "" || hinh === "" || moTa === "") {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (!Number.isFinite(gia) || gia <= 0 || !Number.isInteger(gia)) {
        alert("Giá bán phải là số nguyên lớn hơn 0!");
        return;
    }

    let loaiHopLe = false;

    for (let i = 0; i < danhSachLoai.length; i++) {
        if (danhSachLoai[i].ma === loai && danhSachLoai[i].an !== true) {
            loaiHopLe = true;
            break;
        }
    }

    if (loaiHopLe === false) {
        alert("Vui lòng chọn loại laptop đang hiển thị!");
        return;
    }

    for (let i = 0; i < PRODUCTS.length; i++) {
if (i !== viTriSuaLaptop &&
    PRODUCTS[i].id.toLowerCase() === ma.toLowerCase()) {
            alert("Mã laptop đã tồn tại!");
            return;
        }
    }

if (viTriSuaLaptop === -1) {
    const laptopMoi = {
        id: ma,
        ten: ten,
        loai: loai,
        gia: gia,
        hinh: hinh,
        moTa: moTa,
        cauHinh: {
            "CPU": oCpuLaptop.value.trim(),
            "RAM": oRamLaptop.value.trim(),
            "Ổ cứng": oOCungLaptop.value.trim(),
            "Màn hình": oManHinhLaptop.value.trim()
        },
        soluong: 0,
        an: false
    };

    PRODUCTS.push(laptopMoi);
} else {
    const laptop = PRODUCTS[viTriSuaLaptop];

    laptop.ten = ten;
    laptop.loai = loai;
    laptop.gia = gia;
    laptop.hinh = hinh;
    laptop.moTa = moTa;
    laptop.cauHinh["CPU"] = oCpuLaptop.value.trim();
    laptop.cauHinh["RAM"] = oRamLaptop.value.trim();
    laptop.cauHinh["Ổ cứng"] = oOCungLaptop.value.trim();
    laptop.cauHinh["Màn hình"] = oManHinhLaptop.value.trim();
}

localStorage.setItem("laptopShop", JSON.stringify(PRODUCTS));

viTriSuaLaptop = -1;
formLaptop.reset();
oMaLaptop.readOnly = false;

formLaptop.querySelector('button[type="submit"]').textContent =
    "Thêm laptop";

hienThiLaptop();

alert("Đã lưu laptop!");
});
const nutHuySuaLaptop = document.getElementById("huy-sua-laptop");

nutHuySuaLaptop.addEventListener("click", function () {
    viTriSuaLaptop = -1;
    formLaptop.reset();
    oMaLaptop.readOnly = false;
    capNhatLoaiLaptop();

    formLaptop.querySelector('button[type="submit"]').textContent =
        "Thêm laptop";
});
function hienThiLoiNhuanLoai() {
    hienThiGia();
    const bang = document.getElementById("bang-loi-nhuan-loai");

    bang.textContent = "";

    for (let i = 0; i < danhSachLoai.length; i++) {
        const loai = danhSachLoai[i];

        if (loai.loiNhuan === undefined) {
            loai.loiNhuan = 10;
        }

        const dong = bang.insertRow();

        dong.insertCell().textContent = loai.ten;
        dong.insertCell().textContent = loai.loiNhuan + "%";

        const oThaoTac = dong.insertCell();
        const nutSua = document.createElement("button");

        nutSua.type = "button";
        nutSua.textContent = "Sửa tỷ lệ";

        nutSua.addEventListener("click", function () {
            const giaTri = prompt(
                "Nhập tỷ lệ lợi nhuận (%):",
                loai.loiNhuan
            );

            if (giaTri === null) {
                return;
            }

            const tyLe = Number(giaTri);

            if (giaTri.trim() === "" ||
                !Number.isFinite(tyLe) ||
                tyLe < 0) {
                alert("Vui lòng nhập tỷ lệ là số không âm!");
                return;
            }

            loai.loiNhuan = tyLe;

            localStorage.setItem(
                "loaiLaptop",
                JSON.stringify(danhSachLoai)
            );

            hienThiLoiNhuanLoai();
        });

        oThaoTac.appendChild(nutSua);
    }
}

hienThiLoiNhuanLoai();
function hienThiLoiNhuanLaptop() {
    hienThiGia();
    const bang = document.getElementById("bang-loi-nhuan-laptop");

    bang.textContent = "";

    for (let i = 0; i < PRODUCTS.length; i++) {
        const laptop = PRODUCTS[i];
        const dong = bang.insertRow();

        dong.insertCell().textContent = laptop.id;
        dong.insertCell().textContent = laptop.ten;

        const oTyLe = dong.insertCell();

        if (laptop.loiNhuanRieng === undefined ||
            laptop.loiNhuanRieng === null) {
            oTyLe.textContent = "Theo loại";
        } else {
            oTyLe.textContent = laptop.loiNhuanRieng + "%";
        }

        const oThaoTac = dong.insertCell();
        const nutSua = document.createElement("button");
        nutSua.type = "button";
        nutSua.textContent = "Sửa tỷ lệ";
        nutSua.addEventListener("click", function () {
            let giaTriCu = "";
            if (laptop.loiNhuanRieng !== undefined &&
                laptop.loiNhuanRieng !== null) {
                giaTriCu = laptop.loiNhuanRieng;
            }
            const giaTri = prompt(
                "Nhập tỷ lệ riêng (%). Để trống để dùng tỷ lệ của loại:",
                giaTriCu
            );
            if (giaTri === null) {
                return;
            }
            if (giaTri.trim() === "") {
                laptop.loiNhuanRieng = null;
            } else {
                const tyLe = Number(giaTri);

                if (!Number.isFinite(tyLe) || tyLe < 0) {
                    alert("Tỷ lệ phải là số không âm!");
                    return;
                }
                laptop.loiNhuanRieng = tyLe;
            }
            localStorage.setItem("laptopShop", JSON.stringify(PRODUCTS));

            hienThiLoiNhuanLaptop();
        });
        oThaoTac.appendChild(nutSua);
    }
}
function hienThiGia() {
    const bang = document.getElementById("bang-gia-ban");

    bang.textContent = "";

    for (let i = 0; i < PRODUCTS.length; i++) {
        const laptop = PRODUCTS[i];
        let tyLe = null;

        if (laptop.loiNhuanRieng !== undefined &&
            laptop.loiNhuanRieng !== null) {
            tyLe = laptop.loiNhuanRieng;
        } else {
            for (let j = 0; j < danhSachLoai.length; j++) {
                if (danhSachLoai[j].ma === laptop.loai) {
                    tyLe = danhSachLoai[j].loiNhuan;

                    if (tyLe === undefined) {
                        tyLe = 10;
                    }

                    break;
                }
            }
        }

        const dong = bang.insertRow();

        dong.insertCell().textContent = laptop.id;
        dong.insertCell().textContent = laptop.ten;

        const oGiaVon = dong.insertCell();
        const oTyLe = dong.insertCell();
        const oGiaBan = dong.insertCell();

        if (laptop.giaVon === undefined) {
            oGiaVon.textContent = "Chưa nhập";
        } else {
            oGiaVon.textContent =
                laptop.giaVon.toLocaleString("vi-VN") + " đ";
        }

        if (tyLe === null) {
            oTyLe.textContent = "Chưa có loại phù hợp";
        } else {
            oTyLe.textContent = tyLe + "%";
        }

        if (laptop.giaVon !== undefined && tyLe !== null) {
            const giaBan = Math.round(
                laptop.giaVon * (1 + tyLe / 100)
            );

            oGiaBan.textContent =
                giaBan.toLocaleString("vi-VN") + " đ";
        } else {
            oGiaBan.textContent = "Chưa tính được";
        }
        const oThaoTac = dong.insertCell();
        const nutGiaVon = document.createElement("button");
        nutGiaVon.type = "button";
        nutGiaVon.textContent = "Nhập giá vốn";
        nutGiaVon.addEventListener("click", function () {
            let giaCu = "";
            if (laptop.giaVon !== undefined) {
                giaCu = laptop.giaVon;
            }
            const giaTri = prompt("Nhập giá vốn mẫu (đồng):", giaCu);
            if (giaTri === null) {
                return;
            }
            const giaVon = Number(giaTri);
            if (giaTri.trim() === "" ||
                !Number.isFinite(giaVon) ||
                !Number.isInteger(giaVon) ||
                giaVon <= 0) {
                alert("Giá vốn phải là số nguyên lớn hơn 0!");
                return;
            }
            laptop.giaVon = giaVon;

            localStorage.setItem("laptopShop", JSON.stringify(PRODUCTS));

            hienThiGia();
        });
        oThaoTac.appendChild(nutGiaVon);
        

        const nutApDungGia = document.createElement("button");
        nutApDungGia.type = "button";
        nutApDungGia.textContent = "Áp dụng giá bán";

        nutApDungGia.disabled =
            laptop.giaVon === undefined || tyLe === null;


        nutApDungGia.addEventListener("click", function () {

            if (laptop.giaVon === undefined || tyLe === null) {
                alert("Vui lòng nhập giá vốn trước!");
                return;
            }
            const giaMoi = Math.round(
                laptop.giaVon * (1 + tyLe / 100)
            );

            const xacNhan = confirm(
                "Bạn có muốn áp dụng giá bán mới cho " +
                laptop.ten + "?\n\n" +
                "Giá cũ: " +
                laptop.gia.toLocaleString("vi-VN") + " đ\n" +
                "Giá mới: " +
                giaMoi.toLocaleString("vi-VN") + " đ"
            );

            if (!xacNhan) {
                return;
            }

            laptop.gia = giaMoi;

            localStorage.setItem(
                "laptopShop",
                JSON.stringify(PRODUCTS)
            );
            if (viTriSuaLaptop === i) {
                oGiaLaptop.value = giaMoi;
            }
            hienThiLaptop();

            alert("Đã áp dụng giá bán thành công!");
        });

        oThaoTac.appendChild(nutApDungGia);

    }
}