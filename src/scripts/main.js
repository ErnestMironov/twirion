import menu from './utils/menu';
import starSky from './utils/stars';
import tabs from 'tabs';
import sliders from './utils/sliders';


menu();
starSky();
sliders();

const tabContainers = document.querySelectorAll('.tab-container')

tabContainers.forEach((tab) => {
    tabs(tab)
})