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
class KOS {
  constructor(array) {
    let defs = {
      s: [],
      wt: $(window).scrollTop(),
      wb: $(window).scrollTop() + $(window).height(),
      wh: $(window).height()
    }
    Object.assign(defs, array)
    Object.assign(this, defs)

    // default 效果
    if (this.s.length != 0) {
      this.s.forEach(function (e) {
        let $el = $(e.item)
        $el.each(function () {
          $(this).css({transitionDuration:"0s"})
          $(this).attr('data-kos-position',e.position)
          $(this).attr('data-kos-loop',e.loop)
          $(this).addClass('kos--'+e.kos)
          setTimeout(()=>{
            $(this).css({transitionDuration:""})
          },100)
        })
      })
    }

    //啟用偵測
    setTimeout(()=>{
      this.update()
    },200)
    //滾動特效
    let $this = this
    $(window).scroll(function(){
      $this.update()
    })
  }

  update() {
    this.wh = $(window).height()
    this.wt = $(window).scrollTop()
    this.wb = this.wt + this.wh
    let $this = this
    $('[class*="kos--"]').each(function (e) {
      let $el = $(this)
      $el.each(function () {
        let et = $(this).offset().top
        let eb = et + $(this).height()
        let pos = $(this).data('kos-position')
        let loop = $(this).data('kos-loop')
        switch(pos){
          case 'top':
            pos = 18
            break
          case 'bottom':
            pos = 1
            break
          case 'center':
            pos = 10
            break
          default:
            pos = (typeof(pos)!='string')?pos:2
            break
        }
        if ($this.wb - $this.wh/20*pos > et && $this.wt + $this.wh/20*pos < eb) {
          $(this).addClass('kos--animated')
        }else{
          if(loop){
            $(this).removeClass('kos--animated')  
          }
        }
      })
    })
  }
}

// 範例
// var kos = new KOS({
//   s: [
//     { item: ".box2", kos: "fadeLeft", position: 'top', loop: true },
//     { item: ".box1", kos: "fadeLeft", position: 2, loop: true }
//   ]
// });


