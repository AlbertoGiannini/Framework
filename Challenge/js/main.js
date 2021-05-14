/**
 * @file Main runtime
 * @author Gleidson Braga 
 */

const configureFormEvents = () => {
    const form = document.getElementsByTagName('form').item(0);
    form.addEventListener('keydown', formOnChange);
    form.addEventListener('submit', formOnSubmit);
}

window.onload = () => {
    configureFormEvents();
    renderJobPage();
}