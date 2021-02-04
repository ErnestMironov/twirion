export default function menu() {
    (function () {

        const target = document.querySelector(".menu__line");
        const links = document.querySelectorAll(".menu__item a");

        function mouseenterFunc() {
            if (!this.parentNode.classList.contains("hover")) {
                for (let i = 0; i < links.length; i++) {
                    if (links[i].parentNode.classList.contains("hover")) {
                        links[i].parentNode.classList.remove("hover");
                    }
                }

                this.parentNode.classList.add("hover");

                const width = this.getBoundingClientRect().width;
                const height = this.getBoundingClientRect().height;
                const left = this.getBoundingClientRect().left;
                const top = this.getBoundingClientRect().top + window.pageYOffset;

                target.style.width = `${width + 10}px`;
                // target.style.height = `${height}px`;
                target.style.left = `${left - 5}px`;
                target.style.top = `${top + height}px`;
                target.style.transform = "none";
            }
        }

        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener("click", (e) => e.preventDefault());
            links[i].addEventListener("mouseenter", mouseenterFunc);
        }

        function resizeFunc() {
            const hover = document.querySelector(".mynav li.hover");

            if (hover) {
                const left = hover.getBoundingClientRect().left + window.pageXOffset;
                const top = hover.getBoundingClientRect().top + window.pageYOffset;

                target.style.left = `${left}px`;
                target.style.top = `${top}px`;
            }
        }

        window.addEventListener("resize", resizeFunc);

    })();
}
