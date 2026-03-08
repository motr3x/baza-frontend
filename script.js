var button = document.getElementById('button');
var button_two = document.getElementById('button-two');
var button_three = document.getElementById('button-three');

// var image = document.getElementById('myModal');

var modal = document.getElementById('modal');
var modal_block = document.getElementById('modal-block');
var modal_exit = document.getElementById('modal-exit');
var modal_exit_two = document.getElementById('modal-exit-two');
var modal_exit_three = document.getElementById('modal-exit-three');


var modal_two = document.getElementById('modal-two');
var modal_three = document.getElementById('modal-three');


 button.onclick = function() {
  modal.style.display = "block";
}

 button_two.onclick = function() {
  modal_two.style.display = "block";
}

 button_three.onclick = function() {
  modal_three.style.display = "block";
}

 modal_exit.onclick = function() {
  modal.style.display = "none";
}

 modal_exit_two.onclick = function() {
  modal_two.style.display = "none";
}

 modal_exit_three.onclick = function() {
  modal_three.style.display = "none";
}


fetch('https://api.allorigins.win/raw?url=https://v9b2ws-109-161-72-40.ru.tuna.am/api/gallery')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  })
  .then(data => console.log('Данные галереи:', data))
  .catch(error => console.error('Ошибка fetch:', error));