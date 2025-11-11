"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * 使用ES6 Class 達到監控螢幕視窗使物件連續出現以及淡入
 * @date 2022-01-16
 * @param {json} array 只用陣列使用此函數
 * @param {array} d 指派多個物件延遲秒數
 * @param {text} d.item 選擇物件
 * @param {text} d.delay 設定延遲種類animation-delay / transition-delay
 * @param {number} d.interval 設定秒數
 * @param {array} s 指派多個物件監測螢幕視窗延遲淡入
 * @param {text} s.item 選擇物件
 * @param {text} s.class 選擇效果
 * @param {text} s.active 設定執行開關
 * 
 * 範例
 * var kos = new KS({
 *  s: [{ item: ".box", kos: "fadeIn" }]
 * });
 */
var KOS = /*#__PURE__*/function () {
  function KOS(array) {
    var _this2 = this;
    _classCallCheck(this, KOS);
    var defs = {
      s: [],
      wt: $(window).scrollTop(),
      wb: $(window).scrollTop() + $(window).height(),
      wh: $(window).height()
    };
    Object.assign(defs, array);
    Object.assign(this, defs);

    // default 效果
    if (this.s.length != 0) {
      this.s.forEach(function (e) {
        var $el = $(e.item);
        $el.each(function () {
          var _this = this;
          $(this).css({
            transitionDuration: "0s"
          });
          $(this).attr('data-kos-position', e.position);
          $(this).attr('data-kos-loop', e.loop);
          $(this).addClass('kos--' + e.kos);
          setTimeout(function () {
            $(_this).css({
              transitionDuration: ""
            });
          }, 100);
        });
      });
    }

    //啟用偵測
    setTimeout(function () {
      _this2.update();
    }, 200);
    //滾動特效
    var $this = this;
    $(window).scroll(function () {
      $this.update();
    });
  }
  _createClass(KOS, [{
    key: "update",
    value: function update() {
      this.wh = $(window).height();
      this.wt = $(window).scrollTop();
      this.wb = this.wt + this.wh;
      var $this = this;
      $('[class*="kos--"]').each(function (e) {
        var $el = $(this);
        $el.each(function () {
          var et = $(this).offset().top;
          var eb = et + $(this).height();
          var pos = $(this).data('kos-position');
          var loop = $(this).data('kos-loop');
          switch (pos) {
            case 'top':
              pos = 18;
              break;
            case 'bottom':
              pos = 1;
              break;
            case 'center':
              pos = 10;
              break;
            default:
              pos = typeof pos != 'string' ? pos : 2;
              break;
          }
          if ($this.wb - $this.wh / 20 * pos > et && $this.wt + $this.wh / 20 * pos < eb) {
            $(this).addClass('kos--animated');
          } else {
            if (loop) {
              $(this).removeClass('kos--animated');
            }
          }
        });
      });
    }
  }]);
  return KOS;
}(); // 範例
// var kos = new KOS({
//   s: [
//     { item: ".box2", kos: "fadeLeft", position: 'top', loop: true },
//     { item: ".box1", kos: "fadeLeft", position: 2, loop: true }
//   ]
// });
// Class追蹤
$.fn.watchClass = function (callback) {
  return this.each(function () {
    var el = this;
    var $el = $(this);
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {
          callback.call(el, $el.attr("class"));
        }
      });
    });
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["class"]
    });
    // 儲存 observer 方便之後停止監聽
    $el.data("classObserver", observer);
  });
};
$.fn.unwatchClass = function () {
  return this.each(function () {
    var observer = $(this).data("classObserver");
    if (observer) observer.disconnect();
  });
};

// 進入視窗
$.fn.watchScroll = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var settings = $.extend({
    offset: 0.15,
    // 視窗上下邊界留多少比例才觸發
    once: true,
    // 預設觸發一次就加上 active
    callback: null // 額外 callback
  }, options);
  var $elements = this;
  function checkVisible() {
    var w_t = $(window).scrollTop();
    var w_h = $(window).height();
    var w_b = w_t + w_h;
    $elements.each(function () {
      var $el = $(this);
      if (settings.once && $el.hasClass("scroll-active")) return;
      var e_t = $el.offset().top;
      var e_b = e_t + $el.outerHeight();
      if (w_t + w_h * settings.offset <= e_t && w_b - w_h * settings.offset >= e_b) {
        $el.addClass("scroll-active"); // 標記已顯示
        if (typeof settings.callback === "function") {
          settings.callback.call(this);
        }
        $el.trigger("scrollin"); // jQuery 事件型式
      }
    });
  }

  // 綁定事件
  $(window).on("scroll.watchScroll resize.watchScroll", checkVisible);

  // 初始化也檢查一次
  checkVisible();
  return this;
};

// is
function is(item) {
  var data = $(item).is(item);
  return data;
}

// type text
function type_text() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$el = _ref.el,
    el = _ref$el === void 0 ? '.type-text' : _ref$el,
    _ref$time = _ref.time,
    time = _ref$time === void 0 ? 200 : _ref$time;
  $(el).each(function () {
    var text = $(this).text().trim().split('');
    // console.log(text);
    var input_text = '';
    text.forEach(function (e) {
      if (e == " ") {
        input_text += "<span class=\"letter empty\"></span>";
      } else {
        input_text += "<span class=\"letter\">" + e + "</span>";
      }
    });
    $(this).html("<span class=\"type-text-row\">" + input_text + "<span class=\"line\"></span></span>");
  });
  $(".type-text-row").watchScroll({
    offset: 0.1,
    // 上下各留 20% 區域才觸發
    callback: function callback() {
      var $row = $(this);
      var $letters = $row.find(".letter");
      setTimeout(function () {
        $letters.each(function (i) {
          var _this3 = this;
          setTimeout(function () {
            $(_this3).css({
              display: "block",
              visibility: "visible",
              width: "auto"
            });
            if (i + 1 == $letters.length) {
              $row.find('.line').hide();
            }
          }, i * time);
        });
      }, 300);
    }
  });
}

// count text
function count_text() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref2$el = _ref2.el,
    el = _ref2$el === void 0 ? '.count-text' : _ref2$el,
    _ref2$stepTime = _ref2.stepTime,
    stepTime = _ref2$stepTime === void 0 ? 10 : _ref2$stepTime,
    _ref2$duration = _ref2.duration,
    duration = _ref2$duration === void 0 ? 2000 : _ref2$duration;
  $(el).each(function () {
    var count = parseInt($(this).text());
    $(this).html("<span class=\"count-text-row\" data-count=\"" + count + "\">0+</span>");
  });
  $(".count-text-row").watchScroll({
    offset: 0.2,
    // 上下各留 20% 區域才觸發
    callback: function callback() {
      var $row = $(this);
      var target = $row.data('count');
      var current = 0;
      var steps = duration / stepTime;
      var increment = Math.ceil(target / steps);
      var timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        $row.text(current + "+");
      }, stepTime);
    }
  });
}
function showAlert() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref3$title = _ref3.title,
    title = _ref3$title === void 0 ? '提示' : _ref3$title,
    _ref3$text = _ref3.text,
    text = _ref3$text === void 0 ? '' : _ref3$text,
    _ref3$icon = _ref3.icon,
    icon = _ref3$icon === void 0 ? 'info' : _ref3$icon,
    _ref3$timer = _ref3.timer,
    timer = _ref3$timer === void 0 ? 1000 : _ref3$timer,
    _ref3$confirmButton = _ref3.confirmButton,
    confirmButton = _ref3$confirmButton === void 0 ? false : _ref3$confirmButton,
    _ref3$cancelButton = _ref3.cancelButton,
    cancelButton = _ref3$cancelButton === void 0 ? false : _ref3$cancelButton,
    _ref3$willClose = _ref3.willClose,
    willClose = _ref3$willClose === void 0 ? null : _ref3$willClose;
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    timer: timer,
    timerProgressBar: true,
    showConfirmButton: confirmButton,
    showCancelButton: cancelButton,
    willClose: typeof willClose === 'function' ? willClose : undefined
  });
}
function showNotication() {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref4$title = _ref4.title,
    title = _ref4$title === void 0 ? '提示' : _ref4$title,
    _ref4$text = _ref4.text,
    text = _ref4$text === void 0 ? '1秒後自動關閉' : _ref4$text,
    _ref4$willClose = _ref4.willClose,
    willClose = _ref4$willClose === void 0 ? null : _ref4$willClose;
  showAlert({
    title: title,
    text: text,
    icon: 'warning',
    willClose: willClose
  });
}
function showError() {
  var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref5$title = _ref5.title,
    title = _ref5$title === void 0 ? '操作失敗' : _ref5$title,
    _ref5$text = _ref5.text,
    text = _ref5$text === void 0 ? '1秒後自動關閉' : _ref5$text,
    _ref5$willClose = _ref5.willClose,
    willClose = _ref5$willClose === void 0 ? null : _ref5$willClose;
  showAlert({
    title: title,
    text: text,
    icon: 'error',
    willClose: willClose
  });
}
function showSuccess() {
  var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref6$title = _ref6.title,
    title = _ref6$title === void 0 ? '操作成功' : _ref6$title,
    _ref6$text = _ref6.text,
    text = _ref6$text === void 0 ? '1秒後自動關閉' : _ref6$text,
    _ref6$willClose = _ref6.willClose,
    willClose = _ref6$willClose === void 0 ? null : _ref6$willClose;
  showAlert({
    title: title,
    text: text,
    icon: 'success',
    willClose: willClose
  });
}
function showConfirm() {
  var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref7$title = _ref7.title,
    title = _ref7$title === void 0 ? '注意' : _ref7$title,
    _ref7$text = _ref7.text,
    text = _ref7$text === void 0 ? '' : _ref7$text,
    _ref7$then = _ref7.then,
    then = _ref7$then === void 0 ? null : _ref7$then;
  Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showDenyButton: true,
    confirmButtonText: "確認",
    denyButtonText: "\u53D6\u6D88"
  }).then(function (result) {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed && typeof then === 'function') {
      then(); // ✅ 執行傳入的 callback
    }
  });
}
var AccountSharing = /*#__PURE__*/function () {
  function AccountSharing(array) {
    var _this4 = this;
    _classCallCheck(this, AccountSharing);
    var defs = {
      members: [
        // {
        //   idx: 0,
        //   title: "果子",
        //   qty: 2,
        //   cost: 0
        // },
        // {
        //   idx: 1,
        //   title: "桃子",
        //   qty: 3,
        //   cost: 0
        // },
        // {
        //   idx: 2,
        //   title: "以樂",
        //   qty: 2,
        //   cost: 0
        // },
        // {
        //   idx: 3,
        //   title: "燦",
        //   qty: 3,
        //   cost: 0
        // },
      ],
      purchase: [
        // {
        //   title: "Costco",
        //   price: 1400,
        //   member: 0,
        //   sharing: 0,
        //   idx: 0
        // },
        // {
        //   title: "全聯",
        //   price: 3000,
        //   member: 1,
        //   sharing: 0,
        //   idx: 1
        // },
        // {
        //   title: "住宿費",
        //   price: 19200,
        //   member: 2,
        //   sharing: 1,
        //   idx: 2
        // },
        // {
        //   title: "酒水",
        //   price: 6000,
        //   member: 0,
        //   sharing: 0,
        //   idx: 3
        // },
        // {
        //   title: "酒水2",
        //   price: 1000,
        //   member: 3,
        //   sharing: 1,
        //   idx: 3
        // },
      ],
      options: {
        sharing: ["家庭人數", "家庭"]
      },
      html: {
        member: "<div class=\"group card py-2 px-3 bg-light d-flex flex-row justify-content-between align-items-center gap-3 animate__animated animate__fadeIn\"><p class=\"m-0\">{{title}}<span class=\"d-block fs-small text-secondary\">\u5206\u5E33\u4EBA\u6578\uFF1A{{qty}} \u4EBA</span></p><button type=\"button\" class=\"delete btn btn-sm btn-danger\" data-idx=\"{{idx}}\"><i class=\"bi bi-trash-fill\"></i></button></div>",
        purchase: "<div class=\"group card py-2 px-3 bg-light d-flex flex-row justify-content-between align-items-center gap-3 animate__animated animate__fadeIn\"><p class=\"m-0\">{{title}}<span class=\"d-block fs-small text-secondary\">\u4ED8\u8CBB\u5BB6\u5EAD/\u6210\u54E1\uFF1A{{member}}\uFF5C\u8CBB\u7528\uFF1A{{price}}\uFF5C\u5206\u5E33\u65B9\u5F0F\uFF1A{{sharing}}</span></p><button type=\"button\" class=\"delete btn btn-sm btn-danger\" data-idx=\"{{idx}}\"><i class=\"bi bi-trash-fill\"></i></button></div>",
        history: "<div class=\"group alert alert-warning py-2 px-3 m-0 row g-3 align-items-center animate__animated animate__fadeIn\"><p class=\"m-0 col-4\">{{from}}</p><p class=\"m-0 text-center col-4\">{{price}}<br><i class=\"bi bi-arrow-right\"></i></p><p class=\"m-0 col-4 text-end\">{{to}}</p></div>"
      }
    };
    Object.assign(defs, array);
    Object.assign(this, defs);
    this.init();
    this.memberController();
    this.purchaseController();
    $('#reset').on('click', function () {
      showConfirm({
        text: "確認要重置已新增內容？",
        then: function then() {
          _this4.members = [];
          _this4.purchase = [];
          _this4.resetHtml();
          _this4.updatePurchaseMemberOptions();
          _this4.updateMemberCost();
          _this4.updateTotal();
        }
      });
    });
  }
  _createClass(AccountSharing, [{
    key: "init",
    value: function init() {
      var _this5 = this;
      if (this.members.length > 0) {
        $("#member-list .empty").hide();
        var html = this.html.member;
        this.members.forEach(function (e) {
          var complete_html = html.replace(/{{title}}/g, e.title).replace(/{{qty}}/g, e.qty).replace(/{{idx}}/g, e.idx);
          $('#member-list').append(complete_html);
        });
      }
      if (this.purchase.length > 0) {
        $("#purchase-list .empty").hide();
        var _html = this.html.purchase;
        this.purchase.forEach(function (e) {
          var member_name = _this5.getMemberName(e.member);
          var complete_html = _html.replace(/{{title}}/g, e.title).replace(/{{price}}/g, e.price).replace(/{{member}}/g, member_name).replace(/{{sharing}}/g, _this5.options.sharing[e.sharing]).replace(/{{idx}}/g, e.idx);
          $('#purchase-list').append(complete_html);
        });
      }
      this.updatePurchaseMemberOptions();
      this.updateMemberCost();
      this.updateTotal();
    }
  }, {
    key: "memberController",
    value: function memberController() {
      var $this = this;
      // 新增
      $('#add-member').on("click", function () {
        var val = {
          member_title: $("#member-title").val().trim(),
          member_qty: $("#member-qty").val().trim()
        };
        $('#add-member-form .form-control').removeClass('is-invalid');
        if (val.member_title == "" || val.member_qty == "") {
          return showError({
            text: "請填寫家庭成員、分擔人數",
            willClose: function willClose() {
              if (val.member_title == "") {
                $('#member-title').addClass('is-invalid');
              }
              if (val.member_qty == "") {
                $('#member-qty').addClass('is-invalid');
              }
            }
          });
        }
        var idx = $this.members.length;
        var html = $this.html.member.replace(/{{title}}/g, val.member_title).replace(/{{qty}}/g, val.member_qty).replace(/{{idx}}/g, idx);
        $('#member-list .empty').hide();
        $('#member-list').append(html);
        $this.members.push({
          idx: idx,
          title: val.member_title,
          qty: val.member_qty,
          cost: 0
        });
        $('#member-title, #member-qty').val('');
        // 更新選單
        $this.updatePurchaseMemberOptions();
        $this.updateMemberCost();
      });
      // 刪除
      $(document).on("click", "#member-list .group .delete", function () {
        var _this6 = this;
        showConfirm({
          title: "是否要刪除此成員？",
          text: "刪除後會將此家庭/成員的消費項目一並刪除",
          then: function then() {
            var idx = $(_this6).data('idx');
            $this.members.forEach(function (e, index) {
              if (e.idx == idx) {
                $(_this6).closest('.group').remove();
                $this.members.splice(index, 1);
              }
            });
            if ($this.members.length == 0) {
              $('#member-list .empty').show();
            }
            // 更新選單
            $this.updatePurchaseMemberOptions();
            // 清除某會員消費內容
            $this.cleanPurchase(idx);
            // 計算消費
            $this.updateMemberCost();
          }
        });
      });
    }
  }, {
    key: "purchaseController",
    value: function purchaseController() {
      var $this = this;
      // 新增
      $('#add-purchase').on("click", function () {
        var val = {
          purchase_title: $("#purchase-title").val().trim(),
          purchase_price: $("#purchase-price").val().trim(),
          purchase_member: $("#purchase-member").val().trim(),
          purchase_sharing: $("#purchase-sharing").val().trim()
        };
        $('#add-purchase-form .form-control, #add-purchase-form .form-select').removeClass('is-invalid');
        if (val.purchase_title == "" || val.purchase_price == "" || val.purchase_member == "" || val.purchase_sharing == "") {
          return showError({
            text: "請正確填寫內容",
            willClose: function willClose() {
              if (val.purchase_title == "") {
                $('#purchase-title').addClass('is-invalid');
              }
              if (val.purchase_price == "") {
                $('#purchase-price').addClass('is-invalid');
              }
              if (val.purchase_member == "") {
                $('#purchase-member').addClass('is-invalid');
              }
              if (val.purchase_sharing == "") {
                $('#purchase-sharing').addClass('is-invalid');
              }
            }
          });
        }
        var idx = $this.purchase.length;
        var member_name = $this.getMemberName(val.purchase_member);
        var html = $this.html.purchase.replace(/{{title}}/g, val.purchase_title).replace(/{{price}}/g, val.purchase_price).replace(/{{member}}/g, member_name).replace(/{{sharing}}/g, $this.options.sharing[val.purchase_sharing]).replace(/{{idx}}/g, idx);
        $('#purchase-list .empty').hide();
        $('#purchase-list').append(html);
        $this.purchase.push({
          idx: idx,
          title: val.purchase_title,
          price: val.purchase_price,
          member: val.purchase_member,
          sharing: val.purchase_sharing
        });
        $('#purchase-title, #purchase-price, #purchase-member, #purchase-sharing').val('');
        $this.updateMemberCost();
        $this.updateTotal();
      });
      // 刪除
      $(document).on("click", "#purchase-list .group .delete", function () {
        var _this7 = this;
        showConfirm({
          title: "是否要刪除此消費記錄？",
          then: function then() {
            var idx = $(_this7).data('idx');
            $this.purchase.forEach(function (e, index) {
              if (e.idx == idx) {
                $(_this7).closest('.group').remove();
                $this.purchase.splice(index, 1);
              }
            });
            if ($this.purchase.length == 0) {
              $('#purchase-list .empty').show();
            }
            // 更新選單
            $this.updatePurchaseMemberOptions();
            $this.updateMemberCost();
            $this.updateTotal();
          }
        });
      });
    }
  }, {
    key: "updatePurchaseMemberOptions",
    value: function updatePurchaseMemberOptions() {
      // 清空
      $("#purchase-member option").each(function (idx, e) {
        if (idx != 0) {
          $(this).remove();
        }
      });
      this.members.forEach(function (e) {
        var option = "<option value=\"" + e.idx + "\">" + e.title + "</option>";
        $("#purchase-member").append(option);
      });
    }
  }, {
    key: "getMemberName",
    value: function getMemberName(idx) {
      var title = "";
      this.members.forEach(function (e) {
        if (e.idx == idx) {
          title = e.title;
        }
      });
      return title;
    }
  }, {
    key: "cleanPurchase",
    value: function cleanPurchase(idx) {
      var _this8 = this;
      this.purchase.forEach(function (e, index) {
        if (idx == e.member) {
          _this8.purchase.splice(index, 1);
          $('#purchase-list .group').eq(index).remove();
        }
      });
      if (this.purchase.length == 0) {
        $('#purchase-list .empty').show();
      }
      this.updateTotal();
    }
  }, {
    key: "updateMemberCost",
    value: function updateMemberCost() {
      var _this9 = this;
      var member_qty_total = 0;
      $('.member-cost').html('');
      if (this.members.length > 0) {
        var member = "";
        this.members.forEach(function (e, idx) {
          member += "<h6 class=\"mb-2\">" + e.title + "\uFF1A<span id=\"cost-" + e.idx + "\">0</span></h6>";
          _this9.members[idx].cost = 0;
          _this9.members[idx].pay = 0;
          member_qty_total += parseInt(e.qty);
        });
        $('.member-cost').html(member);
      }
      if (this.purchase.length > 0) {
        var total_0 = 0; // 家庭人數總額
        var total_1 = 0; // 家庭總額
        this.purchase.forEach(function (e) {
          switch (e.sharing) {
            case 0:
            case "0":
              total_0 += Number(e.price);
              break;
            case 1:
            case "1":
              total_1 += Number(e.price);
              break;
          }
          _this9.members.forEach(function (m_e, idx) {
            if (m_e.idx == e.member) {
              _this9.members[idx].cost += Number(e.price);
            }
          });
        });
        this.members.forEach(function (e, idx) {
          $("#cost-" + e.idx).text(e.cost);
          _this9.members[idx].pay += total_0 / member_qty_total * e.qty + total_1 / _this9.members.length - e.cost;
        });
        var n = 0;
        var pay_history = [];
        // while (n < this.members.length) {
        for (var _n in this.members) {
          if (this.members[_n].pay < 0) {
            for (var i in this.members) {
              if (this.members[i].idx != this.members[_n].idx && this.members[i].pay > 0 && this.members[_n].pay < 0) {
                var amount = this.members[_n].pay + this.members[i].pay;
                if (amount > 0) {
                  // 結清
                  pay_history.push({
                    from: this.members[i].title,
                    to: this.members[_n].title,
                    price: Math.floor(Math.abs(this.members[_n].pay) / 10) * 10
                  });
                  this.members[_n].pay = 0;
                  this.members[i].pay = amount;
                } else {
                  // 未結清
                  pay_history.push({
                    from: this.members[i].title,
                    to: this.members[_n].title,
                    price: Math.floor(Math.abs(this.members[i].pay) / 10) * 10
                  });
                  this.members[_n].pay = amount;
                  this.members[i].pay = 0;
                }
              }
            }
          }
        }
        if (pay_history.length > 0) {
          var history_html = "";
          pay_history.forEach(function (e) {
            history_html += _this9.html.history.replace(/{{from}}/g, e.from).replace(/{{to}}/g, e.to).replace(/{{price}}/g, e.price);
          });
          $("#sharing-result .group").remove();
          $("#sharing-result .empty").hide().before(history_html);
        } else {
          $("#sharing-result .empty").show().siblings('.group').remove();
        }
      }

      // 儲存備份
      localStorage.setItem("memory", JSON.stringify(this));
    }
  }, {
    key: "updateTotal",
    value: function updateTotal() {
      var total = 0;
      this.purchase.forEach(function (e) {
        total += parseInt(e.price);
      });
      $('#total').text(total);
    }
  }, {
    key: "resetHtml",
    value: function resetHtml() {
      $('#member-list .empty, #purchase-list .empty, #sharing-result .empty').show().siblings('.group').remove();
    }
  }]);
  return AccountSharing;
}();
$(function () {
  var memory = localStorage.getItem("memory");
  window.action = new AccountSharing(JSON.parse(memory));
});