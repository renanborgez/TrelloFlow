var COLUMNS_SELECTOR = '.js-list.list-wrapper';
var COLUMNS_TITLE_SELECTOR = '.list-header-name';
var COLUMNS_LIST_SELECTOR = '.list';
var DATABASE_NAME = 'TF_database';
var BUTTON_ATTRIBUTE_NAME = 'data-list-name';
var BUTTON_PREFIX_ID = 'TF_Column_';
var BUTTON_CLASS_NAME = 'list-hide-button';
var BUTTON_SHOW_ALL_LISTS_CLASS = 'board-header-btn mod-left';
var BUTTON_SHOW_ALL_LISTS_ID = 'show-all-button';
var BOARD_HEADER_SELECTOR = '.board-header';

var HIDE_TEXT = 'Hide this list';
var SHOW_TEXT = 'Showw all lists again';

var DATA_INITIALIZE_OBJECT = {
  columns: []
};

var trelloFlowInstance = new TrelloFlow();
function TrelloFlow(){
  this.columns = document.querySelectorAll(COLUMNS_SELECTOR);
  
  var data = JSON.parse(localStorage.getItem(DATABASE_NAME));
  if(!data.columns){
    localStorage.setItem(DATABASE_NAME, JSON.stringify(DATA_INITIALIZE_OBJECT));
  }
}

TrelloFlow.prototype.getData = function(){
  return JSON.parse(localStorage.getItem(DATABASE_NAME));
}
TrelloFlow.prototype.setData = function(name){
  var obj = this.getData() || DATA_INITIALIZE_OBJECT;
  if(!(name in obj.columns)){
    obj.columns.push(name);
  }
  localStorage.setItem(DATABASE_NAME, JSON.stringify(obj));
}
TrelloFlow.prototype.resetData = function(){
  localStorage.setItem(DATABASE_NAME, JSON.stringify(DATA_INITIALIZE_OBJECT));
}
TrelloFlow.prototype.bindEventListeners = function(){
  var hideButtons = document.getElementsByClassName(BUTTON_CLASS_NAME);
  var showButton = document.getElementById(BUTTON_SHOW_ALL_LISTS_ID);
  for (var i = 0; i < hideButtons.length; i++) {
    var element = hideButtons[i];
    element.addEventListener('click',function(){
      var title = this.getAttribute(BUTTON_ATTRIBUTE_NAME);
      trelloFlowInstance.setData(title);
      trelloFlowInstance.renderColumns();
    }, false);
  }

  showButton.addEventListener('click', function(){
    trelloFlowInstance.resetData();
    trelloFlowInstance.renderColumns();
  })
}

TrelloFlow.prototype.renderColumns = function(){
  var data = this.getData();
  for (var i = 0; i < this.columns.length; i++) {
    var column = this.columns[i];
    var columnTitle = column.querySelectorAll(COLUMNS_TITLE_SELECTOR)[0].value;
    if(data.columns.indexOf(columnTitle) >= 0){
      column.style.display = 'none';
    }
    else {
      column.style.display = 'inline-block';
    }
  }
}

TrelloFlow.prototype.renderButtons = function (){
  var listHideButton = document.createElement('div');
  listHideButton.textContent = HIDE_TEXT;
  listHideButton.className = BUTTON_CLASS_NAME;

  var listShowAllButton = document.createElement('div');
  listShowAllButton.className = BUTTON_SHOW_ALL_LISTS_CLASS;
  listShowAllButton.id = BUTTON_SHOW_ALL_LISTS_ID;
  
  var showAllIcon = '<span class="board-header-btn-icon icon-sm icon-list"></span>';
  var showAllText = '<span class="board-header-btn-text">' + SHOW_TEXT + '</span>';
  var showAllInnerHtml = showAllIcon + showAllText;

  listShowAllButton.innerHTML = showAllInnerHtml;

  document.querySelector(BOARD_HEADER_SELECTOR).appendChild(listShowAllButton);
  
  for (var i = 0; i < this.columns.length; i++) {
    var column = this.columns[i];
    var columnTitle = column.querySelectorAll(COLUMNS_TITLE_SELECTOR)[0].value;
    var parent = column.parentNode;
    var button = listHideButton.cloneNode(true);

    button.setAttribute(BUTTON_ATTRIBUTE_NAME, columnTitle);
    
    column.insertBefore(button, column.querySelector(COLUMNS_LIST_SELECTOR));
  }

  setTimeout(this.bindEventListeners,100);
}

chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      trelloFlowInstance.renderColumns();
      trelloFlowInstance.renderButtons();
    }
  }, 10);
});