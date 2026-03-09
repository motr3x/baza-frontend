var button = document.getElementById('button');
var button_two = document.getElementById('button-two');
var button_three = document.getElementById('button-three');

var modal = document.getElementById('modal');
var modal_two = document.getElementById('modal-two');
var modal_three = document.getElementById('modal-three');

var modal_exit = document.getElementById('modal-exit');
var modal_exit_two = document.getElementById('modal-exit-two');
var modal_exit_three = document.getElementById('modal-exit-three');

// Функция для загрузки и вставки изображений
function loadGalleryImages() {
    // Пробуем разные прокси
    const proxies = [
        'https://api.allorigins.win/raw?url=',
        'https://cors-anywhere.herokuapp.com/',
        'https://thingproxy.freeboard.io/fetch/'
    ];
    
    const targetUrl = 'https://es6vs7-95-27-96-80.ru.tuna.am/api/gallery';
    
    // Пробуем первый прокси
    tryProxy(0);
    
    function tryProxy(index) {
        if (index >= proxies.length) {
            console.log('Все прокси не сработали, используем локальные изображения');
            insertLocalImages(modal);
            insertLocalImages(modal_two);
            insertLocalImages(modal_three);
            return;
        }
        
        const proxyUrl = proxies[index];
        console.log('Пробуем прокси:', proxyUrl);
        
        fetch(proxyUrl + encodeURIComponent(targetUrl))
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log('Данные галереи:', data);
                
                if (data && Array.isArray(data)) {
                    insertImagesIntoModal(modal, data);
                    insertImagesIntoModal(modal_two, data);
                    insertImagesIntoModal(modal_three, data);
                } else {
                    console.error('Некорректные данные:', data);
                    tryProxy(index + 1);
                }
            })
            .catch(error => {
                console.error(`Ошибка с прокси ${proxyUrl}:`, error);
                tryProxy(index + 1);
            });
    }
}

// Функция для вставки локальных изображений
function insertLocalImages(modalElement) {
    const modalWrap = modalElement.querySelector('.modal-wrap');
    if (modalWrap) {
        modalWrap.innerHTML = '';
        
        // Используем существующие локальные изображения
        const localImages = [
            'img/photo_2022-07-19_12-30-32 1.png',
            'img/photo_2021-04-16_20-44-12 1.png',
            'img/photo_2021-10-12_19-02-23 1.png'
        ];
        
        localImages.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Local image';
            img.onerror = function() {
                // Если локальное изображение не загрузилось, создаем цветной div
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.style.width = '100%';
                placeholder.style.height = '200px';
                placeholder.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                placeholder.style.display = 'flex';
                placeholder.style.alignItems = 'center';
                placeholder.style.justifyContent = 'center';
                placeholder.style.color = 'white';
                placeholder.textContent = 'Image';
                this.parentNode.insertBefore(placeholder, this);
            };
            modalWrap.appendChild(img);
        });
    }
}

// Функция для вставки изображений в модальное окно
function insertImagesIntoModal(modalElement, imagesData) {
    const modalWrap = modalElement.querySelector('.modal-wrap');
    
    if (modalWrap && imagesData && imagesData.length > 0) {
        modalWrap.innerHTML = '';
        
        imagesData.forEach((image, index) => {
            const img = document.createElement('img');
            
            // Формируем URL изображения
            let imageUrl = image.url;
            if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = 'https://es6vs7-95-27-96-80.ru.tuna.am/' + imageUrl;
            }
            
            img.src = imageUrl;
            img.alt = image.caption || 'Gallery image';
            
            // Обработка ошибки загрузки
            img.onerror = function() {
                console.log('Не удалось загрузить изображение:', imageUrl);
                this.src = 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
                        <rect width="300" height="200" fill="#cccccc"/>
                        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666666" font-family="Arial" font-size="16">
                            Image ${index + 1}
                        </text>
                    </svg>
                `);
            };
            
            modalWrap.appendChild(img);
        });
    } else {
        insertLocalImages(modalElement);
    }
}

// Обработчики для кнопок
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

// Загружаем изображения
document.addEventListener('DOMContentLoaded', loadGalleryImages);