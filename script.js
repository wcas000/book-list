let tempBookIndex = null;
let tempBookId = null;
let tempPage = localStorage.getItem('page');
let pageSize = 10;
let filterBook = []
//當local storage沒有的時候
if (tempPage === null){
  tempPage = 1
}
function domReady() {
  //當local storage不等於沒有的時候
  if (localStorage.getItem('bookData') !== null){
    bookData = JSON.parse(localStorage.getItem('bookData'))
  }
  result();
  createPage();
  setPageClass(tempPage);
  
  if (localStorage.getItem('searchWord') !== null && localStorage.getItem('searchWord') !== '' ){
    document.getElementById('bookSearch').value = localStorage.getItem('searchWord');
    search();
  }
}
      /**取搜尋結果或全部資料 */
function getFilterOrBookdata(){
  //關鍵字沒有符合搜尋結果，而且搜尋匡也沒有輸入字
  if (filterBook.length === 0 && document.getElementById('bookSearch').value === ''){
    return bookData 
  }else{
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
  for (let j = document.getElementsByName('trData').length - 1; j >= 0; j--) {
    document.getElementsByName('trData')[j].remove()
  };
  
  for (i = (tempPage - 1) * pageSize; i < getPageEnd(); i++) {
    document.getElementById('result').innerHTML = document.getElementById('result').innerHTML +
      `
    <tr id="${tempBookData[i].BookId}" name="trData" >
        <td> <button onclick="deleteBook(${tempBookData[i].BookId})">X</button></td>
        <td> <button onclick="updateBookById(${tempBookData[i].BookId})">修改</button></td>
        <td>${tempBookData[i].BookId}</td>
        <td>${tempBookData[i].BookCategory}</td>
        <td>${tempBookData[i].BookName}</td>
        <td>${tempBookData[i].BookAuthor}</td>
        <td>${tempBookData[i].BookBoughtDate}</td>
        <td>${tempBookData[i].BookPublisher}</td>

      </tr>
    `
  }
  
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
  let bookCategory = document.getElementById('bookCategory').value;
  let bookName = document.getElementById('bookName').value;
  let bookAuthor = document.getElementById('bookAuthor').value;
  let bookBoughtDate = document.getElementById('bookBoughtDate').value;
  let bookPublisher = document.getElementById('bookPublisher').value;

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
  if ((getPageEnd() - (tempPage - 1) * pageSize) >= 10){
      repage();
      nextPage();
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
  if ((getPageEnd() - (tempPage - 1) * pageSize) === 0){
    prePage();
   }
  repage();
  setPageClass(tempPage);
  localStorage.setItem('bookData', JSON.stringify(bookData))
}

function updateBookById(bookId) {
  let bookIndex = bookData.findIndex(x => {
    return x.BookId === bookId
  });

  document.getElementById('bookCategory').value = bookData[bookIndex].BookCategory;
  document.getElementById('bookName').value = bookData[bookIndex].BookName;
  document.getElementById('bookAuthor').value = bookData[bookIndex].BookAuthor;
  document.getElementById('bookBoughtDate').value = bookData[bookIndex].BookBoughtDate;
  document.getElementById('bookPublisher').value = bookData[bookIndex].BookPublisher;
  tempBookIndex = bookIndex;
  tempBookId = bookId;

}

function updateBook() {

  bookData[tempBookIndex] = {
    "BookId": bookData[tempBookIndex].BookId,
    "BookCategory": document.getElementById('bookCategory').value,
    "BookName": document.getElementById('bookName').value,
    "BookAuthor": document.getElementById('bookAuthor').value,
    "BookBoughtDate": document.getElementById('bookBoughtDate').value,
    "BookPublisher": document.getElementById('bookPublisher').value,
  }
  document.getElementById('bookCategory').value = '';
  document.getElementById('bookName').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('bookBoughtDate').value = '';
  document.getElementById('bookPublisher').value = '';

  result();
  localStorage.setItem('bookData', JSON.stringify(bookData));
}

function createPage() {
  let tempBookData = getFilterOrBookdata();
                    //無條件進位全長度除以一頁10筆
  for (let i = 1; i <= Math.ceil(tempBookData.length / pageSize); i++) {
    document.getElementById('page').innerHTML = document.getElementById('page').innerHTML +
      `
    <span name='page' id="_${i}" onclick="turnPage(${i})">${i}</span>
    `
  }
}
/**現在瀏覽的頁碼，顯示顏色加的class */
function setPageClass(id) {
  id = '_' + id;
  let currentPage = document.getElementsByClassName("currentPage")
  for (let i = 0; i < currentPage.length; i++) {
    //刪除所有currentPage頁碼顏色，以免重複上色
    currentPage[i].classList.remove('currentPage');
  }
  let element = document.getElementById(id);
  //加上class
  element.classList.add("currentPage");
}

function turnPage(page) {
  tempPage = page;
  setPageClass(page);
  result();
  localStorage.setItem('page',page);
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
    x.BookCategory.includes(document.getElementById('bookSearch').value)
    || x.BookName.includes(document.getElementById('bookSearch').value)
  );
  
  //搜尋結果跳回第一頁
  tempPage = 1;
  repage();
  result();
  localStorage.setItem('searchWord', document.getElementById('bookSearch').value);
  
}
/**重整頁碼 */
function repage() {
  for (let j = document.getElementsByName('page').length - 1; j >= 0; j--) {
    document.getElementsByName('page')[j].remove()
  };
  createPage();
}