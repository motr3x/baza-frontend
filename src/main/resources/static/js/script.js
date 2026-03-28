var button = document.getElementById('button');
var button_two = document.getElementById('button-two');
var button_three = document.getElementById('button-three');

var modal = document.getElementById('modal');
var modal_two = document.getElementById('modal-two');
var modal_three = document.getElementById('modal-three');

var modal_exit = document.getElementById('modal-exit');
var modal_exit_two = document.getElementById('modal-exit-two');
var modal_exit_three = document.getElementById('modal-exit-three');

// Используем полный URL для API
const API_URL = 'http://localhost:8181/api/gallery';

// Функция для исправления URL изображений
function fixImageUrl(url) {
    console.log('Исходный URL:', url);
    
    // Убираем '/images/' из пути
    if (url && url.includes('/uploads/images/')) {
        const fixed = url.replace('/uploads/images/', '/uploads/');
        console.log('Исправленный URL:', fixed);
        return fixed;
    }
    
    // Если URL начинается с /uploads/, оставляем как есть
    if (url && url.startsWith('/uploads/')) {
        return url;
    }
    
    // Если это просто имя файла
    if (url && !url.startsWith('http') && !url.startsWith('/')) {
        return '/uploads/' + url;
    }
    
    return url;
}

// Функция для загрузки изображений с API
async function loadGalleryImages() {
    console.log('Загружаем изображения с:', API_URL);
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const images = await response.json();
        console.log('Получены данные:', images);
        
        if (images && Array.isArray(images) && images.length > 0) {
            // Исправляем URL изображений
            const fixedImages = images.map(img => ({
                ...img,
                url: fixImageUrl(img.url)
            }));
            
            console.log('Исправленные URL:', fixedImages.map(img => img.url));
            
            insertImagesIntoModal(modal, fixedImages);
            insertImagesIntoModal(modal_two, fixedImages);
            insertImagesIntoModal(modal_three, fixedImages);
        } else {
            console.warn('Нет данных от сервера');
            showNoImagesMessage(modal);
            showNoImagesMessage(modal_two);
            showNoImagesMessage(modal_three);
        }
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showErrorMessage(modal);
        showErrorMessage(modal_two);
        showErrorMessage(modal_three);
    }
}

// Функция для вставки изображений
function insertImagesIntoModal(modalElement, images) {
    const modalWrap = modalElement.querySelector('.modal-wrap');
    if (!modalWrap) return;
    
    modalWrap.innerHTML = '';
    
    images.forEach((image, index) => {
        const img = document.createElement('img');
        
        // Используем исправленный URL
        const imageUrl = image.url;
        
        console.log(`Загружаем изображение ${index + 1}:`, imageUrl);
        
        img.src = imageUrl;
        img.alt = image.caption || image.filename || `Image ${index + 1}`;
        img.style.maxWidth = '300px';
        img.style.margin = '10px';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        
        // Добавляем обработчик успешной загрузки
        img.onload = function() {
            console.log(`✅ Изображение успешно загружено: ${imageUrl}`);
        };
        
        img.onerror = function() {
            console.error(`❌ Не удалось загрузить изображение: ${imageUrl}`);
            this.style.display = 'none';
            
            // Показываем информацию об изображении
            const info = document.createElement('div');
            info.style.width = '300px';
            info.style.height = '200px';
            info.style.backgroundColor = '#f5f5f5';
            info.style.display = 'flex';
            info.style.flexDirection = 'column';
            info.style.alignItems = 'center';
            info.style.justifyContent = 'center';
            info.style.margin = '10px';
            info.style.borderRadius = '8px';
            info.style.border = '1px solid #ddd';
            info.style.fontFamily = 'Arial, sans-serif';
            
            const icon = document.createElement('div');
            icon.innerHTML = '📷';
            icon.style.fontSize = '48px';
            
            const text = document.createElement('div');
            text.textContent = `${image.caption || image.filename || `Image ${index + 1}`}\n(не удалось загрузить)`;
            text.style.marginTop = '10px';
            text.style.color = '#666';
            text.style.textAlign = 'center';
            text.style.padding = '0 10px';
            
            const urlText = document.createElement('div');
            urlText.textContent = `URL: ${imageUrl}`;
            urlText.style.fontSize = '10px';
            urlText.style.color = '#999';
            urlText.style.marginTop = '5px';
            urlText.style.wordBreak = 'break-all';
            
            info.appendChild(icon);
            info.appendChild(text);
            info.appendChild(urlText);
            
            this.parentNode.insertBefore(info, this);
        };
        
        modalWrap.appendChild(img);
    });
}

function showNoImagesMessage(modalElement) {
    const modalWrap = modalElement.querySelector('.modal-wrap');
    if (modalWrap) {
        modalWrap.innerHTML = '<p style="text-align:center;padding:40px;color:#666;">Нет изображений в галерее</p>';
    }
}

function showErrorMessage(modalElement) {
    const modalWrap = modalElement.querySelector('.modal-wrap');
    if (modalWrap) {
        modalWrap.innerHTML = '<p style="text-align:center;padding:40px;color:#f00;">Ошибка загрузки изображений<br>Проверьте подключение к серверу</p>';
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

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == modal_two) {
        modal_two.style.display = "none";
    }
    if (event.target == modal_three) {
        modal_three.style.display = "none";
    }
}

// Загружаем изображения при загрузке страницы
document.addEventListener('DOMContentLoaded', loadGalleryImages);