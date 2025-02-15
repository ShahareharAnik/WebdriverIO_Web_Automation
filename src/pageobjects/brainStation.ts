import { $ } from '@wdio/globals';

class brainStationObjects {
    get homepagesearch() { return $("//input[contains(@class, 'elementor-search-form__input')]"); }
    get searchButton() { return $("//button[@class='elementor-search-form__submit']"); }
    get url() { return browser.url('https://brainstation-23.com/?1'); }
}

export default new brainStationObjects();