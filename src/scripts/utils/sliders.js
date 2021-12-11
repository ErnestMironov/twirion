import { Swiper, Navigation } from 'swiper';


export default function sliders() {
    const reviewsBlock = document.querySelector('.reviews')
    function initSwiper() {
        const containerOffset = (document.body.offsetWidth - document.querySelector(".reviews .container").offsetWidth) / 2
        console.log(containerOffset);
        const swiper = new Swiper(".reviews .tab-pane.active .swiper-container", {
            spaceBetween: 50,
            slidesPerView: 'auto',
            slidesOffsetBefore: containerOffset,
            slidesOffsetAfter: containerOffset,
            navigation: {
                prevEl: '.reviews__nav-btn_prev',
                nextEl: '.reviews__nav-btn_next'
            }
        })
        return swiper
    }

    initSwiper()

    reviewsBlock.addEventListener('click', (e) => {
        if (e.target.closest("a").classList.contains("tab")) {
            initSwiper()
        }
    })
}