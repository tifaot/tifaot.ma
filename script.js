        // دالة لإنشاء معرض
        function initGallery(galleryId) {
            const gallery = document.getElementById(galleryId);
            const images = gallery.querySelectorAll('.image-wrapper img');
            const prevBtn = gallery.querySelector('.prev-btn');
            const nextBtn = gallery.querySelector('.next-btn');
            const dotsContainer = gallery.querySelector('.dots-container');
            let currentIndex = 0;
            
            // إنشاء نقاط التنقل
            images.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if(index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToImage(index);
                });
                dotsContainer.appendChild(dot);
            });
            
            const dots = gallery.querySelectorAll('.dot');
            
            function goToImage(index) {
                images[currentIndex].classList.remove('active');
                dots[currentIndex].classList.remove('active');
                
                currentIndex = index;
                
                images[currentIndex].classList.add('active');
                dots[currentIndex].classList.add('active');
            }
            
            prevBtn.addEventListener('click', () => {
                const newIndex = (currentIndex - 1 + images.length) % images.length;
                goToImage(newIndex);
            });
            
            nextBtn.addEventListener('click', () => {
                const newIndex = (currentIndex + 1) % images.length;
                goToImage(newIndex);
            });
            
            // التمرير التلقائي
            let interval = setInterval(() => {
                const newIndex = (currentIndex + 1) % images.length;
                goToImage(newIndex);
            }, 3000);
            
            gallery.addEventListener('mouseenter', () => {
                clearInterval(interval);
            });
            
            gallery.addEventListener('mouseleave', () => {
                interval = setInterval(() => {
                    const newIndex = (currentIndex + 1) % images.length;
                    goToImage(newIndex);
                }, 3000);
            });
        }
        
        // تهيئة جميع المعارض
        document.addEventListener('DOMContentLoaded', () => {
            initGallery('gallery1');
            initGallery('gallery2');
            initGallery('gallery3');
            initGallery('gallery4');
        });