"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @description 判斷物件是否存在
 * @param {string} item 選擇物件
 */
function is(item) {
  var data = $(item).is($(item));
  return data;
} // ----------------------
// 打字效果


var AutoType = /*#__PURE__*/function () {
  function AutoType(f) {
    _classCallCheck(this, AutoType);

    // item->文字段落、itemLen->段落長度、index->段落位置
    this.item = $(f);
    this.itemLen = this.item.length;
    this.index = 0; // fontArray->預設文字陣列、textIdx->字句位置、font->載入文字

    this.fontArray = [];
    this.textIdx = 0;
    this.font = "";
  } // 長度


  _createClass(AutoType, [{
    key: "update",
    // 更新文字
    value: function update() {
      this.index++;
      this.textIdx = 0;
      this.font = "";
      this.putFont();
    } // 放入字句

  }, {
    key: "putFont",
    value: function putFont() {
      var _this = this;

      this.fontArray = this.item.eq(this.index).text().trim().split('');

      if (this.textIdx < this.fontLen) {
        $('#song-1')[0].loop = true;
        $('#song-1')[0].play();
      } else {
        $('#song-1')[0].pause();
        $('#song-2')[0].pause();
      }

      var st = setInterval(function () {
        if (_this.textIdx < _this.fontLen) {
          _this.font = _this.font + _this.fontArray[_this.textIdx]; // console.log(this.font+'_')
          // 更新位置

          _this.item.eq(_this.index).html(_this.font + '_'); // 下個文字準備


          _this.textIdx++;
        } else {
          // console.log(this.font)
          // 更新位置
          _this.item.eq(_this.index).html(_this.font); // 播放音效


          $('#song-1')[0].pause();
          $('#song-2')[0].play(); // 下一段文字準備

          window.clearInterval(st);

          if (_this.index < _this.itemLen) {
            _this.update();
          } else {
            setTimeout(function () {
              $('.opening').fadeOut();
              $('#song-2')[0].play();
              $('#song-3')[0].play();
            }, 1000);
            setTimeout(function () {
              $('.container').addClass('animated');
            }, 1500);
          }
        }
      }, 100);
      console.log(this.fontArray);
    }
  }, {
    key: "fontLen",
    get: function get() {
      return this.fontArray.length;
    }
  }]);

  return AutoType;
}();

function delay_action(item, type, num) {
  var delay_time = 0;

  for (var i = 0; i < $(item).length; i++) {
    $(item).eq(i).css(type, delay_time + 's');
    delay_time += num;
  }
} //指定物件的高度

/**
 * @description 這是一個抓取物件高度
 * @param {123} tt 123
 * @param {string} el 選擇想要知道高度位置與底部位置的物件
 * @returns 
 */


function elTop(el) {
  var elTop = $(el).offset().top;
  var elBottom = elTop + $(el).height();
  var datas = {
    top: elTop,
    bottom: elBottom
  };
  return datas;
} //偵測視窗滾動以及指定項目之位置比較


function watchEl(element, active) {
  var screenHeight = $(window).height();
  var screenTop = $(window).scrollTop();
  var screenBottom = screenTop + screenHeight;
  $(element).each(function () {
    var condition01 = elTop($(this));
    var condition02 = screenBottom - screenHeight / 8;

    if (condition01.top < condition02 && screenTop < condition01.top) {
      $(this).addClass(active);
    }
  });
} //開始啟動動畫


function watchElStart(els) {
  els.forEach(function (el) {
    $(el.dom).each(function () {
      $(this).addClass(el.cls);
    });
    setTimeout(function () {
      watchEl(el.dom, el.active);
    }, 10);
    $(window).on('scroll', function () {
      watchEl(el.dom, el.active);
    });
  });
} // var animationArray = [
//   {dom: '#dom', cls: 'fade',active: 'animated'},
//   {dom: '#dom2', cls: 'fade',active: 'animated'},
//   {dom: '#dom3', cls: 'fade',active: 'active'},
// ]
// watchElStart(animationArray)


$(function () {
  $('#googleForm #close').click(function () {
    $('#googleForm').fadeOut();
  });
  $('#go-google-form').click(function (e) {
    e.preventDefault();
    $('#googleForm').fadeIn();
  });
  var font = new AutoType('.opening p');
  $('#start').click(function () {
    font.putFont();
    $(this).hide();
  });
});