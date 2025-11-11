// Class追蹤
$.fn.watchClass = function (callback) {
  return this.each(function () {
    const el = this;
    const $el = $(this);
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {
          callback.call(el, $el.attr("class"));
        }
      });
    });
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    // 儲存 observer 方便之後停止監聽
    $el.data("classObserver", observer);
  });
};

$.fn.unwatchClass = function () {
  return this.each(function () {
    const observer = $(this).data("classObserver");
    if (observer) observer.disconnect();
  });
};

// 進入視窗
$.fn.watchScroll = function (options = {}) {
  const settings = $.extend({
    offset: 0.15,   // 視窗上下邊界留多少比例才觸發
    once: true,     // 預設觸發一次就加上 active
    callback: null  // 額外 callback
  }, options);

  const $elements = this;

  function checkVisible() {
    let w_t = $(window).scrollTop();
    let w_h = $(window).height();
    let w_b = w_t + w_h;

    $elements.each(function () {
      const $el = $(this);
      if (settings.once && $el.hasClass("scroll-active")) return;

      let e_t = $el.offset().top;
      let e_b = e_t + $el.outerHeight();

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
function is(item){
  var data = $(item).is(item);
  return data;
}

// type text
function type_text({
  el   = '.type-text',
  time = 200
} = {}) {

  $(el).each(function(){
    let text = $(this).text().trim().split('')
    // console.log(text);
    let input_text = ''
    text.forEach(e=>{
      if (e == " ") {
        input_text+=`<span class="letter empty"></span>`
      } else {
        input_text+=`<span class="letter">${e}</span>`
      }
    })
    $(this).html(`<span class="type-text-row">${input_text}<span class="line"></span></span>`)
  })
  
  $(".type-text-row").watchScroll({
    offset: 0.1, // 上下各留 20% 區域才觸發
    callback: function () {
      const $row = $(this);
      let $letters = $row.find(".letter");

      setTimeout(()=>{
        $letters.each(function (i) {
          setTimeout(() => {
            $(this).css({
              display: "block",
              visibility: "visible",
              width: "auto"
            });
            if (i + 1 == $letters.length) {
              $row.find('.line').hide()
            }
          }, i * time);
        });
      },300)

    }
  });
}

// count text
function count_text({
  el       = '.count-text',
  stepTime = 10,
  duration = 2000
} = {}) {

  $(el).each(function(){
    let count = parseInt($(this).text())
    $(this).html(`<span class="count-text-row" data-count="${count}">0+</span>`)
  })

  $(".count-text-row").watchScroll({
    offset: 0.2, // 上下各留 20% 區域才觸發
    callback: function () {
      const $row = $(this);
      let target    = $row.data('count')
      let current   = 0
      let steps     = duration / stepTime
      let increment = Math.ceil(target / steps)
      let timer     = setInterval(()=>{
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        $row.text(`${current}+`)
      },stepTime)

    }
  });
  
}