const formTimKiem = document.getElementById("tim-kiem");
const TenLapTop = document.getElementById("ten-laptop");
const cacLoaiLapTop = document.querySelectorAll('input[name="loai-laptop"]');
const cacMucGia = document.querySelectorAll('input[name="gia"]');
const cacSanPham = document.querySelectorAll("#san-pham article");
const thongBao = document.getElementById("khong-tim-thay");
const trangTruoc = document.getElementById("trang-truoc");
const soTrang = document.getElementById("so-trang");
const trangSau = document.getElementById("trang-sau");
const khungPhanTrang = document.getElementById("phan-trang");
const nutXoaBoLoc = document.getElementById("xoa-bo-loc");
let trangHienTai = 1;
const soSanPhamMoiTrang = 6;
let ketQuaLoc = Array.from(cacSanPham);

function locSanPham() {
    const tuKhoa = TenLapTop.value.trim().toLowerCase();
    const loaiDuocChon = document.querySelector('input[name="loai-laptop"]:checked').value;
    const mucGiaDuocChon = Array.from(cacMucGia).filter(function (o) {
        return o.checked;
    });

    ketQuaLoc = [];
    for (const sanPham of cacSanPham) {
        const tenSanPham = sanPham.querySelector("h3").textContent.toLowerCase();
        const giaSanPham = Number(sanPham.dataset.gia);
        const loaiSanPham = sanPham.dataset.loai;

        const dungLoai = loaiDuocChon === "" || loaiSanPham === loaiDuocChon;

        // Không tick ô nào = không lọc theo giá; tick nhiều ô = thỏa một trong các mức
        let dungKhoangGia = mucGiaDuocChon.length === 0;
        for (const muc of mucGiaDuocChon) {
            const tu = Number(muc.dataset.tu);
            const den = muc.dataset.den === "" ? Infinity : Number(muc.dataset.den);
            if (giaSanPham >= tu && giaSanPham < den) {
                dungKhoangGia = true;
            }
        }

        if (tenSanPham.includes(tuKhoa) && dungKhoangGia && dungLoai) {
            ketQuaLoc.push(sanPham);
        }
    }

    thongBao.hidden = ketQuaLoc.length > 0;
    trangHienTai = 1;
    hienThiTrang();
    hienDanhSach();
}

// Tìm bằng ô tìm kiếm ở header
formTimKiem.addEventListener("submit", function (suKien) {
    suKien.preventDefault();
    locSanPham();
    document.getElementById("san-pham").scrollIntoView();
});

// Bấm radio / checkbox là lọc ngay
for (const o of cacLoaiLapTop) {
    o.addEventListener("change", locSanPham);
}
for (const o of cacMucGia) {
    o.addEventListener("change", locSanPham);
}

nutXoaBoLoc.addEventListener("click", function () {
    formTimKiem.reset();
    locSanPham();
});
function hienThiTrang() {
     for (const sanPham of cacSanPham) {   // ẩn hết trước, rồi mới hiện thẻ của trang này
        sanPham.hidden = true;
    }
    const viTriBatDau = (trangHienTai - 1) * soSanPhamMoiTrang;
    const viTriKetThuc = viTriBatDau + soSanPhamMoiTrang;
    const tongSoTrang = Math.ceil(ketQuaLoc.length / soSanPhamMoiTrang);
    let viTri = 0;
    for (const sanPham of ketQuaLoc) {
        if (viTri >= viTriBatDau && viTri < viTriKetThuc) {
            sanPham.hidden = false;
        } else {
            sanPham.hidden = true;
        }
        viTri = viTri + 1;
    }
    soTrang.textContent = "Trang " + trangHienTai + " / " + tongSoTrang;
    trangTruoc.disabled = trangHienTai === 1;
    trangSau.disabled = viTriKetThuc >= ketQuaLoc.length;
    khungPhanTrang.hidden = tongSoTrang <= 1;
}
trangTruoc.addEventListener("click", function () {
    trangHienTai = trangHienTai - 1;
    hienThiTrang();
});
trangSau.addEventListener("click", function () {
    trangHienTai = trangHienTai + 1;
    hienThiTrang();
});
hienThiTrang();

// // Chuyển giữa danh sách và chi tiết sản phẩm trong cùng trang index.html.
// const khuVucSanPham = document.getElementById("san-pham");
// const khuVucGioiThieu = document.getElementById("gioi-thieu");
// const cacKhuVucChiTiet = document.querySelectorAll(".chi-tiet-san-pham");
// // const cacLienKetChiTiet = document.querySelectorAll(".xem-chi-tiet");
// const cacNutQuayLai = document.querySelectorAll(".quay-lai-danh-sach");

function hienDanhSach() {
    document.getElementById("chi-tiet-san-pham").hidden = true;
    document.getElementById("san-pham").hidden = false;
}

// // Bấm vào sản phẩm để mở trang chi tiết
// for (const sanPham of cacSanPham) {
//     sanPham.tabIndex = 0; // cho phép dùng phím Tab + Enter

//     function moChiTiet() {
//         const ma = sanPham.querySelector(".them-vao-gio").dataset.ma;
//         const nutTrongChiTiet = document.querySelector(
//             '.chi-tiet-san-pham .them-vao-gio[data-ma="' + ma + '"]'
//         );
//         const khuVucChiTiet = nutTrongChiTiet.closest(".chi-tiet-san-pham");
//         khuVucSanPham.hidden = true;
//         khuVucGioiThieu.hidden = true;
//         khuVucChiTiet.hidden = false;
//         khuVucChiTiet.scrollIntoView();
//     }

//     sanPham.addEventListener("click", function (suKien) {
//         // Bấm nút "Thêm vào giỏ hàng" thì không mở chi tiết
//         if (suKien.target.closest("button")) return;
//         moChiTiet();
//     });

//     sanPham.addEventListener("keydown", function (suKien) {
//         if (suKien.key === "Enter" && suKien.target === sanPham) {
//             moChiTiet();
//         }
//     });
// }

// for (const nutQuayLai of cacNutQuayLai) {
//     nutQuayLai.addEventListener("click", function () {
//         hienDanhSach();
//         khuVucSanPham.scrollIntoView();
//     });
// }

// for (const lienKetMenu of document.querySelectorAll("nav a")) {
//     lienKetMenu.addEventListener("click", hienDanhSach);
// }
