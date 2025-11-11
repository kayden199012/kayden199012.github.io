//=require ./class/kos.js
//=require ./functions/functions.js
//=require ./functions/alert.js

class AccountSharing {
  constructor(array) {
    let defs = {
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
        sharing: ["家庭人數","家庭"]
      },
      html: {
        member: `<div class="group card py-2 px-3 bg-light d-flex flex-row justify-content-between align-items-center gap-3 animate__animated animate__fadeIn"><p class="m-0">{{title}}<span class="d-block fs-small text-secondary">分帳人數：{{qty}} 人</span></p><button type="button" class="delete btn btn-sm btn-danger" data-idx="{{idx}}"><i class="bi bi-trash-fill"></i></button></div>`,
        purchase: `<div class="group card py-2 px-3 bg-light d-flex flex-row justify-content-between align-items-center gap-3 animate__animated animate__fadeIn"><p class="m-0">{{title}}<span class="d-block fs-small text-secondary">付費家庭/成員：{{member}}｜費用：{{price}}｜分帳方式：{{sharing}}</span></p><button type="button" class="delete btn btn-sm btn-danger" data-idx="{{idx}}"><i class="bi bi-trash-fill"></i></button></div>`,
        history: `<div class="group alert alert-warning py-2 px-3 m-0 row g-3 align-items-center animate__animated animate__fadeIn"><p class="m-0 col-4">{{from}}</p><p class="m-0 text-center col-4">{{price}}<br><i class="bi bi-arrow-right"></i></p><p class="m-0 col-4 text-end">{{to}}</p></div>`
      }
    }
    Object.assign(defs, array)
    Object.assign(this, defs)
    this.init()
    this.memberController()
    this.purchaseController()
  }

  init() {
    if (this.members.length > 0) {
      $("#member-list .empty").hide()
      let html = this.html.member
      this.members.forEach(e=>{
        let complete_html = html.replace(/{{title}}/g,e.title)
                                .replace(/{{qty}}/g,e.qty)
                                .replace(/{{idx}}/g,e.idx)
        $('#member-list').append(complete_html)
      })
    }
    
    if (this.purchase.length > 0) {
      $("#purchase-list .empty").hide()
      let html = this.html.purchase
      this.purchase.forEach(e=>{
        let member_name = this.getMemberName(e.member)
        let complete_html = html.replace(/{{title}}/g,e.title)
                                .replace(/{{price}}/g,e.price)
                                .replace(/{{member}}/g,member_name)
                                .replace(/{{sharing}}/g,this.options.sharing[e.sharing])
                                .replace(/{{idx}}/g,e.idx)
        $('#purchase-list').append(complete_html)
      })
    }
    
    this.updatePurchaseMemberOptions()
    this.updateMemberCost()
    this.updateTotal()
  }

  memberController() {
    let $this = this
    // 新增
    $('#add-member').on("click",function(){
      let val = {
        member_title: $("#member-title").val().trim(),
        member_qty: $("#member-qty").val().trim()
      }
      $('#add-member-form .form-control').removeClass('is-invalid')
      if (val.member_title == "" || val.member_qty == "") {
        return showError({
          text: "請填寫家庭成員、分擔人數",
          willClose: ()=>{
            if (val.member_title == "") {
              $('#member-title').addClass('is-invalid')
            }
            if (val.member_qty == "") {
              $('#member-qty').addClass('is-invalid')
            }
          }
        })
      }

      let idx = $this.members.length
      let html = $this.html.member.replace(/{{title}}/g,val.member_title)
                                  .replace(/{{qty}}/g,val.member_qty)
                                  .replace(/{{idx}}/g,idx)
      $('#member-list .empty').hide()
      $('#member-list').append(html)
      $this.members.push({
        idx: idx,
        title: val.member_title,
        qty: val.member_qty,
        cost: 0
      })
      $('#member-title, #member-qty').val('')
      // 更新選單
      $this.updatePurchaseMemberOptions()
      $this.updateMemberCost()
    })
    // 刪除
    $(document).on("click","#member-list .group .delete",function(){
      showConfirm({
        title: "是否要刪除此成員？",
        text: "刪除後會將此家庭/成員的消費項目一並刪除",
        then: ()=>{
          let idx = $(this).data('idx')
          $this.members.forEach((e,index)=>{
            if (e.idx == idx) {
              $(this).closest('.group').remove()
              $this.members.splice(index,1)
            }
          })
          if ($this.members.length == 0) {
            $('#member-list .empty').show()
          }
          // 更新選單
          $this.updatePurchaseMemberOptions()
          // 清除某會員消費內容
          $this.cleanPurchase(idx)
          // 計算消費
          $this.updateMemberCost()
        }
      })
    })
  }

  purchaseController() {
    let $this = this
    // 新增
    $('#add-purchase').on("click",function(){
      let val = {
        purchase_title: $("#purchase-title").val().trim(),
        purchase_price: $("#purchase-price").val().trim(),
        purchase_member: $("#purchase-member").val().trim(),
        purchase_sharing: $("#purchase-sharing").val().trim()
      }
      $('#add-purchase-form .form-control, #add-purchase-form .form-select').removeClass('is-invalid')
      if (val.purchase_title == "" || val.purchase_price == "" || val.purchase_member == "" || val.purchase_sharing == "" ) {
        return showError({
          text: "請正確填寫內容",
          willClose: ()=>{
            if (val.purchase_title == "") {
              $('#purchase-title').addClass('is-invalid')
            }
            if (val.purchase_price == "") {
              $('#purchase-price').addClass('is-invalid')
            }
            if (val.purchase_member == "") {
              $('#purchase-member').addClass('is-invalid')
            }
            if (val.purchase_sharing == "") {
              $('#purchase-sharing').addClass('is-invalid')
            }
          }
        })
      }

      let idx = $this.purchase.length
      let member_name = $this.getMemberName(val.purchase_member)
      let html = $this.html.purchase.replace(/{{title}}/g,val.purchase_title)
                                    .replace(/{{price}}/g,val.purchase_price)
                                    .replace(/{{member}}/g,member_name)
                                    .replace(/{{sharing}}/g,$this.options.sharing[val.purchase_sharing])
                                    .replace(/{{idx}}/g,idx)
      $('#purchase-list .empty').hide()
      $('#purchase-list').append(html)
      $this.purchase.push({
        idx: idx,
        title: val.purchase_title,
        price: val.purchase_price,
        member: val.purchase_member,
        sharing: val.purchase_sharing
      })
      $('#purchase-title, #purchase-price, #purchase-member, #purchase-sharing').val('')
      $this.updateMemberCost()
      $this.updateTotal()
    })
    // 刪除
    $(document).on("click","#purchase-list .group .delete",function(){
      showConfirm({
        title: "是否要刪除此消費記錄？",
        then: ()=>{
          let idx = $(this).data('idx')
          $this.purchase.forEach((e,index)=>{
            if (e.idx == idx) {
              $(this).closest('.group').remove()
              $this.purchase.splice(index,1)
            }
          })
          if ($this.purchase.length == 0) {
            $('#purchase-list .empty').show()
          }
          // 更新選單
          $this.updatePurchaseMemberOptions()
          $this.updateMemberCost()
          $this.updateTotal()
        }
      })
    })
  }

  updatePurchaseMemberOptions() {
    // 清空
    $("#purchase-member option").each(function(idx, e){
      if (idx != 0) {
        $(this).remove()
      }
    })
    this.members.forEach(e=>{
      let option = `<option value="${e.idx}">${e.title}</option>`
      $("#purchase-member").append(option)
    })
  }

  getMemberName(idx) {
    let title = ""
    this.members.forEach(e=>{
      if (e.idx == idx) {
        title = e.title
      }
    })
    return title
  }

  cleanPurchase(idx) {
    this.purchase.forEach((e,index)=>{
      if (idx == e.member) {
        this.purchase.splice(index, 1)
        $('#purchase-list .group').eq(index).remove()
      }
    })
    if (this.purchase.length == 0) {
      $('#purchase-list .empty').show()
    }
    this.updateTotal()
  }

  updateMemberCost() {
    let member_qty_total = 0

    if (this.members.length > 0) {
      let member = ""
      this.members.forEach((e, idx)=>{
        member+=`<h6 class="mb-2">${e.title}：<span id="cost-${e.idx}">0</span></h6>`
        this.members[idx].cost = 0
        this.members[idx].pay = 0
        member_qty_total += parseInt(e.qty)
      })
      $('.member-cost').html(member)
    }

    if (this.purchase.length > 0) {
      let total_0 = 0 // 家庭人數總額
      let total_1 = 0 // 家庭總額
      this.purchase.forEach(e=>{
        switch(e.sharing) {
          case 0:
          case "0":
            total_0+=parseInt(e.price)
            break;
          case 1:
          case "1":
            total_1+=parseInt(e.price)
            break;
        }
        this.members.forEach((m_e, idx)=>{
          if (m_e.idx == e.member) {
            this.members[idx].cost += parseInt(e.price)
          }
        })
      })

      this.members.forEach((e, idx)=>{
        $(`#cost-${e.idx}`).text(e.cost)
        this.members[idx].pay += Math.round(total_0/member_qty_total)*e.qty + Math.round(total_1/this.members.length) - e.cost
      })
      
      let n = 0
      let pay_history = []
      // while (n < this.members.length) {
      for(let n in this.members){
        if (this.members[n].pay < 0) {
          for(let i in this.members){
            if (this.members[i].idx != this.members[n].idx && this.members[i].pay > 0 && this.members[n].pay < 0) {
              
              let amount = this.members[n].pay + this.members[i].pay
              if (amount > 0) {
                // 結清
                pay_history.push({
                  from: this.members[i].title,
                  to: this.members[n].title,
                  price: Math.abs(this.members[n].pay)
                })
                this.members[n].pay = 0
                this.members[i].pay = amount
              } else {
                // 未結清
                pay_history.push({
                  from: this.members[i].title,
                  to: this.members[n].title,
                  price: Math.abs(this.members[i].pay)
                })
                this.members[n].pay = amount
                this.members[i].pay = 0
              }
            }
          }
        }
      }
      if (pay_history.length > 0) {
        let history_html = ""
        pay_history.forEach(e=>{
          history_html += this.html.history.replace(/{{from}}/g,e.from)
                                           .replace(/{{to}}/g,e.to)
                                           .replace(/{{price}}/g,e.price)
        })
        $("#sharing-result .group").remove()
        $("#sharing-result .empty").hide().before(history_html)
      } else {
        $("#sharing-result .empty").show().siblings('.group').remove()
      }
    }

    // 儲存備份
    sessionStorage.setItem("memory", JSON.stringify(this));
  }

  updateTotal() {
    let total = 0
    this.purchase.forEach(e=>{
      total += parseInt(e.price)
    })
    $('#total').text(total)
  }
}

$(function(){
  let memory = sessionStorage.getItem("memory");
  window.action = new AccountSharing(JSON.parse(memory));
})