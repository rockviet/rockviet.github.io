
// Lấy các tham số tìm kiếm từ URL
var urlParams = new URLSearchParams(window.location.search);
var searchParams = [];
urlParams.forEach(function (value, key) {
    searchParams.push({
        field: key,
        type: 'like',
        value: value
    });
});

// Đổi từ chuỗi sang đối tượng ngày
var dateConverter = function (dateStr) {
    // Kiểm tra định dạng của giá trị ngày tháng năm
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        var parts = dateStr.split("/");
        var year = parseInt(parts[2], 10);
        var month = parseInt(parts[1], 10);
        var day = parseInt(parts[0], 10);
        var dateObj = new Date(year, month - 1, day);
        return dateObj.getTime();
    } else if (/^\d{2}\/\d{4}$/.test(dateStr)) {
        var parts = dateStr.split("/");
        var year = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var dateObj = new Date(year, month - 1);
        return dateObj.getTime();
    } else if (/^\d{4}$/.test(dateStr)) {
        var year = parseInt(dateStr, 10);
        var dateObj = new Date(year, 0);
        return dateObj.getTime();
    } else {
        return dateStr;
    }
}


var filterByValue = function (value) {

};

// Tạo đối tượng formatter cho cột chứa mảng dữ liệu
var arrayFormatter = function (cell, formatterParams, onRendered) {
    var value = cell.getValue();
    return value.map(function (value) {
        return '<span class="nowrap">' + value + '</span>';
    }).join("<br>");
};

// Định nghĩa formatter cho cột Type
var typeFormatter = function (cell, formatterParams, onRendered) {
    var value = cell.getValue();
    return '<span class="badge ' + value.toLowerCase() + '">' + value + '</span>';
};

// Định nghĩa formatter cho cột Format
var formatFormatter = function (cell, formatterParams, onRendered) {
    var values = cell.getValue();
    return values.map(function (value) {
        return '<img title="' + value + '" height="30" src="icons/' + value.toLowerCase().split(" ").join("-") + '.png" />';
    }).join(" ");
};

// Tạo đối tượng sorter cho cột có kiểu array
var arraySorter = function (a, b) {
    return a.join().localeCompare(b.join());
};

// Tạo đối tượng sorter cho cột Date
var dateSorter = function (a, b) {
    // Chuyển đổi giá trị ngày tháng năm sang đối tượng Date
    var aDate = new Date(dateConverter(a));
    var bDate = new Date(dateConverter(b));
    // So sánh hai giá trị ngày tháng năm
    if (aDate < bDate) {
        return -1;
    } else if (aDate > bDate) {
        return 1;
    } else {
        return 0;
    }
};

// Cấu hình bảng Tabulator
var table = new Tabulator("#datatable", {
    responsiveLayout: "hide",
    ajaxURL: "data.json",   // URL của file JSON
    ajaxConfig: "GET",      // Phương thức gửi yêu cầu
    layout: "fitColumns",   // Cấu hình bố cục của bảng
    stickyHeader: true,
    columns: [
        { title: "STT<br><button class='btn btn-danger btn-sm' id='clearFilter'>Xóa tìm kiếm</button>", width: 100, field: "rownum", formatter: "rownum", headerSort: false },
        // Cấu hình các cột
        { title: "Tên sản phẩm", field: "Name", headerFilter: true, headerFilterPlaceholder: "Tìm tên sản phẩm..." },
        { title: "Ban nhạc/Nghệ sĩ", field: "Band", formatter: arrayFormatter, sorter: arraySorter, headerFilter: true, headerFilterPlaceholder: "Tìm nghệ sĩ/ban nhạc..." },
        { title: "Loại đĩa nhạc", maxWidth: 200, field: "AlbType", formatter: typeFormatter, hozAlign: "center", sorter: arraySorter, headerFilter: true, headerFilterPlaceholder: "Album/EP/Single/.." },
        { title: "Thể loại", field: "Genre", formatter: arrayFormatter, sorter: arraySorter, headerFilter: true, headerFilterPlaceholder: "Tìm thể loại..." },
        { title: "Định dạng", maxWidth: 150, field: "Format", formatter: formatFormatter, hozAlign: "center", sorter: arraySorter, headerFilter: true, headerFilterPlaceholder: "CD/DVD/USB/Vinyl/..." },
        { title: "Ngày phát hành", maxWidth: 200, field: "Date", sorter: dateSorter, headerFilter: true, headerFilterPlaceholder: "Tìm ngày..." },
        { title: "Năm", field: "Year", visible: false }
    ],
    initialSort: [           // Sắp xếp dữ liệu khi bảng được tạo
        { column: "Date", dir: "desc" }
    ],
    // Lưu các tham số tìm kiếm vào URL khi thay đổi
    persistenceMode: "history",
    // Cấu hình URL cho các trang phân trang
    paginationDataSent: {
        page: "page",
        size: "size"
    }
});

// Hàm cập nhật tham số tìm kiếm của URL
var updateSearchParams = function (filters) {

    // Cập nhật URL với các tham số tìm kiếm mới
    var newSearchParams = new URLSearchParams();
    // Cập nhật các tham số tìm kiếm của URL
    filters.forEach(function (param) {
        if (param.value !== "") {
            newSearchParams.set(param.field, param.value);
        } else {
            newSearchParams.delete(param.field);
        }
    });

    if (newSearchParams.size) {
        history.replaceState(null, null, "?" + newSearchParams.toString());
    } else {
        history.replaceState({}, document.title, window.location.pathname);
    }
};

// Hàm gán các giá trị filter vào header input
var setFiltersToHeaderInputs = function () {
    // Lấy danh sách các filter đã áp dụng
    var filters = searchParams;

    var headerFilterEl;

    // Duyệt qua danh sách các filter và gán giá trị cho input tương ứng trong header filter
    filters.forEach(function (filter) {
        // Lấy đối tượng cột từ tên trường
        var column = table.getColumn(filter.field);
        if (column) {
            headerFilterEl = column.getElement().querySelector(".tabulator-header-filter input");
            if (headerFilterEl) {
                if (headerFilterEl.nodeName === "INPUT") {
                    headerFilterEl.value = filter.value;
                } else if (headerFilterEl.nodeName === "SELECT") {
                    headerFilterEl.value = filter.value;
                }
            }
        }
    });

    if (headerFilterEl) {
        try {
            headerFilterEl.dispatchEvent(new Event("search"));
        } catch (e) {
            console.log(headerFilterEl, e);
        }
    }
}

// Làm cho kết quả tìm kiếm là duy nhất đối với 1 tiêu chí
var uniqFilterColumn = function (arr) {
    arr = arr.reverse();
    // Mảng phụ để lưu trữ các giá trị duy nhất của property "name"
    var uniqueColumns = [];

    // Duyệt qua các phần tử trong mảng gốc
    for (var i = arr.length - 1; i >= 0; i--) {
        var obj = arr[i];
        if (uniqueColumns.indexOf(obj.field) === -1) {
            // Nếu giá trị của property "name" chưa có trong mảng phụ, thêm giá trị vào mảng phụ
            uniqueColumns.push(obj.field);
        } else {
            // Nếu giá trị của property "name" đã có trong mảng phụ, xóa phần tử khỏi mảng gốc
            arr.splice(i, 1);
        }
    }

    return arr;
};

// Áp dụng các tham số tìm kiếm vào bảng khi trang được tải lại
table.on("tableBuilt", function () {
    // Lắng nghe sự kiện thay đổi giá trị tìm kiếm của cột
    table.on("dataFiltered", function (filters, row) {
        // Cập nhật tham số tìm kiếm của URL
        updateSearchParams(filters);
    });

    // Đăng ký sự kiện "click" cho nút xóa bộ lọc
    document.getElementById("clearFilter").addEventListener("click", function () {
        table.clearFilter();
        table.clearHeaderFilter();
        document.querySelector(".tabulator-header-filter input").value = "";
        history.replaceState({}, document.title, window.location.pathname);
    });

    // Gán các giá trị filter vào header input
    setFiltersToHeaderInputs();
});

// Submit form feedback
var form = document.getElementById("feedback-form");
async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("feedback-form-status");
    var data = new FormData(event.target);
    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "Đã gửi thành công! Cảm ơn bạn!!";
            form.reset()
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, "errors")) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                } else {
                    status.innerHTML = "Oops! Có lỗi xảy ra."
                }
            });
        }
        $("#feedback-form-status").show();
        $("#feedback-form").hide();
    }).catch(error => {
        status.innerHTML = "Oops! Có lỗi xảy ra.";
        $("#feedback-form-status").show();
        $("#feedback-form").hide();
    });
}
form.addEventListener("submit", handleSubmit);

$("#feedbackModal").on("hidden.bs.modal", function (e) {
    $("#feedback-form-status").hide();
    $("#feedback-form").show();
});
