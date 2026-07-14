"use strict";
// 分享功能：把目前的家庭/成員與消費清單編碼進網址，讓朋友打開連結就能看到同樣的內容

function encodeShareState(state) {
  var json = JSON.stringify(state);
  var bytes = new TextEncoder().encode(json);
  var binary = "";
  bytes.forEach(function (b) {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeShareState(str) {
  var b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) {
    b64 += "=";
  }
  var binary = atob(b64);
  var bytes = new Uint8Array(binary.length);
  for (var i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  var json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}

function copyShareLink(link) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(link).then(function () {
      showSuccess({ text: "連結已複製" });
    }).catch(function () {
      fallbackCopyShareLink(link);
    });
  } else {
    fallbackCopyShareLink(link);
  }
}

function fallbackCopyShareLink(link) {
  var temp = document.createElement("textarea");
  temp.value = link;
  temp.style.position = "fixed";
  temp.style.opacity = "0";
  document.body.appendChild(temp);
  temp.focus();
  temp.select();
  try {
    document.execCommand("copy");
    showSuccess({ text: "連結已複製" });
  } catch (e) {
    showError({ text: "複製失敗，請手動複製連結" });
  }
  document.body.removeChild(temp);
}

function buildShareLink() {
  var state = {
    members: window.action.members.map(function (m) {
      return { idx: m.idx, title: m.title, qty: m.qty };
    }),
    purchase: window.action.purchase.map(function (p) {
      return { idx: p.idx, title: p.title, price: p.price, member: p.member, sharing: p.sharing };
    })
  };
  var url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("data", encodeShareState(state));
  return { url: url.toString(), state: state };
}

$(function () {
  $("#share").on("click", function () {
    var built = buildShareLink();
    if (built.state.members.length === 0 && built.state.purchase.length === 0) {
      return showError({ text: "尚未新增任何家庭/成員或消費紀錄，無法分享" });
    }
    var link = built.url;
    if (navigator.share) {
      navigator.share({ title: "分帳小工具", text: "一起來分帳吧！", url: link }).catch(function () {});
      return;
    }
    Swal.fire({
      title: "分享連結",
      text: "複製連結傳給朋友，他們打開就能看到目前的家庭/成員與消費清單",
      input: "text",
      inputValue: link,
      inputAttributes: { readonly: true },
      showCancelButton: true,
      confirmButtonText: "複製連結",
      cancelButtonText: "關閉",
      didOpen: function () {
        Swal.getInput().select();
      }
    }).then(function (result) {
      if (result.isConfirmed) {
        copyShareLink(link);
      }
    });
  });

  // 打開分享連結時，詢問是否匯入內容
  var data = new URLSearchParams(window.location.search).get("data");
  if (data && window.action) {
    try {
      var state = decodeShareState(data);
      showConfirm({
        title: "匯入分享內容",
        text: "偵測到分享連結，是否要匯入其中的家庭/成員與消費清單？（將覆蓋目前內容）",
        then: function () {
          window.action.members = state.members || [];
          window.action.purchase = state.purchase || [];
          window.action.resetHtml();
          window.action.init();
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    } catch (e) {
      showError({ text: "分享連結格式錯誤，無法匯入" });
    }
  }
});
