// import $ from "jquery";

export function setCookie(name: string, value: any, days: number) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name: string) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function eraseCookie(name: string) {
    setCookie(name, "", -1);
}

export function number_format(number: any, decimals?: any, dec_point?: any, thousands_sep?: any) {
    var n = number,
        c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
    var d = dec_point == undefined ? "," : dec_point;
    var t = thousands_sep == undefined ? "." : thousands_sep,
        s = n < 0 ? "-" : "";
    var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j: number = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t);
}

export function slug(str: string) {
    // Chuyển hết sang chữ thường
    str = str.toLowerCase();

    // xóa dấu
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');

    // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, '');

    // Xóa khoảng trắng thay bằng ký tự -
    str = str.replace(/(\s+)/g, '-');

    // xóa phần dự - ở đầu
    str = str.replace(/^-+/g, '');

    // xóa phần dư - ở cuối
    str = str.replace(/-+$/g, '');

    // return
    return str;
}

export function convert_date(timestamp: number) {
    var months_arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    var date = new Date(timestamp * 1000);
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();
    var convdataTime = day + ' thg ' + month + ', ' + year;
    return convdataTime;
}

export function convert_datetime(timestamp: number) {
    var months_arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    var date = new Date(timestamp * 1000);
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds()
    var convdataTime = day + ' thg ' + month + ', ' + year + ' - ' + hours + ':' + minutes.substr(-2)
    return convdataTime;
}

export function formatNumberPhone(number_phone: string) {
    return number_phone.replace(
        /(^(?:\d{2}))?(\d{3})(?=(?:\d{5})+$)/g,
        '$1.$2.'
    );
}

const Pagination: any = {
    code: '',
    Extend: function (data: any) {
        data = data || {};
        Pagination.size = data.size || 0;
        Pagination.page = data.page || 1;
        Pagination.step = data.step || 3;
    },
    Add: function (s: any, f: any) {
        for (var i = s; i < f; i++) {
            Pagination.code += `<a class="page-item" data-area="${i}">${i}</a>`
        }
    },
    Last: function () {
        Pagination.code += '<i>...</i><a>' + Pagination.size + '</a>';
    },
    First: function () {
        Pagination.code += '<a>1</a><i>...</i>';
    },
    Click: function (e: any) {
        Pagination.page = +e.innerHTML;
        Pagination.Start();
        this['emitItemOnClick'] && this['emitItemOnClick'](this.page - 1);
    },
    Prev: function () {
        Pagination.page--;
        if (Pagination.page < 1) {
            Pagination.page = 1;
        }
        Pagination.Start();
        this['emitItemOnClick'] && this['emitItemOnClick'](this.page - 1);
    },
    Next: function () {
        Pagination.page++;
        if (Pagination.page > Pagination.size) {
            Pagination.page = Pagination.size;
        }
        Pagination.Start();
        this['emitItemOnClick'] && this['emitItemOnClick'](this.page - 1);
    },
    Bind: function () {
        let a = Pagination.e.getElementsByTagName('a');
        for (let i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === Pagination.page) {
                a[i].className = 'current'
            }
            a[i].addEventListener('click', (e: any) => Pagination.Click(a[i]), false);
        }
    },
    // write pagination
    Finish: function () {
        Pagination.e.innerHTML = Pagination.code;
        Pagination.code = '';
        Pagination.Bind();
    },

    Start: function () {
        if (Pagination.size < Pagination.step * 2 + 6) {
            Pagination.Add(1, Pagination.size + 1);
        } else if (Pagination.page < Pagination.step * 2 + 1) {
            Pagination.Add(1, Pagination.step * 2 + 4);
            Pagination.Last();
        } else if (Pagination.page > Pagination.size - Pagination.step * 2) {
            Pagination.First();
            Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
        } else {
            Pagination.First();
            Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
            Pagination.Last();
        }
        Pagination.Finish();
    },
    Buttons: function (e: any) {
        var nav = e.getElementsByTagName('a');
        nav[0].addEventListener('click', (e: any) => Pagination.Prev(), false);
        nav[1].addEventListener('click', (e: any) => Pagination.Next(), false);
    },

    Create: function (e: any) {
        try {
            var nav = e.getElementsByTagName('a');

            var html = [
                '<a class="prev"><i class="fas fa-long-arrow-alt-left"></i></a>', // previous button
                '<span></span>',
                '<a class="next"><i class="fas fa-long-arrow-alt-right"></i></a>'  // next button
            ];

            e.innerHTML = html.join('');
            Pagination.e = e.getElementsByTagName('span')[0];
            Pagination.Buttons(e);
        } catch (error) {

        }
    },
    Init: function (e: any, data: any) {
        Pagination.Extend(data);
        Pagination.Create(e);
        Pagination.Start();
    }
};

export function pagination(total: number, size: number, active: number, callbackItemActive?: any) {
    try {
        const page = Math.ceil(total / size)
        Pagination['emitItemOnClick'] = callbackItemActive;
        const tag = document.getElementById('pagination');
        tag && (tag.innerHTML = '');
        if (total > 0)
            Pagination.Init(document.getElementById('pagination'), {
                size: page, // pages size
                page: active,  // selected page
                step: 2,  // pages before and after current,
            });
        return Pagination;
    } catch (e) {
    }
}

export function getTimeRemaining(timeEnd: number) {
    timeEnd = timeEnd
    var now = new Date().getTime();
    var distance = timeEnd - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    // if (days < 10) {
    //     days = "0" + days;
    // }
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (distance < 0) {
        return 'Hết giờ'
    } else
        return days + " " + "ngày" + " " + hours + "h" + " " + minutes + "p"


}

export function convertToLocalDate(utcTime: any) {
    const time: number = new Date(utcTime).getTime() / 1000 + 7 * 60 * 60
    return convert_datetime(time)
}

export function convertToDate(utcTime: any) {
    const time: number = new Date(utcTime).getTime() / 1000 + 7 * 60 * 60
    return convert_date(time)
}

export const numberWithCommas = (x: any) => {
  if(x != undefined){
    x = x.toString().replace(/[.]/g, "");
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) {
        x = x.replace(pattern, "$1.$2");
    }
  }
  return x;
};

export function countJoinDate(time: number) {
    const createdAt = new Date(time).getTime()
    const now = new Date().getTime();
    const distance = now - createdAt
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    if (days < 1) {
        return "Hôm nay"
    }
    if (days >= 1 && days < 30) {
        return days + " ngày trước"
    }
    if (days > 30 && days < 365) {
        return Math.floor(days / 30) + " tháng trước"
    }
    if (days >= 365) {
        return Math.floor(days / 365) + " năm trước"
    }
}

export function convertBase64ToBlobUrl(source: string): string {
    const byteCharacters = atob(source.replace(/.+,/i, ''));
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'image/jpeg'});
    return URL.createObjectURL(blob);
}

export function getShortCount(n: number): string {
    if (n >= Math.pow(1000, 3)) return (n / Math.pow(1000, 3)).toFixed(0) + 't';
    else if (n >= Math.pow(1000, 2)) return (n / Math.pow(1000, 2)).toFixed(0) + 'm';
    else if (n >= 1000) return (n / 1000).toFixed(0) + 'k';
    else return n.toString();
}
