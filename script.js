let tempBookIndex = null;
let tempBookId = null;
let tempPage = localStorage.getItem('page');
let pageSize = 10;
let filterBook = []

$(document).ready(function () {
  //當local storage不等於沒有的時候
  if (localStorage.getItem('bookData') !== null) {
    bookData = JSON.parse(localStorage.getItem('bookData'))
  }
  result();
  createPage();
  setPageClass(tempPage);

  if (localStorage.getItem('searchWord') !== null && localStorage.getItem('searchWord') !== '') {
    $('#bookSearch').val(localStorage.getItem('searchWord'));
    search();
  }

  $('#bookCategory').change(function () {
    //選取img id加上src屬性(#bookCategory 選取的option的imgsrc屬性)
    $("#bookCategoryImg").attr("src", $("#bookCategory option:selected").attr("imgsrc"))
    
  })

});
//當local storage沒有的時候
if (tempPage === null) {
  tempPage = 1;
}

function openWindow(func) {
  if (func === 'updateBookById') {
    $('#myModal .modal-title').html('修改');
  } else {
    $('#bookCategory').val('社會哲思');
    $('#bookCategory').change();
    $('#bookName').val('');
    $('#bookAuthor').val('');
    $('#date').val('');
    $('#bookPublisher').val('');
    $('#myModal .modal-title').html('新增');
  }

}
function save(func) {
  if ($('#myModal .modal-title').html() === '新增') {
    add();
  } else if ($('#myModal .modal-title').html() === '修改') {
    updateBook();
  }
}
/**取搜尋結果或全部資料 */
function getFilterOrBookdata() {
  //關鍵字沒有符合搜尋結果，而且搜尋匡也沒有輸入字
  if (filterBook.length === 0 && $('#bookSearch').val() === '') {
    return bookData
  } else {
    return filterBook
  }
  //也可以寫做
  //let tempBookData
  //tempBookData = bookData;
  //tempBookData = filterBook;
  // return tempBookData
}

function result() {
  let tempBookData = getFilterOrBookdata();
  //由BookId大到小排列
  tempBookData.sort((a, b) => {
    return a.BookId - b.BookId
  });
  //避免重複加上前頁的結果
  $("[name='trData']").remove()
  // for (let j = document.getElementsByName('trData').length - 1; j >= 0; j--) {
  //   document.getElementsByName('trData')[j].remove()
  // };

  for (i = (tempPage - 1) * pageSize; i < getPageEnd(); i++) {
    $('#result').html(

      $('#result').html() +
      `
    <tr id="${tempBookData[i].BookId}" name="trData" >
      
        <td> <button class="x-button btn btn-danger " data-bs-toggle="modal" data-bs-target="#myModal-delete" bookid="${tempBookData[i].BookId}">X</button></td>
        <td> <button class="btn btn-primary updateBookById-btn" data-bs-toggle="modal" data-bs-target="#myModal" bookid="${tempBookData[i].BookId}">修改</button></td>
        <td>${tempBookData[i].BookId}</td>
        <td>${tempBookData[i].BookCategory}</td>
        <td>${tempBookData[i].BookName}</td>
        <td>${tempBookData[i].BookAuthor}</td>
        <td>${tempBookData[i].BookBoughtDate}</td>
        <td>${tempBookData[i].BookPublisher}</td>

      </tr>
    `
    )

  }
  $('.x-button').click(function () {
    let id = $(this).attr('bookid');
    $('.deleteBook-btn').attr('bookid', id)
  })
  $('.deleteBook-btn').unbind("click")
  $('.deleteBook-btn').click(function () {
    deleteBook(parseInt($(this).attr('bookid')))
  })
  $('.updateBookById-btn').click(function () {
    updateBookById(parseInt($(this).attr('bookid')))
  })
}
/** 一頁不足十筆或正常筆數 */
function getPageEnd() {
  let tempBookData = getFilterOrBookdata()
  if (tempBookData.length < (tempPage * pageSize)) {
    //一頁不足十筆的情況
    return tempBookData.length;

  } else {
    return tempPage * pageSize;
  }
}

function add() {

  //將最後一本書的ID + 1
  let bookId = bookData[bookData.length - 1].BookId + 1;
  let bookCategory = $('#bookCategory').val();
  let bookName = $('#bookName').val();
  let bookAuthor = $('#bookAuthor').val();
  let bookBoughtDate = $('#date').val();
  let bookPublisher = $('#bookPublisher').val();

  //將要新增的書push進去bookData陣列中
  bookData.push({
    "BookId": bookId,
    "BookCategory": bookCategory,
    "BookName": bookName,
    "BookAuthor": bookAuthor,
    "BookBoughtDate": bookBoughtDate,
    "BookPublisher": bookPublisher,
  })
  //重整所有資料
  result();
  //當最後一頁總比數大於等於10就跳新的一頁
  if ((getPageEnd() - (tempPage - 1) * pageSize) >= 10) {
    repage();
    lastPage();
  }
  localStorage.setItem('bookData', JSON.stringify(bookData));
}

function deleteBook(Id) {
  //找出index
  let bookIndex = bookData.findIndex(x => {
    return x.BookId === Id
  })

  //找到的index，刪除一個
  bookData.splice(bookIndex, 1);
  result();

  //最後一頁 = 0 的情況
  if ((getPageEnd() - (tempPage - 1) * pageSize) === 0) {
    prePage();
  }
  repage();
  setPageClass(tempPage);
  localStorage.setItem('bookData', JSON.stringify(bookData))
}

function updateBookById(Id) {
  openWindow('updateBookById');
  let bookIndex = bookData.findIndex(x => {
    return x.BookId === Id
  });

  $('#bookCategory').val(bookData[bookIndex].BookCategory);
  $('#bookName').val(bookData[bookIndex].BookName);
  $('#bookAuthor').val(bookData[bookIndex].BookAuthor);
  $('#date').val(bookData[bookIndex].BookBoughtDate);
  $('#bookPublisher').val(bookData[bookIndex].BookPublisher);
  tempBookIndex = bookIndex;
  tempBookId = Id;

}

function updateBook() {

  bookData[tempBookIndex] = {
    "BookId": bookData[tempBookIndex].BookId,
    "BookCategory": $('#bookCategory').val(),
    "BookName": $('#bookName').val(),
    "BookAuthor": $('#bookAuthor').val(),
    "BookBoughtDate": $('#date').val(),
    "BookPublisher": $('#bookPublisher').val(),
  }
  $('#bookCategory').val('');
  $('#bookName').val('');
  $('#bookAuthor').val('');
  $('#date').val('');
  $('#bookPublisher').val('');

  result();
  localStorage.setItem('bookData', JSON.stringify(bookData));
}

function createPage() {
  let tempBookData = getFilterOrBookdata();
  //無條件進位全長度除以一頁10筆
  for (let i = 1; i <= Math.ceil(tempBookData.length / pageSize); i++) {
    // document.getElementById('page').innerHTML = document.getElementById('page').innerHTML +

    $('#page').html(
      $('#page').html() +
      `
      <span id="_${i}" onclick="turnPage(${i})" name='page' class="page-item"><a class="page-link" >${i}</a></span>
       
     `
    )

  }
}
/**現在瀏覽的頁碼，顯示顏色加的class */
function setPageClass(id) {
  id = '_' + id;
  // let currentPage = document.getElementsByClassName("currentPage")
  // for (let i = 0; i < currentPage.length; i++) {
  //   //刪除所有currentPage頁碼顏色，以免重複上色
  //   currentPage[i].classList.remove('currentPage');
  // }
  $('.currentPage').removeClass("currentPage");
  $('#' + id + ' a').addClass('currentPage');
  // let element = document.getElementById(id);
  // //加上class
  // element.classList.add("currentPage");
}

function turnPage(page) {
  tempPage = page;
  setPageClass(page);
  result();
  localStorage.setItem('page', page);
}
function prePage() {
  //以免小於總頁碼
  if (tempPage > 1) {
    tempPage = tempPage - 1;
    turnPage(tempPage);
  };
}
function nextPage() {
  let tempBookData = getFilterOrBookdata();
  //以免超出總頁碼
  if (tempPage < Math.ceil(tempBookData.length / pageSize)) {
    tempPage = tempPage + 1;
    turnPage(tempPage);
  }
}
function firstPage() {
  tempPage = 1;
  turnPage(tempPage);
}
function lastPage() {
  let tempBookData = getFilterOrBookdata();
  tempPage = Math.ceil(tempBookData.length / pageSize)
  turnPage(tempPage);
}
/**搜尋結果 */
function search() {
  //filter 需要的參數是一個條件函式，只有通過這個條件函式檢查的項目，才會被filter保留並回傳一個新的陣列
  //includes 查詢某一字串中是否包含特定字串

  //搜尋結果後的陣列
  filterBook = bookData.filter(x =>
    x.BookCategory.includes($('#bookSearch').val())
    || x.BookName.includes($('#bookSearch').val())
  );

  //搜尋結果跳回第一頁
  tempPage = 1;
  repage();
  result();
  localStorage.setItem('searchWord', $('#bookSearch').val());

}
/**重整頁碼 */
function repage() {
  $("[name='page']").remove();
  // for (let j = document.getElementsByName('page').length - 1; j >= 0; j--) {
  //   document.getElementsByName('page')[j].remove()
  // };
  createPage();
}


/**datepicker */
$(function () {
  $('#datepicker').datepicker();
});




